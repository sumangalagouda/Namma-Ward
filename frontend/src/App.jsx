import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OfficerLogin from "./pages/OfficerLogin";

import Dashboard from "./pages/Dashboard";
import ComplaintForm from "./pages/ComplaintForm";
import MyComplaints from "./pages/MyComplaints";
import OfficerDashboard from "./pages/OfficerDashboard";
import OfficerComplaints from "./pages/OfficerComplaints";
import Leaderboard from "./pages/Leaderboard";
import BillPayment from "./pages/BillPayment";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SelectRole from "./pages/SelectRole";
import ComplaintView from "./pages/ComplaintView";
import OfficerProfile from "./pages/officer-profile";
import Notification from "./pages/Notifcation";
import CitizenProfile from "./pages/citizen-profile";
import OfficerDetails from "./pages/OfficerDetails";




export default function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* ---------- PUBLIC ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/officer-login" element={<OfficerLogin />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/complaint/:id" element={<ComplaintView />} />
        <Route path="/officer/:id" element={<OfficerDetails />} />

        {/* ---------- CITIZEN ---------- */}
        <Route
          path="/complaint"
          element={
            <ProtectedRoute roles={["citizen"]}>
              <ComplaintForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-complaints"
          element={
            <ProtectedRoute roles={["citizen"]}>
              <MyComplaints />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pay-bill"
          element={
            <ProtectedRoute roles={["citizen"]}>
              <BillPayment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute roles={["citizen"]}>
              <Notification />
            </ProtectedRoute>
          }
        />
          <Route
          path="/citizen-profile"
          element={
            <ProtectedRoute roles={["citizen"]}>
              <CitizenProfile />
            </ProtectedRoute>
          }
        />

        


        {/* ---------- OFFICER ---------- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["officer","citizen"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/officer-dashboard"
          element={
            <ProtectedRoute roles={["officer"]}>
              <OfficerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/officer-complaints"
          element={
            <ProtectedRoute roles={["officer"]}>
              <OfficerComplaints />
            </ProtectedRoute>
          }
        />

        <Route
          path="/officer-profile"
          element={
            <ProtectedRoute roles={["officer"]}>
              <OfficerProfile />
            </ProtectedRoute>
          }
        />


        {/* ---------- BOTH ---------- */}
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute roles={["citizen", "officer"]}>
              <Leaderboard />
            </ProtectedRoute>
          }
        />


      </Routes>

    </BrowserRouter>
  );
}
