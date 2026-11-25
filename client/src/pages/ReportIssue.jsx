// ReportIssue.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapPinIcon, CameraIcon, PhotoIcon, MicrophoneIcon } from "@heroicons/react/24/outline";
import "./ReportIssue.css";
import { useAuth } from '@clerk/clerk-react'; 


const ReportIssue = () => {
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [district, setDistrict] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState(null);
  const [locating, setLocating] = useState(false);
  const [loadingDistrict, setLoadingDistrict] = useState(false);
  const [voiceDesc, setVoiceDesc] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingText, setSubmittingText] = useState("Submitting...");
  const fileInputRef = useRef();
  const cameraInputRef = useRef();
  const recognitionRef = useRef(null);
  const { getToken } = useAuth();

  const navigate = useNavigate();
  // Get district information from coordinates using reverse geocoding
  const getDistrictFromCoordinates = async (coords) => {
    if (!coords) return;
    
    setLoadingDistrict(true);
    try {
      // Using Nominatim (OpenStreetMap) reverse geocoding - completely free
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&zoom=10&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        const address = data.address || {};
        
        // Extract district information (trying multiple possible fields)
        const districtInfo = 
          address.state_district || 
          address.county || 
          address.district || 
          address.administrative || 
          address.city || 
          address.town || 
          address.village || 
          "District not found";
          
        const state = address.state || "";
        const country = address.country || "";
        
        const fullDistrict = `${districtInfo}${state ? ', ' + state : ''}${country ? ', ' + country : ''}`;
        setDistrict(fullDistrict);
      } else {
        setDistrict("Unable to fetch district information");
      }
    } catch (error) {
      console.error("Error fetching district:", error);
      setDistrict("Error fetching district information");
    } finally {
      setLoadingDistrict(false);
    }
  };

  useEffect(() => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          setCoordinates(coords);
          setLocation(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`);
          getDistrictFromCoordinates(coords);
          setLocating(false);
        },
        () => {
          // Default to Ranchi, Jharkhand
          const defaultCoords = { lat: 23.3441, lng: 85.3096 };
          setCoordinates(defaultCoords);
          setLocation("Unable to detect location (using Ranchi, Jharkhand)");
          getDistrictFromCoordinates(defaultCoords);
          setLocating(false);
        }
      );
    } else {
      const defaultCoords = { lat: 23.3441, lng: 85.3096 };
      setCoordinates(defaultCoords);
      setLocation("Geolocation not supported (using Ranchi, Jharkhand)");
      getDistrictFromCoordinates(defaultCoords);
      setLocating(false);
    }
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !description.trim() || !coordinates) {
      alert("Please provide all required fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmittingText("Preparing upload...");

    try {
      const token = await getToken();

      // Step 1: Request presigned Cloudinary upload signature from backend
      setSubmittingText("Authorizing upload...");
      const sigRes = await fetch(`${import.meta.env.VITE_API_URL}/users/upload-signature`, {
        method: "GET",
        credentials: "include",
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const sigData = await sigRes.json();
      if (!sigRes.ok || !sigData?.data) {
        throw new Error(sigData.message || "Failed to get upload signature");
      }

      const { signature, timestamp, apiKey, cloudName, folder } = sigData.data;

      // Step 2: Direct upload from client browser to Cloudinary
      setSubmittingText("Uploading image...");
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", image);
      cloudinaryFormData.append("api_key", apiKey);
      cloudinaryFormData.append("timestamp", timestamp);
      cloudinaryFormData.append("signature", signature);
      cloudinaryFormData.append("folder", folder);

      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: cloudinaryFormData
      });

      const cloudData = await cloudRes.json();
      if (!cloudRes.ok || !cloudData.secure_url) {
        throw new Error(cloudData.error?.message || "Direct image upload failed");
      }

      const imageUrl = cloudData.secure_url;

      // Step 3: Submit lightweight JSON report payload to backend
      setSubmittingText("Submitting report...");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/validate`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify({
          imageUrl,
          description,
          location: district || location,
          lat: coordinates.lat,
          lng: coordinates.lng
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit report");
      }

      // Navigate immediately — the placeholder record is already in DB with imageUrl
      navigate('/reports', { state: { newReportSubmitted: true } });

    } catch (err) {
      alert("Submission error: " + err.message);
      setIsSubmitting(false);
      setSubmittingText("Submitting...");
    }
  };

  const startVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser.');
      return;
    }
    setIsRecording(true);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      setVoiceDesc(event.results[0][0].transcript);
      setIsRecording(false);
    };
    recognition.onerror = () => {
      setIsRecording(false);
      alert('Voice recognition error.');
    };
    recognition.onend = () => {
      setIsRecording(false);
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="report-issue min-h-screen relative overflow-hidden">
      {/* Static Background Image with Blur */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full"
         
        />
        
        {/* Location Pin Overlay */}
        {!locating && coordinates && (
          <div 
            className="absolute z-10 transform -translate-x-1/2 -translate-y-full"
            style={{
              left: '50%',
              top: '50%',
            }}
          >
            <div className="relative">
              {/* Pin Shadow */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-black opacity-20 rounded-full blur-sm"></div>
              {/* Pin */}
              <div className="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg animate-bounce">
                <div className="w-full h-full rounded-full bg-red-500 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              {/* Location Label */}
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {coordinates && `${coordinates.lat.toFixed(3)}, ${coordinates.lng.toFixed(3)}`}
              </div>
            </div>
          </div>
        )}
        
        {/* Overlay for better form visibility */}
        {/* <div className="absolute inset-0 bg-black bg-opacity-30"></div> */}
      </div>

      {/* Form Container - Increased Height */}
      <div className="relative z-20 flex items-center justify-center min-h-screen p-4 py-8">
        <div className="max-w-lg w-full mx-auto p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 min-h-[700px]">
          <h2 className="text-2xl font-bold mb-8 text-center text-blue-700">Report an Issue</h2>
          
          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            {/* Location (auto-detected) */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Location (auto-detected)</label>
              <div className="flex items-center gap-2 bg-gray-50 rounded px-3 py-3 border border-gray-200 mb-2">
                <MapPinIcon className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700 text-sm font-mono">
                  {locating ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      Detecting location...
                    </span>
                  ) : location}
                </span>
              </div>
              {/* District Information */}
              <div className="bg-blue-50 rounded px-3 py-2 border border-blue-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-blue-700">District:</span>
                  <span className="text-sm text-blue-600">
                    {loadingDistrict ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                        Loading district...
                      </span>
                    ) : district}
                  </span>
                </div>
              </div>
            </div>

            {/* Image upload options */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Upload an Image</label>
              <div className="flex items-center gap-4 flex-wrap mb-3">
                <button
                  type="button"
                  className="flex items-center gap-2 cursor-pointer bg-gray-100 px-4 py-3 rounded hover:bg-gray-200 border border-gray-200 transition-colors"
                  onClick={() => cameraInputRef.current.click()}
                >
                  <CameraIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-700">Click on Spot</span>
                </button>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  ref={cameraInputRef}
                  onChange={handleImage}
                />
                
                <button
                  type="button"
                  className="flex items-center gap-2 cursor-pointer bg-gray-100 px-4 py-3 rounded hover:bg-gray-200 border border-gray-200 transition-colors"
                  onClick={() => fileInputRef.current.click()}
                >
                  <PhotoIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-700">Upload from Device</span>
                </button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImage}
                />
                
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg border border-gray-300 shadow-sm"
                  />
                )}
              </div>
              <p className="text-xs text-gray-500">
                On laptops, you may need to select 'Camera' in the file picker if available.
              </p>
            </div>

            {/* Short description */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Short Description</label>
              <textarea
                className="w-full min-h-[80px] border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-800 resize-none"
                placeholder="Describe the issue briefly..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={200}
                required
              />
              <div className="text-xs text-gray-500 mt-2 text-right">
                {description.length}/200
              </div>
            </div>

            {/* Voice Description */}
            <div>
              <label className="block text-m font-semibold mb-3 text-gray-700">Voice Description (optional)</label>
              <div className="flex items-center gap-3 mb-3">
                <button
                  type="button"
                  className={`flex items-center gap-2 px-4 py-3 rounded bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-colors ${
                    isRecording ? 'bg-red-100 border-red-200' : ''
                  }`}
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                >
                  <MicrophoneIcon className={`w-5 h-5 ${isRecording ? 'text-red-500' : 'text-gray-500'}`} />
                  <span className="text-sm text-gray-700">
                    {isRecording ? "Stop Recording" : "Record Voice"}
                  </span>
                </button>
                {isRecording && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-red-600">Recording...</span>
                  </div>
                )}
              </div>
              {voiceDesc && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xl text-gray-700">
                  <strong>Voice note:</strong> {voiceDesc}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-md text-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
              disabled={!coordinates || !description.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{submittingText}</span>
                </>
              ) : (
                "Submit Report"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
