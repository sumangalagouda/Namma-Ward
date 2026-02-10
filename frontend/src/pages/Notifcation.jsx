import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Notifications() {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchNotifications = async () => {
    try {
      const res = await api.get("/citizen/notifications");
      setNotifications(res.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchNotifications();
  }, []);


  // ✅ verify complaint
  const verifyComplaint = async (id) => {
    try {
      await api.put(`/complaints/citizen/${id}`);

      // remove from list after verifying
      setNotifications(prev => prev.filter(c => c.id !== id));

      alert("Complaint verified successfully");

    } catch (err) {
      console.error(err);
    }
  };


  if (loading) return <p className="p-8">Loading...</p>;


  return (
    <div className="p-8">

      <h2 className="text-2xl font-bold mb-6">
        🔔 Notifications
      </h2>


      {notifications.length === 0 && (
        <p className="text-gray-500">
          No resolved complaints yet 🎉
        </p>
      )}


      <div className="grid gap-4">

        {notifications.map(c => (

          <div
            key={c.id}
            className="border rounded-xl p-4 shadow bg-white flex justify-between items-center"
          >

            <div className="flex gap-4">

              {c.image && (
                <img
                  src={`http://localhost:5000/uploads/${c.image}`}
                  className="w-24 h-24 object-cover rounded"
                  alt=""
                />
              )}

              <div>
                <h3 className="font-semibold">{c.title}</h3>

                <p className="text-sm text-gray-600">
                  {c.description}
                </p>

                <p className="text-sm">
                  Issue: <b>{c.issue_type}</b>
                </p>

                <p className="text-sm">
                  Area: <b>{c.area}</b>
                </p>

                <p className="text-green-600 font-semibold">
                  Resolved ✓
                </p>
              </div>

            </div>


            {/* VERIFY BUTTON */}
            <button
              onClick={() => verifyComplaint(c.id)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Verify
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}
