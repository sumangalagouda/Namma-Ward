import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Leaderboard() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchLeaderboard = async () => {
    try {
      const res = await api.get("/officers/leaderboard"); // 🔥 your route
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchLeaderboard();
  }, []);


  const medal = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };


  if (loading) return <p className="p-6">Loading leaderboard...</p>;


  return (
    <div className="p-8">

      <h2 className="text-3xl font-bold text-center mb-6">
        Officer Leaderboard
      </h2>


      <div className="max-w-3xl mx-auto bg-white shadow rounded">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Rank</th>
              <th className="p-3 text-left">Officer</th>
              <th className="p-3 text-left">Points</th>
              <th className="p-3 text-left">Resolved</th>
            </tr>
          </thead>

          <tbody>

            {data.map((o) => (

              <tr key={o.officer_id} className="border-b">

                <td className="p-3 text-lg">
                  {medal(o.rank)}
                </td>

                <td className="p-3">
                  <div className="font-semibold">{o.name}</div>
                  <div className="text-xs text-gray-500">
                    ID: {o.officer_id}
                  </div>
                </td>

                <td className="p-3 font-bold text-blue-600">
                  {o.total_points}
                </td>

                <td className="p-3">
                  {o.resolved}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}
