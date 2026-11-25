from ml.config import ModelConfig
from ml.feature_extractor import load_clip, compute_image_features
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
import torch
import joblib
import json
import os
from io import BytesIO
import sys
import traceback
import requests

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

app = Flask(__name__)
CORS(app)  # Enable CORS

class ModelCache:
    def __init__(self):
        self.probe = None
        self.text_features = None
        self.clip_model = None
        self.preprocess = None
        self.config = None
        self.classes = None
        self.device = None

    def load_models(self):
        """Load all models on startup using relative paths"""
        base_dir = os.path.dirname(os.path.abspath(__file__))
        artifacts_dir = os.path.join(base_dir, 'ml', 'artifacts')

        print(f"Loading runtime config from: {artifacts_dir}")
        with open(os.path.join(artifacts_dir, 'runtime_config.json')) as f:
            self.config = json.load(f)

        self.classes = self.config['classes']
        print(f"Classes: {self.classes}")

        print("Loading trained probe...")
        self.probe = joblib.load(os.path.join(artifacts_dir, 'linear_probe.joblib'))

        print("Loading cached text features...")
        self.text_features = torch.tensor(
            np.load(os.path.join(artifacts_dir, 'text_features.npy'))
        )

        print("Loading CLIP model...")
        model_cfg = ModelConfig()
        self.device = model_cfg.device
        self.clip_model, self.preprocess = load_clip(model_cfg)

        self.text_features = self.text_features.to(self.device)
        print("✅ All models loaded successfully!")

# Initialize model cache
cache = ModelCache()

# Load models on startup (gracefully caught so worker always boots)
try:
    print("🚀 Initializing Civic Issue Classification API...")
    print("Loading models on startup...")
    cache.load_models()
    print("✅ Models loaded successfully! API is ready.")
except Exception as e:
    print(f"⚠️ Warning: ML models could not be loaded at boot: {e}")

def softmax(logits):
    """Compute softmax with numerical stability"""
    exp = np.exp(logits - logits.max(axis=-1, keepdims=True))
    return exp / (exp.sum(axis=-1, keepdims=True) + 1e-9)

def compute_image_features(model, image_tensor, device):
    image_tensor = image_tensor.to(device)
    with torch.no_grad():
        features = model.encode_image(image_tensor)
    return features

def predict_image(image_pil):
    device = cache.device
    image_tensor = cache.preprocess(image_pil).unsqueeze(0).to(device)
    img_features = compute_image_features(cache.clip_model, image_tensor, device)

    # Zero-shot classification
    zs_logits = (img_features @ cache.text_features.t()) / 0.01
    zs_probs = softmax(zs_logits.detach().cpu().numpy())

    # Reduce prompts to classes (6 prompts per class)
    num_classes = len(cache.classes)
    prompts_per_class = 6

    zs_probs_class = []
    for c_idx in range(num_classes):
        start = c_idx * prompts_per_class
        end = (c_idx + 1) * prompts_per_class
        zs_probs_class.append(zs_probs[:, start:end].max(axis=1))

    zs_probs_class = np.stack(zs_probs_class, axis=1)

    # Linear probe classification
    probe_probs = cache.probe.predict_proba(img_features.cpu().numpy())

    # Blend predictions (70% probe, 30% zero-shot)
    alpha = 0.7
    blended = alpha * probe_probs + (1 - alpha) * zs_probs_class

    # Get final prediction
    pred_idx = int(blended[0].argmax())
    confidence = float(blended[0].max())

    # Create probability distribution
    all_probs = {cache.classes[i]: float(blended[0][i]) for i in range(len(cache.classes))}

    return {
        'predicted_class': cache.classes[pred_idx],
        'confidence': confidence,
        'all_probabilities': all_probs
    }

@app.route('/')
def home():
    return jsonify({
        'message': 'Civic Issue Classification API',
        'status': 'ready',
        'classes': cache.classes,
        'endpoints': {
            '/predict': 'POST - Upload image for classification',
            '/health': 'GET - Health check'
        }
    })

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy', 
        'models_loaded': cache.probe is not None,
        'device': str(cache.device) if cache.device else 'not_loaded'
    })

@app.route('/predict', methods=['POST'])
def predict():
    print("📸 Received prediction request!")
    try:
        # Check if image file or URL is provided
        if 'image' in request.files:
            # File upload (for local testing)
            file = request.files['image']
            if file.filename == '':
                return jsonify({'error': 'No image file selected'}), 400
            
            print(f"Processing uploaded file: {file.filename}")
            image = Image.open(BytesIO(file.read())).convert('RGB')
            
        elif request.is_json and 'image_url' in request.json:
            # URL-based (for production with Cloudinary)
            image_url = request.json['image_url']
            print(f"Downloading image from URL: {image_url}")
            
            response = requests.get(image_url, timeout=10)
            response.raise_for_status()
            image = Image.open(BytesIO(response.content)).convert('RGB')
            
        else:
            return jsonify({'error': 'No image file or image_url provided'}), 400

        # Run prediction
        if cache.clip_model is None:
            try:
                cache.load_models()
            except Exception as load_err:
                print(f"⚠️ ML models currently unavailable, returning default class: {load_err}")
                return jsonify({
                    'success': True,
                    'result': {
                        'predicted_class': 'others',
                        'confidence': 0.0,
                        'all_probabilities': {}
                    },
                    'message': 'Fallback classification'
                })

        result = predict_image(image)
        print(f"✅ Prediction: {result['predicted_class']} ({result['confidence']:.1%})")

        return jsonify({
            'success': True,
            'result': result,
            'message': f'Image classified as {result["predicted_class"]} with {result["confidence"]:.1%} confidence'
        })

    except requests.exceptions.RequestException as e:
        print(f"❌ URL fetch error: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': f'Failed to download image: {str(e)}'
        }), 400
        
    except Exception as e:
        print(f"❌ Prediction error: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    # Don't reload models - already loaded at module import
    port = int(os.environ.get('PORT', 7860))
    print(f"🌟 Server ready on port {port}!")
    app.run(host='0.0.0.0', port=port, debug=False)