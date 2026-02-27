import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import loginpng from "../assets/login.png";
import logo from "../assets/logo.jpeg";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Shield
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Real-time validation
  const validateField = (field, value) => {
    const errors = { ...fieldErrors };

    if (field === "email") {
      if (!value.trim()) {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.email = "Please enter a valid email";
      } else {
        delete errors.email;
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
    if (!email.trim() || !password) {
      setError("Please fill in all fields");
      setTouched({ email: true, password: true });
      return;
    }

    if (Object.keys(fieldErrors).length > 0) {
      setError("Please fix the errors before submitting");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.access_token);

      // Success feedback
      await new Promise(resolve => setTimeout(resolve, 500));

      navigate("/dashboard");
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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-indigo-900/70 to-purple-900/80 backdrop-blur-sm"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/90 hover:text-white bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl hover:bg-white/20 transition-all border border-white/20"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Home</span>
      </Link>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        
        {/* Logo/Header */}
        <div className="text-center mb-8 animate-in slide-in-from-top">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-2xl mb-4 overflow-hidden">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            Welcome Back
            <Sparkles className="text-yellow-400" size={24} />
          </h1>
          <p className="text-blue-100 text-lg">Sign in to continue to Namma Ward</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 animate-in zoom-in">
          
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"></div>
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
            
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl outline-none transition-all ${
                    touched.email && fieldErrors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                  }`}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateField("email", e.target.value);
                  }}
                  onBlur={() => handleBlur("email")}
                  disabled={isLoading}
                />
                {touched.email && !fieldErrors.email && email && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={20} />
                )}
              </div>
              {touched.email && fieldErrors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`w-full pl-11 pr-12 py-3 border-2 rounded-xl outline-none transition-all ${
                    touched.password && fieldErrors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
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
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-gray-600 group-hover:text-gray-800 transition-colors">Remember me</span>
              </label>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
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
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn size={24} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600 mb-4">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Sign Up
              </Link>
            </p>
            
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-3">Or sign in as</p>
              <div className="flex gap-3 justify-center">
                <Link
                  to="/officer-login"
                  className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-all font-medium text-sm"
                >
                  <Shield size={16} />
                  Officer
                </Link>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
            <Lock size={14} className="text-blue-600" />
            <span>Secured with end-to-end encryption</span>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/80 text-sm mt-6">
          © 2026 Namma Ward | Citizen Portal
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
      `}</style>
    </div>
  );
}