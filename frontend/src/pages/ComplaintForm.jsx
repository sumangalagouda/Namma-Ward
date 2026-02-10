import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  MapPin, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  Camera,
  FileText,
  Loader2,
  X,
  Navigation
} from "lucide-react";

export default function ComplaintForm() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [issueName, setIssueName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [locationStatus, setLocationStatus] = useState("detecting"); // detecting, success, error

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Issue type icons and labels
  const issueTypes = [
    { value: "pothole", label: "Pothole", icon: "🕳️", color: "orange" },
    { value: "garbage", label: "Garbage", icon: "🗑️", color: "green" },
    { value: "streetlight", label: "Street Light", icon: "💡", color: "yellow" },
    { value: "drainage", label: "Drainage", icon: "🌊", color: "blue" },
    { value: "traffic_signal", label: "Traffic Signal", icon: "🚦", color: "red" },
    { value: "open_manhole", label: "Open Manhole", icon: "⚠️", color: "red" },
    { value: "sewage_overflow", label: "Sewage Overflow", icon: "💧", color: "brown" },
    { value: "electric_hazard", label: "Electric Hazard", icon: "⚡", color: "yellow" },
    { value: "fallen_tree", label: "Fallen Tree", icon: "🌳", color: "green" },
    { value: "Uncategorized", label: "Other", icon: "📝", color: "gray" },
  ];

  // -------------------
  // AUTO GPS CAPTURE
  // -------------------
  useEffect(() => {
    setLocationStatus("detecting");
    
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setLocationStatus("success");
      },
      (err) => {
        setLocationStatus("error");
        setError("Location permission required. Please enable location access.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // -------------------
  // RETRY LOCATION
  // -------------------
  const retryLocation = () => {
    setLocationStatus("detecting");
    setError("");
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setLocationStatus("success");
      },
      () => {
        setLocationStatus("error");
        setError("Unable to get location. Please try again.");
      }
    );
  };

  // -------------------
  // IMAGE HANDLING
  // -------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFieldErrors({ ...fieldErrors, image: "Image size must be less than 5MB" });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFieldErrors({ ...fieldErrors, image: "Please select a valid image file" });
        return;
      }

      setImage(file);
      setFieldErrors({ ...fieldErrors, image: null });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  // -------------------
  // VALIDATION
  // -------------------
  const validateForm = () => {
    const errors = {};

    if (!title.trim()) errors.title = "Title is required";
    if (title.length > 100) errors.title = "Title must be less than 100 characters";
    
    if (!description.trim()) errors.description = "Description is required";
    if (description.length < 10) errors.description = "Description must be at least 10 characters";
    
    if (!issueName) errors.issueName = "Please select an issue type";
    
    if (!image) errors.image = "Please upload an image of the issue";
    
    if (!lat || !lng) errors.location = "Location is required";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // -------------------
  // SUBMIT
  // -------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("issue_name", issueName);
      formData.append("image", image);
      formData.append("latitude", lat);
      formData.append("longitude", lng);

      await api.post("/complaints", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // Success animation
      setCurrentStep(3);
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit complaint. Please try again.");
      setIsSubmitting(false);
    }
  };

  // -------------------
  // SUCCESS SCREEN
  // -------------------
  if (currentStep === 3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md animate-in zoom-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle2 size={48} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Complaint Submitted!
          </h2>
          <p className="text-gray-600 mb-6">
            Your complaint has been registered successfully. We'll review it shortly.
          </p>
          <div className="animate-pulse">
            <Loader2 className="animate-spin mx-auto text-green-600" size={24} />
            <p className="text-sm text-gray-500 mt-2">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            File a Complaint
          </h1>
          <p className="text-gray-600">
            Report public issues and help improve your community
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
              currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <span className="text-sm font-medium text-gray-600">Details</span>
          </div>
          <div className="w-16 h-1 bg-gray-200 rounded">
            <div className={`h-full bg-indigo-600 rounded transition-all ${currentStep >= 2 ? 'w-full' : 'w-0'}`}></div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
              currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <span className="text-sm font-medium text-gray-600">Submit</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          
          {/* Location Status Banner */}
          <div className={`p-4 flex items-center justify-between ${
            locationStatus === 'success' ? 'bg-green-50 border-b border-green-100' :
            locationStatus === 'error' ? 'bg-red-50 border-b border-red-100' :
            'bg-blue-50 border-b border-blue-100'
          }`}>
            <div className="flex items-center gap-3">
              {locationStatus === 'detecting' && (
                <>
                  <Loader2 className="animate-spin text-blue-600" size={20} />
                  <span className="text-sm font-medium text-blue-800">Detecting your location...</span>
                </>
              )}
              {locationStatus === 'success' && (
                <>
                  <MapPin className="text-green-600" size={20} />
                  <span className="text-sm font-medium text-green-800">
                    Location captured: {lat?.toFixed(4)}, {lng?.toFixed(4)}
                  </span>
                </>
              )}
              {locationStatus === 'error' && (
                <>
                  <AlertCircle className="text-red-600" size={20} />
                  <span className="text-sm font-medium text-red-800">Location access denied</span>
                </>
              )}
            </div>
            {locationStatus === 'error' && (
              <button
                type="button"
                onClick={retryLocation}
                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                <Navigation size={16} />
                Retry
              </button>
            )}
          </div>

          <div className="p-8">
            
            {/* Global Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3 animate-in slide-in-from-top">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-red-800 font-medium">Error</p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Complaint Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  placeholder="e.g., Large pothole on Main Street"
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg outline-none transition-all ${
                    fieldErrors.title ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' :
                    'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                  }`}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (fieldErrors.title) setFieldErrors({ ...fieldErrors, title: null });
                  }}
                  maxLength={100}
                />
              </div>
              <div className="flex justify-between items-center mt-1">
                {fieldErrors.title && (
                  <p className="text-red-500 text-xs">{fieldErrors.title}</p>
                )}
                <p className="text-gray-400 text-xs ml-auto">{title.length}/100</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Provide detailed information about the issue..."
                className={`w-full p-3 border-2 rounded-lg outline-none transition-all resize-none ${
                  fieldErrors.description ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' :
                  'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                }`}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (fieldErrors.description) setFieldErrors({ ...fieldErrors, description: null });
                }}
                rows={4}
              />
              <div className="flex justify-between items-center mt-1">
                {fieldErrors.description && (
                  <p className="text-red-500 text-xs">{fieldErrors.description}</p>
                )}
                <p className="text-gray-400 text-xs ml-auto">{description.length} characters</p>
              </div>
            </div>

            {/* Issue Type - Card Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Issue Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {issueTypes.map((issue) => (
                  <button
                    key={issue.value}
                    type="button"
                    onClick={() => {
                      setIssueName(issue.value);
                      if (fieldErrors.issueName) setFieldErrors({ ...fieldErrors, issueName: null });
                    }}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      issueName === issue.value
                        ? 'border-indigo-500 bg-indigo-50 shadow-md scale-105'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow'
                    }`}
                  >
                    <div className="text-3xl mb-2">{issue.icon}</div>
                    <div className="text-xs font-medium text-gray-700">{issue.label}</div>
                  </button>
                ))}
              </div>
              {fieldErrors.issueName && (
                <p className="text-red-500 text-xs mt-2">{fieldErrors.issueName}</p>
              )}
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Image <span className="text-red-500">*</span>
              </label>
              
              {!imagePreview ? (
                <label className={`block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                  fieldErrors.image ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-indigo-500 hover:bg-indigo-50'
                }`}>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <Camera className="mx-auto text-gray-400 mb-3" size={48} />
                  <p className="text-gray-600 font-medium mb-1">Click to upload image</p>
                  <p className="text-gray-400 text-sm">PNG, JPG up to 5MB</p>
                </label>
              ) : (
                <div className="relative rounded-lg overflow-hidden border-2 border-indigo-500 group">
                  <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-3 rounded-full transition-all hover:scale-110"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
              )}
              {fieldErrors.image && (
                <p className="text-red-500 text-xs mt-2">{fieldErrors.image}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || locationStatus !== 'success'}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                isSubmitting || locationStatus !== 'success'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-xl hover:scale-105'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Submitting...
                </>
              ) : locationStatus !== 'success' ? (
                <>
                  <AlertCircle size={24} />
                  Enable Location to Submit
                </>
              ) : (
                <>
                  <Upload size={24} />
                  Submit Complaint
                </>
              )}
            </button>

            <p className="text-center text-gray-500 text-sm mt-4">
              By submitting, you agree to our terms and conditions
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}