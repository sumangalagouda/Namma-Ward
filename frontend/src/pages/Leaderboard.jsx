import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Search,
  Filter,
  TrendingUp,
  Shield,
  Target,
  Star,
  Zap,
  ChevronRight,
  Loader2,
  RefreshCw,
  X,
  BarChart3,
  Users
} from "lucide-react";

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all"); // all, top10, top50
  const [sortBy, setSortBy] = useState("rank"); // rank, points, resolved
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await api.get("/officers/leaderboard");
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredData = data
    .filter((o) => {
      // Search filter
      const matchesSearch = 
        o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.officer_id.toString().includes(searchQuery);
      
      // Rank filter
      let matchesFilter = true;
      if (filterBy === "top10") matchesFilter = o.rank <= 10;
      if (filterBy === "top50") matchesFilter = o.rank <= 50;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "points") return b.total_points - a.total_points;
      if (sortBy === "resolved") return b.resolved - a.resolved;
      return a.rank - b.rank; // default: rank
    });

  // Medal/rank display
  const getRankDisplay = (rank) => {
    if (rank === 1) return { emoji: "🥇", color: "text-yellow-500", label: "1st" };
    if (rank === 2) return { emoji: "🥈", color: "text-gray-400", label: "2nd" };
    if (rank === 3) return { emoji: "🥉", color: "text-amber-600", label: "3rd" };
    return { emoji: null, color: "text-gray-600", label: `${rank}th` };
  };

  // Stats
  const stats = {
    total: data.length,
    avgPoints: data.length > 0 ? Math.round(data.reduce((sum, o) => sum + o.total_points, 0) / data.length) : 0,
    totalResolved: data.reduce((sum, o) => sum + o.resolved, 0),
    topPerformer: data[0] || null,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-2xl shadow-2xl mb-4 animate-bounce-slow">
              <Trophy size={40} className="text-purple-900" />
            </div>
            <h1 className="text-5xl font-bold mb-3 flex items-center justify-center gap-3">
              Officer Leaderboard
              <Crown className="text-yellow-400" size={36} />
            </h1>
            <p className="text-purple-100 text-xl">
              Celebrating our top-performing officers
            </p>
          </div>

          {/* Top 3 Podium */}
          {data.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
              {/* 2nd Place */}
              <div className="relative pt-8">
                <div 
                  onClick={() => navigate(`/officer/${data[1].officer_id}`)}
                  className="bg-white/10 backdrop-blur-md border-2 border-gray-300 rounded-2xl p-4 text-center hover:bg-white/20 transition-all cursor-pointer group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl shadow-lg group-hover:scale-110 transition-transform">
                    🥈
                  </div>
                  <p className="font-bold text-lg mb-1">{data[1].name}</p>
                  <p className="text-sm text-purple-100 mb-2">2nd Place</p>
                  <div className="bg-white/20 rounded-lg px-3 py-1">
                    <p className="text-2xl font-bold">{data[1].total_points}</p>
                    <p className="text-xs text-purple-100">points</p>
                  </div>
                </div>
              </div>

              {/* 1st Place */}
              <div className="relative">
                <div 
                  onClick={() => navigate(`/officer/${data[0].officer_id}`)}
                  className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-center shadow-2xl hover:scale-105 transition-all cursor-pointer border-4 border-yellow-300"
                >
                  <Crown className="mx-auto text-yellow-900 mb-2 animate-pulse" size={32} />
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3 text-4xl shadow-xl border-4 border-yellow-200">
                    🥇
                  </div>
                  <p className="font-bold text-xl mb-1 text-gray-900">{data[0].name}</p>
                  <p className="text-sm text-yellow-900 mb-3">Champion</p>
                  <div className="bg-white/30 rounded-lg px-4 py-2">
                    <p className="text-3xl font-bold text-gray-900">{data[0].total_points}</p>
                    <p className="text-sm text-yellow-900">points</p>
                  </div>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="relative pt-8">
                <div 
                  onClick={() => navigate(`/officer/${data[2].officer_id}`)}
                  className="bg-white/10 backdrop-blur-md border-2 border-amber-600 rounded-2xl p-4 text-center hover:bg-white/20 transition-all cursor-pointer group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl shadow-lg group-hover:scale-110 transition-transform">
                    🥉
                  </div>
                  <p className="font-bold text-lg mb-1">{data[2].name}</p>
                  <p className="text-sm text-purple-100 mb-2">3rd Place</p>
                  <div className="bg-white/20 rounded-lg px-3 py-1">
                    <p className="text-2xl font-bold">{data[2].total_points}</p>
                    <p className="text-xs text-purple-100">points</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Officers"
            value={stats.total}
            icon={<Users />}
            color="purple"
          />
          <StatCard
            title="Avg Points"
            value={stats.avgPoints}
            icon={<BarChart3 />}
            color="blue"
          />
          <StatCard
            title="Total Resolved"
            value={stats.totalResolved}
            icon={<Target />}
            color="emerald"
          />
          <StatCard
            title="Top Score"
            value={stats.topPerformer?.total_points || 0}
            icon={<Star />}
            color="yellow"
          />
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Search */}
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search by name or officer ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              {["all", "top10", "top50"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterBy(filter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    filterBy === filter
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter === "all" ? "All Officers" : filter === "top10" ? "Top 10" : "Top 50"}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 text-sm"
            >
              <option value="rank">Sort by Rank</option>
              <option value="points">Sort by Points</option>
              <option value="resolved">Sort by Resolved</option>
            </select>

            {/* Refresh */}
            <button
              onClick={fetchLeaderboard}
              className="bg-white border-2 border-gray-200 p-3 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
              title="Refresh"
            >
              <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500 text-gray-600" />
            </button>
          </div>

          {/* Results Info */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <p>
              Showing <span className="font-semibold text-purple-600">{filteredData.length}</span> of {data.length} officers
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          
          {filteredData.length === 0 ? (
            <div className="text-center py-20">
              <Trophy className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-400 text-xl font-medium">No officers found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                
                {/* Header */}
                <thead className="bg-gradient-to-r from-purple-50 to-fuchsia-50 border-b-2 border-purple-100">
                  <tr>
                    <th className="p-4 text-left text-sm font-bold text-gray-700">Rank</th>
                    <th className="p-4 text-left text-sm font-bold text-gray-700">Officer</th>
                    <th className="p-4 text-left text-sm font-bold text-gray-700">
                      <div className="flex items-center gap-1">
                        <Zap size={16} />
                        Points
                      </div>
                    </th>
                    <th className="p-4 text-left text-sm font-bold text-gray-700">
                      <div className="flex items-center gap-1">
                        <Target size={16} />
                        Resolved
                      </div>
                    </th>
                    <th className="p-4 text-right text-sm font-bold text-gray-700">Action</th>
                  </tr>
                </thead>

                {/* Body */}
                <tbody>
                  {filteredData.map((o, index) => {
                    const rankDisplay = getRankDisplay(o.rank);
                    const isTopThree = o.rank <= 3;

                    return (
                      <tr
                        key={o.officer_id}
                        onClick={() => navigate(`/officer/${o.officer_id}`)}
                        className={`
                          border-b border-gray-100 cursor-pointer 
                          transition-all duration-200
                          hover:bg-gradient-to-r hover:from-purple-50 hover:to-fuchsia-50
                          ${isTopThree ? 'bg-gradient-to-r from-yellow-50/30 to-orange-50/30' : ''}
                        `}
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        {/* Rank */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {rankDisplay.emoji ? (
                              <span className="text-3xl">{rankDisplay.emoji}</span>
                            ) : (
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="font-bold text-gray-600">{o.rank}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Officer */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                              {o.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-gray-800 flex items-center gap-2">
                                {o.name}
                                {isTopThree && <Star className="text-yellow-500 fill-current" size={16} />}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Shield size={12} />
                                ID: {o.officer_id}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Points */}
                        <td className="p-4">
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 rounded-lg border border-blue-100">
                            <Zap className="text-blue-600" size={16} />
                            <span className="font-bold text-blue-700 text-lg">{o.total_points}</span>
                          </div>
                        </td>

                        {/* Resolved */}
                        <td className="p-4">
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                            <Target className="text-emerald-600" size={16} />
                            <span className="font-bold text-emerald-700">{o.resolved}</span>
                          </div>
                        </td>

                        {/* Action */}
                        <td className="p-4 text-right">
                          <button className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm group">
                            View Profile
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Stat Card Component */
function StatCard({ title, value, icon, color }) {
  const colors = {
    purple: {
      bg: "from-purple-500 to-violet-600",
      text: "text-purple-600",
      light: "bg-purple-50"
    },
    blue: {
      bg: "from-blue-500 to-indigo-600",
      text: "text-blue-600",
      light: "bg-blue-50"
    },
    emerald: {
      bg: "from-emerald-500 to-green-600",
      text: "text-emerald-600",
      light: "bg-emerald-50"
    },
    yellow: {
      bg: "from-yellow-500 to-orange-600",
      text: "text-yellow-600",
      light: "bg-yellow-50"
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${colors[color].bg}`}></div>
      <div className="p-4 text-center">
        <div className={`inline-flex p-2 rounded-lg ${colors[color].light} mb-2`}>
          <div className={colors[color].text}>
            {icon}
          </div>
        </div>
        <p className="text-gray-500 text-xs font-medium mb-1">{title}</p>
        <h3 className={`text-2xl font-bold ${colors[color].text}`}>
          {value}
        </h3>
      </div>
    </div>
  );
}