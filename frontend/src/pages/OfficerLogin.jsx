import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import loginpng from "../assets/login.png";
import { 
  Shield, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  LogIn, 
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Sparkles
} from "lucide-react";

export default function OfficerLogin() {
  const navigate = useNavigate();

  const [offId, setOffId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Real-time validation
  const validateField = (field, value) => {
    const errors = { ...fieldErrors };

    if (field === "offId") {
      if (!value.trim()) {
        errors.offId = "Officer ID is required";
      } else if (value.length < 3) {
        errors.offId = "Officer ID must be at least 3 characters";
      } else {
        delete errors.offId;
      }
    }

    if (field === "password") {
      if (!value) {
        errors.password = "Password is required";
      } else if (value.length < 6) {
        errors.password = "Password must be at least 6 characters";
      } else {
        delete errors.password;
      }
    }

    setFieldErrors(errors);
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    if (!offId.trim() || !password) {
      setError("Please fill in all fields");
      setTouched({ offId: true, password: true });
      return;
    }

    if (Object.keys(fieldErrors).length > 0) {
      setError("Please fix the errors before submitting");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/auth/officer-login", {
        off_id: offId,
        password
      });

      // Save token
      localStorage.setItem("token", res.data.access_token);

      // Success feedback
      await new Promise(resolve => setTimeout(resolve, 500));

      // Redirect to officer dashboard
      navigate("/officer-complaints");

    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={loginpng}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/80 via-cyan-900/70 to-emerald-900/80 backdrop-blur-sm"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate("/login")}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/90 hover:text-white bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl hover:bg-white/20 transition-all border border-white/20"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Login</span>
      </button>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        
        {/* Logo/Header */}
        <div className="text-center mb-8 animate-in slide-in-from-top">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl shadow-2xl mb-4 animate-bounce-slow">
            <Shield size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            Officer Portal
            <Sparkles className="text-yellow-400" size={24} />
          </h1>
          <p className="text-cyan-100 text-lg">Secure Access for Authorized Personnel</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 animate-in zoom-in">
          
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent rounded-full"></div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3 animate-in slide-in-from-top">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-red-800 font-medium text-sm">Authentication Failed</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Officer ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Officer ID <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors" size={20} />
                <input
                  placeholder="Enter your officer ID"
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl outline-none transition-all ${
                    touched.offId && fieldErrors.offId
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
                  }`}
                  value={offId}
                  onChange={(e) => {
                    setOffId(e.target.value);
                    validateField("offId", e.target.value);
                  }}
                  onBlur={() => handleBlur("offId")}
                  disabled={isLoading}
                />
                {touched.offId && !fieldErrors.offId && offId && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={20} />
                )}
              </div>
              {touched.offId && fieldErrors.offId && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {fieldErrors.offId}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`w-full pl-11 pr-12 py-3 border-2 rounded-xl outline-none transition-all ${
                    touched.password && fieldErrors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
                  }`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validateField("password", e.target.value);
                  }}
                  onBlur={() => handleBlur("password")}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {touched.password && fieldErrors.password && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
                />
                <span className="text-gray-600 group-hover:text-gray-800 transition-colors">Remember me</span>
              </label>
              <button
                type="button"
                className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || Object.keys(fieldErrors).length > 0}
              className={`w-full py-3.5 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                isLoading || Object.keys(fieldErrors).length > 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Authenticating...
                </>
              ) : (
                <>
                  <LogIn size={24} />
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Need assistance?{" "}
              <button className="text-teal-600 hover:text-teal-700 font-medium transition-colors">
                Contact Support
              </button>
            </p>
          </div>

          {/* Security Badge */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
            <Shield size={14} className="text-teal-600" />
            <span>Secured with end-to-end encryption</span>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/80 text-sm mt-6">
          © 2026 CivicTrack | Officer Access Portal
        </p>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
      `}</style>
    </div>
  );
}