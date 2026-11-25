import os
import shutil
import torch
import clip

def load_clip(config):
    # Use device from config, not auto-detect
    device = config.device
    print(f"Loading CLIP model on device: {device}")
    cache_dir = os.path.expanduser("~/.cache/clip")
    try:
        os.makedirs(cache_dir, exist_ok=True)
        model, preprocess = clip.load(config.model_name, device=device)
        return model, preprocess
    except Exception as e:
        print(f"Failed to load CLIP model ({e}). Checking cache...")
        if "Permission denied" in str(e):
            print(f"Permission error accessing {cache_dir}. Re-raising.")
            raise
        if os.path.exists(cache_dir):
            print(f"Removing corrupted cache in {cache_dir} and retrying clean download...")
            try:
                for f in os.listdir(cache_dir):
                    fp = os.path.join(cache_dir, f)
                    if os.path.isfile(fp):
                        os.unlink(fp)
            except Exception as rm_err:
                print(f"Failed to clear cache: {rm_err}")
            model, preprocess = clip.load(config.model_name, device=device)
            return model, preprocess
        raise

def compute_image_features(model, image_tensor, device):
    """Extract features from preprocessed image tensor"""
    # Ensure tensor is on the correct device
    image_tensor = image_tensor.to(device)
    with torch.no_grad():
        features = model.encode_image(image_tensor)
    return features / features.norm(dim=-1, keepdim=True)