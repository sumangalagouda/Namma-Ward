import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  RefreshCw, 
  Filter, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  FileText,
  ChevronDown,
  X
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [selectedIssueType, setSelectedIssueType] = useState("");

  // ---------------- FETCH ----------------
  const fetchComplaints = async (filter = "") => {
    setLoading(true);

    let url = "/complaints/dashboard";
    if (filter) url += `?status=${filter}`;

    try {
      const res = await api.get(url);
      setComplaints(res.data);
    } catch (error) {
      console.error("Failed to fetch complaints", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // ---------------- FILTER ----------------
  const handleFilterChange = (value) => {
    setStatus(value);
    fetchComplaints(value);
  };

  // ---------------- SEARCH & FILTER ----------------
  const filtered = complaints
    .filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    )
    .filter((c) => selectedIssueType ? c.issue_type === selectedIssueType : true)
    .sort((a, b) => {
      if (sortBy === "upvotes") return (b.upvote_count || 0) - (a.upvote_count || 0);
      return 0; // default recent
    });

  // ---------------- STATS ----------------
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "pending").length;
  const inProgress = complaints.filter((c) => c.status === "in_progress").length;
  const resolved = complaints.filter((c) => c.status === "resolved").length;

  // Get unique issue types
  const issueTypes = [...new Set(complaints.map(c => c.issue_type))];

  const statusColor = (s) => {
    switch (s) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "in_progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "verified":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const clearFilters = () => {
    setStatus("");
    setSearch("");
    setSelectedIssueType("");
    setSortBy("recent");
    fetchComplaints("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

      {/* ---------------- HEADER ---------------- */}
      <div className="max-w-7xl mx-auto p-6 md:p-8">

        {/* ---------------- SEARCH + FILTER BAR ---------------- */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 mb-6">
          
          {/* Top Row */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
            
            {/* Search */}
            <div className="relative flex-1 w-full md:max-w-md">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search by title or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 items-center w-full md:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  showFilters 
                    ? "bg-indigo-600 text-white shadow-lg" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Filter size={18} />
                Filters
                <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <button
                onClick={() => fetchComplaints(status)}
                className="bg-white border-2 border-gray-200 p-3 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                title="Refresh"
              >
                <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
              </button>

              {(status || selectedIssueType || search) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-4 animate-in slide-in-from-top">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["", "pending", "in_progress", "resolved", "verified"].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleFilterChange(s)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          status === s
                            ? "bg-indigo-600 text-white shadow-md scale-105"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {s || "All"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Issue Type Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Issue Type
                  </label>
                  <select
                    value={selectedIssueType}
                    onChange={(e) => setSelectedIssueType(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">All Types</option>
                    {issueTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="upvotes">Most Upvoted</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-indigo-600">{filtered.length}</span> of {total} complaints
          </p>
          {(status || selectedIssueType) && (
            <div className="flex gap-2">
              {status && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                  Status: {status}
                </span>
              )}
              {selectedIssueType && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Type: {selectedIssueType}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ---------------- CARDS ---------------- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-500 mt-4 text-lg">Loading complaints...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-md border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-400 text-xl font-medium">No complaints found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
            {(status || search || selectedIssueType) && (
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filtered.map((c, index) => (
              <div
                key={c.id}
                onClick={() => navigate(`/complaint/${c.id}`)}
                className="
                  group bg-white rounded-xl shadow-md border border-gray-200
                  hover:shadow-2xl hover:-translate-y-2 hover:border-indigo-300
                  transition-all duration-300
                  cursor-pointer overflow-hidden
                "
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image Header */}
                {c.image && (
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={`http://localhost:5000/uploads/${c.image}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={c.title}
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusColor(c.status)} backdrop-blur-sm bg-white/90`}>
                        {c.status?.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-5">
                  {/* Title & Status */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2 flex-1">
                      {c.title}
                    </h3>
                    {!c.image && (
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ml-2 ${statusColor(c.status)}`}>
                        {c.status?.replace('_', ' ').toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {c.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pb-3 border-b border-gray-100">
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                      🏷️ {c.issue_type}
                    </span>
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                      📍 {c.area}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      {c.upvote_count !== undefined && (
                        <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">
                          👍 {c.upvote_count}
                        </span>
                      )}
                      {c.comments?.length > 0 && (
                        <span className="flex items-center gap-1">
                          💬 {c.comments.length}
                        </span>
                      )}
                    </div>
                    <span className="text-indigo-600 font-medium text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-300">
            © 2026 Citizen Complaint Portal | Government Initiative for Public Welfare
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Making governance transparent and accessible to all
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ---------------- ENHANCED STAT CARD ---------------- */
function StatCard({ title, value, color, icon, trend, pulse }) {
  const colors = {
    indigo: {
      bg: "from-indigo-500 to-indigo-600",
      text: "text-indigo-600",
      light: "bg-indigo-50"
    },
    amber: {
      bg: "from-amber-500 to-orange-600",
      text: "text-amber-600",
      light: "bg-amber-50"
    },
    blue: {
      bg: "from-blue-500 to-cyan-600",
      text: "text-blue-600",
      light: "bg-blue-50"
    },
    emerald: {
      bg: "from-emerald-500 to-green-600",
      text: "text-emerald-600",
      light: "bg-emerald-50"
    },
  };

  return (
    <div className={`
      bg-white rounded-xl shadow-lg border border-gray-200
      hover:shadow-2xl hover:-translate-y-1 
      transition-all duration-300 
      overflow-hidden
      ${pulse ? 'animate-pulse' : ''}
    `}>
      <div className={`h-2 bg-gradient-to-r ${colors[color].bg}`}></div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-3 rounded-lg ${colors[color].light}`}>
            <div className={colors[color].text}>
              {icon}
            </div>
          </div>
          {trend && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <TrendingUp size={12} />
              {trend}
            </span>
          )}
        </div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className={`text-4xl font-bold ${colors[color].text}`}>
          {value}
        </h3>
      </div>
    </div>
  );
}