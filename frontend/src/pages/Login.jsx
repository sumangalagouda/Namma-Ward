import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import loginpng from "../assets/login.png";
import logo from "../assets/logo.jpeg";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    /* 🔥 MUST be relative */
    <div className="relative h-screen w-full overflow-hidden">
    

      {/* ---------- BACKGROUND IMAGE ---------- */}
      <img
        src={loginpng}
        alt="bg"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* ---------- DARK OVERLAY ---------- */}
      <div className="absolute inset-0 bg-black/60 z-10" />


      {/* ---------- CONTENT ---------- */}
      <div className="relative z-20 flex items-center justify-center h-full">
      
        <form
          onSubmit={handleLogin}
          className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-10 w-96"
        >
                    {/* ---------- LOGO ---------- */}
          <div className="flex justify-center mb-4">
            <img
              src={logo}
              alt="logo"
              className="h-16 w-16 object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Login
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 p-3 mb-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-3 mb-6 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 hover:scale-105 transition">
            Login
          </button>

          <p className="text-center text-sm mt-5">
            <Link to="/" className="text-blue-600 hover:underline">
              ← Back to Home
            </Link>
          </p>
        </form>

      </div>
    </div>
  );
}
