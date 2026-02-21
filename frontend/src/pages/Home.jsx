import { Link } from "react-router-dom";
import earthBg from "../assets/HomeImage.png";

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden">


      {/* BACKGROUND */}
      <img
        src={earthBg}
        alt="bg"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* CONTENT */}
      <div className="relative z-20 flex h-full items-center justify-center text-center text-white">

        <div>
          <h1 className="text-6xl font-bold mb-8">
            Smart Complaint Management System
          </h1>

          <div className="flex gap-6 justify-center">
            <Link
              to="/register"
              className="bg-blue-400 px-8 py-4 rounded-lg hover:scale-105 transition"
            >
              Get Started
            </Link>

            <Link
              to="/select-role"
              className="bg-indigo-400 px-8 py-4 rounded-lg hover:scale-105 transition"
            >
              Login
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
