import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import reg from "../assets/reg.png";
import logo from "../assets/logo.jpeg";

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [form, setForm] = useState({
    name: "",
    password: "",
    area: "",
    state: "",
    phone_number: "",
  });

  const [error, setError] = useState("");

  // ---------- STEP 1 ----------
  const sendOtp = async () => {
    try {
      await api.post("/auth/send-otp", { email });
      setError("");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    }
  };

  // ---------- STEP 2 ----------
  const verifyOtp = async () => {
    try {
      await api.post("/auth/verify-otp", { email, otp });
      setError("");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP");
    }
  };

  // ---------- STEP 3 ----------
  const registerUser = async () => {
    try {
      await api.post("/auth/register", { ...form, email });
      alert("Registered successfully");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    /* MUST be relative for background layering */
    <div className="relative h-screen w-full overflow-hidden">

      {/* ---------------- BACKGROUND IMAGE ---------------- */}
      <img
        src={reg}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* ---------------- DARK OVERLAY ---------------- */}
      <div className="absolute inset-0 bg-black/60 z-10" />


      {/* ---------------- CONTENT ---------------- */}
      <div className="relative z-20 flex items-center justify-center h-full px-4">

        <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-10 w-full max-w-md">

          {/* ---------- LOGO ---------- */}
          <div className="flex justify-center mb-4">
            <img
              src={logo}
              alt="logo"
              className="h-16 w-16 object-contain"
            />
          </div>

          {/* ---------- TITLE ---------- */}
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Citizen Registration
          </h2>

          <p className="text-center text-xs text-gray-500 mb-4">
            Smart Complaint Management System
          </p>

          {/* ---------- STEP INDICATOR ---------- */}
          <p className="text-center text-sm text-gray-500 mb-6">
            Step {step} of 3
          </p>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          {/* ================= STEP 1 ================= */}
          {step === 1 && (
            <>
              <input
                type="email"
                placeholder="Enter Email"
                className="w-full border p-3 mb-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                onClick={sendOtp}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Send OTP
              </button>
            </>
          )}

          {/* ================= STEP 2 ================= */}
          {step === 2 && (
            <>
              <input
                placeholder="Enter OTP"
                className="w-full border p-3 mb-4 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                onChange={(e) => setOtp(e.target.value)}
              />

              <button
                onClick={verifyOtp}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
              >
                Verify OTP
              </button>
            </>
          )}

          {/* ================= STEP 3 ================= */}
          {step === 3 && (
            <>
              <input
                placeholder="Name"
                className="w-full border p-3 mb-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full border p-3 mb-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <input
                placeholder="Area"
                className="w-full border p-3 mb-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                onChange={(e) =>
                  setForm({ ...form, area: e.target.value })
                }
              />

              <input
                placeholder="State"
                className="w-full border p-3 mb-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                onChange={(e) =>
                  setForm({ ...form, state: e.target.value })
                }
              />

              <input
                placeholder="Phone Number"
                className="w-full border p-3 mb-4 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                onChange={(e) =>
                  setForm({ ...form, phone_number: e.target.value })
                }
              />

              <button
                onClick={registerUser}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
              >
                Register
              </button>
            </>
          )}

          {/* ---------- BACK LINK ---------- */}
          <p className="text-center text-sm mt-6">
            <Link to="/" className="text-blue-600 hover:underline">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
