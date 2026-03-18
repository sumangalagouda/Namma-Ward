import { Link } from "react-router-dom";
import earthBg from "../assets/HomeImage.png";
import { CheckCircle2, MapPin, FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full">

      {/* HERO */}
      <section className="relative w-full bg-gradient-to-br from-teal-50 via-indigo-50 to-cyan-100 overflow-hidden">

        {/* Glow Effects */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-400 opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-400 opacity-20 blur-3xl rounded-full"></div>

        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">

            {/* Text */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-teal-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Smart Complaint Management System
              </h1>

              <p className="max-w-xl text-lg text-slate-600 mb-6">
                Report issues, track progress, and collaborate with your local officers — all in one
                transparent platform designed for fast civic action.
              </p>

              <div className="flex gap-4">
                <Link
                  to="/register"
                  className="px-5 py-3 rounded-lg font-semibold text-white shadow-lg bg-gradient-to-r from-teal-600 via-blue-500 to-indigo-600 hover:scale-105 transition transform duration-300"
                >
                  Get Started
                </Link>

                <Link
                  to="/select-role"
                  className="px-5 py-3 rounded-lg bg-white/80 backdrop-blur text-indigo-600 border border-indigo-100 hover:text-indigo-700 transition"
                >
                  Login
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 p-6">
                <div className="p-3 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg">
                  <img
                    src={earthBg}
                    alt="hero"
                    className="w-full h-auto max-h-80 object-contain"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-16">

        {/* ABOUT */}
        <section className="grid md:grid-cols-2 gap-10 items-center mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-teal-900">What we do</h2>

            <p className="text-gray-600 mb-4">
              This platform helps citizens report public issues (like potholes, streetlight outages,
              and sanitation problems), lets officers manage and update status, and provides
              transparency through realtime updates and citizen verification.
            </p>

            <p className="text-gray-600">
              Every report is automatically assigned to an area officer, tracked through a simple
              workflow, and can be verified by the reporting citizen once resolved.
            </p>
          </div>

          <div className="bg-gradient-to-br from-white via-teal-50 to-indigo-50 rounded-xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-semibold mb-3 text-teal-800">Impact</h3>

            <p className="text-sm text-gray-600 mb-4">
              Measure and showcase improvements in your community with dashboards and leaderboards.
            </p>

            <div className="space-y-3">

              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 mt-1" />
                <div>
                  <div className="font-semibold">Fast Assignment</div>
                  <div className="text-sm text-gray-500">
                    Complaints routed automatically.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="text-blue-600 mt-1" />
                <div>
                  <div className="font-semibold">Geo-tagged</div>
                  <div className="text-sm text-gray-500">
                    Location-based tracking.
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-teal-900">How it works</h2>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border shadow-sm text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="text-indigo-600" />
              </div>
              <h4 className="font-semibold mb-2 text-indigo-800">Report</h4>
              <p className="text-sm text-gray-500">Submit complaint with details.</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border shadow-sm text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2 text-blue-800">Assign</h4>
              <p className="text-sm text-gray-500">System assigns officer.</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-xl border shadow-sm text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="text-emerald-600" />
              </div>
              <h4 className="font-semibold mb-2 text-emerald-800">Resolve</h4>
              <p className="text-sm text-gray-500">Issue resolved & verified.</p>
            </div>

          </div>
        </section>

        {/* FEATURES */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-teal-900">Features</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            <div className="relative bg-white p-5 rounded-xl border shadow-sm hover:shadow-lg transition overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-cyan-500"></div>
              <h5 className="font-semibold mb-2 text-teal-800">Dashboards</h5>
              <p className="text-sm text-gray-500">Track system performance.</p>
            </div>

            <div className="relative bg-white p-5 rounded-xl border shadow-sm hover:shadow-lg transition overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              <h5 className="font-semibold mb-2 text-blue-800">Proof Uploads</h5>
              <p className="text-sm text-gray-500">Upload resolution proof.</p>
            </div>

            <div className="relative bg-white p-5 rounded-xl border shadow-sm hover:shadow-lg transition overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
              <h5 className="font-semibold mb-2 text-emerald-800">Verification</h5>
              <p className="text-sm text-gray-500">Citizen confirms closure.</p>
            </div>

          </div>
        </section>

        {/* CTA */}
        <section className="text-center mb-20 bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-600 text-white py-12 rounded-2xl shadow-xl">
          <h3 className="text-xl font-bold mb-3">Ready to improve your neighborhood?</h3>

          <div className="flex gap-3 justify-center">
            <Link className="bg-white text-indigo-600 px-5 py-3 rounded-lg font-semibold shadow hover:scale-105 transition">
              Create Account
            </Link>

            <Link className="px-5 py-3 rounded-lg border border-white/40 text-white hover:bg-white/10 transition">
              Browse
            </Link>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-gradient-to-tr from-slate-950 via-indigo-900 to-teal-900 text-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6">

          <div>
            <h4 className="text-white font-bold">Smart CMS</h4>
            <p className="text-sm mt-2">Civic issue reporting platform.</p>
          </div>

          <div>
            <h5 className="font-semibold mb-2">Links</h5>
            <ul className="text-sm space-y-1">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-2">Contact</h5>
            <p className="text-sm">support@cms.com</p>
          </div>

        </div>
      </footer>

    </div>
  );
}