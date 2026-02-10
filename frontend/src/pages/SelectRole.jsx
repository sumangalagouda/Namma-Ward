import { Link } from "react-router-dom";
import { User, Shield } from "lucide-react";
// import option from "../assets/option.png";
import selectRole from "../assets/selectRole.png";

export default function SelectRole() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-6">

<div className="relative bg-white shadow-2xl rounded-3xl p-12 w-full max-w-4xl text-center overflow-hidden">
                {/* BACKGROUND IMAGE */}
        <img
          src={selectRole}
          alt="background"
className="absolute inset-0 w-full h-full object-cover opacity-20 z-0 pointer-events-none"
        />
        {/* Title */}
        <h1 className="text-4xl font-bold mb-3 text-gray-800">
          Choose Your Role
        </h1>

        <p className="text-gray-500 mb-10">
          Select how you want to continue
        </p>
        

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-10">

          {/* Officer */}
          <Link
            to="/officer-login"
            className="group p-10 rounded-2xl border hover:shadow-xl hover:-translate-y-2 transition duration-300"
          >
            <div className="flex justify-center mb-5 text-blue-600 group-hover:scale-110 transition">
              <Shield size={60} />
            </div>

            <h2 className="text-2xl font-semibold mb-2">Officer</h2>

            <p className="text-gray-500 text-sm">
              Handle complaints, update status, and earn performance rewards.
            </p>
          </Link>



          {/* Citizen */}
          <Link
            to="/login"
            className="group p-10 rounded-2xl border hover:shadow-xl hover:-translate-y-2 transition duration-300"
          >
            <div className="flex justify-center mb-5 text-indigo-600 group-hover:scale-110 transition">
              <User size={60} />
            </div>

            <h2 className="text-2xl font-semibold mb-2">Citizen</h2>

            <p className="text-gray-500 text-sm">
              Report issues, track progress, and improve your city.
            </p>
          </Link>

        </div>


        {/* Back */}
        <div className="mt-10">
          <Link
            to="/"
            className="text-blue-600 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
