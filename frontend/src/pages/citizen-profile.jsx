import { useEffect, useState } from "react";
import api from "../api/axios";

export default function CitizenProfile() {

  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/citizen-profile");

      setUser(res.data.user);
      setComplaints(res.data.complaints);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProfile();
  }, []);


  if (loading) return <p className="p-8">Loading...</p>;


  return (
    <div className="p-8 space-y-8">

      {/* ================= */}
      {/* USER INFO CARD */}
      {/* ================= */}
      <div className="bg-white shadow rounded-xl p-6 max-w-xl">

        <h2 className="text-2xl font-bold mb-4">
          My Profile
        </h2>

        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Area:</b> {user.area}</p>
        <p><b>State:</b> {user.state}</p>

      </div>


      {/* ================= */}
      {/* COMPLAINTS */}
      {/* ================= */}
      <div>

        <h2 className="text-xl font-bold mb-4">
          My Complaints ({complaints.length})
        </h2>

        <div className="grid gap-4">

          {complaints.map(c => (

            <div
              key={c.id}
              className="border rounded-lg p-4 shadow bg-white"
            >

              <h3 className="font-semibold text-lg">{c.title}</h3>

              <p className="text-sm text-gray-600">
                {c.description}
              </p>

              <p className="text-sm">
                Issue: <b>{c.issue_type}</b>
              </p>

              <p className="text-sm">
                Area: <b>{c.area}</b>
              </p>

              <p className="text-sm">
                Status: <b>{c.status}</b>
              </p>

              {c.image && (
                <img
                  src={`http://localhost:5000/uploads/${c.image}`}
                  className="w-32 mt-2 rounded"
                  alt=""
                />
              )}

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}
