import { useEffect, useState } from "react";
import api from "../api/axios";
import { 
  CheckCircle, 
  Filter,
  Search,
  Clock,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  Calendar,
  MapPin,
  Eye,
  Loader2,
  X,
  RefreshCw
} from "lucide-react";

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [expandedCard, setExpandedCard] = useState(null);
  const [processingActions, setProcessingActions] = useState({});
  const [showToast, setShowToast] = useState({ show: false, message: "", type: "" });

  // ---------------- FETCH ----------------
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get("/complaints/my");
      setComplaints(res.data);
    } catch (error) {
      showNotification("Failed to load complaints", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // ---------------- TOAST NOTIFICATION ----------------
  const showNotification = (message, type = "success") => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: "", type: "" }), 3000);
  };

  // ---------------- VERIFY ----------------
  const verify = async (id) => {
    setProcessingActions({ ...processingActions, [`verify-${id}`]: true });
    
    try {
      await api.put(`/complaints/citizen/${id}`);

      // Instant UI update with animation
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "verified" } : c
        )
      );
      
      showNotification("Complaint verified successfully!", "success");
    } catch (error) {
      showNotification("Failed to verify complaint", "error");
    }
    
    setProcessingActions({ ...processingActions, [`verify-${id}`]: false });
  };

  // Upvote and comment removed — users cannot upvote or comment on their own complaints here

  // ---------------- FILTERING & SORTING ----------------
  const filteredComplaints = complaints
    .filter((c) => {
      if (filterStatus !== "all" && c.status !== filterStatus) return false;
      if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !c.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "upvotes") return (b.upvote_count || 0) - (a.upvote_count || 0);
      if (sortBy === "status") return a.status.localeCompare(b.status);
      return 0; // recent by default
    });

  // ---------------- STATS ----------------
  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in_progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    verified: complaints.filter((c) => c.status === "verified").length,
  };

  const statusConfig = {
    pending: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <Clock size={14} />,
      label: "Pending"
    },
    in_progress: {
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: <RefreshCw size={14} />,
      label: "In Progress"
    },
    resolved: {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <CheckCircle2 size={14} />,
      label: "Resolved"
    },
    verified: {
      color: "bg-purple-50 text-purple-700 border-purple-200",
      icon: <CheckCircle size={14} />,
      label: "Verified"
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

      {/* -------- TOAST NOTIFICATION -------- */}
      {showToast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-2xl border-2 animate-in slide-in-from-top ${
          showToast.type === "success" 
            ? "bg-green-50 border-green-500 text-green-800" 
            : "bg-red-50 border-red-500 text-red-800"
        }`}>
          <div className="flex items-center gap-3">
            {showToast.type === "success" ? (
              <CheckCircle2 className="text-green-600" size={20} />
            ) : (
              <AlertCircle className="text-red-600" size={20} />
            )}
            <p className="font-medium">{showToast.message}</p>
          </div>
        </div>
      )}

      {/* -------- HEADER -------- */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <MessageSquare size={36} />
                My Complaints
              </h1>
              <p className="text-blue-100 text-lg">
                Track and manage your submitted complaints
              </p>
            </div>
            <button
              onClick={fetchComplaints}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all flex items-center gap-2 group"
            >
              <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-8">



        {/* -------- FILTERS -------- */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Search */}
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search your complaints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
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

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {["all", "pending", "in_progress", "resolved", "verified"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterStatus === status
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status === "all" ? "All" : status.replace("_", " ")}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="recent">Most Recent</option>
              <option value="upvotes">Most Upvoted</option>
              <option value="status">By Status</option>
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-indigo-600">{filteredComplaints.length}</span> of {complaints.length} complaints
          </p>
        </div>

        {/* -------- CARDS -------- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 text-lg">Loading your complaints...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-md border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-400 text-xl font-medium">
              {complaints.length === 0 ? "No complaints yet" : "No matching complaints"}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {complaints.length === 0 ? "Submit your first complaint to get started" : "Try adjusting your filters"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredComplaints.map((c, index) => {
              const isExpanded = expandedCard === c.id;
              const config = statusConfig[c.status] || statusConfig.pending;

              return (
                <div
                  key={c.id}
                  className={`
                    bg-white rounded-xl shadow-md border border-gray-200
                    hover:shadow-2xl hover:-translate-y-1
                    transition-all duration-300
                    flex flex-col overflow-hidden
                    ${isExpanded ? 'ring-2 ring-indigo-500' : ''}
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* IMAGE */}
                      {c.image && (
                    <div className="relative h-40 overflow-hidden bg-gray-100 group">
                      <img
                        src={`http://localhost:5000/uploads/${c.image}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={c.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm bg-white/90 flex items-center gap-1 ${config.color}`}>
                          {config.icon}
                          {config.label}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-5 flex flex-col flex-1">
                    {/* TITLE + STATUS */}
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-gray-800 flex-1 line-clamp-2">
                        {c.title}
                      </h3>
                      {!c.image && (
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ml-2 flex items-center gap-1 ${config.color}`}>
                          {config.icon}
                          {config.label}
                        </span>
                      )}
                    </div>

                    {/* DESCRIPTION */}
                    <p className={`text-sm text-gray-600 mb-4 ${isExpanded ? '' : 'line-clamp-2'}`}>
                      {c.description}
                    </p>

                    {isExpanded && (
                      <button
                        onClick={() => setExpandedCard(null)}
                        className="text-indigo-600 text-xs font-medium mb-3 hover:underline self-start"
                      >
                        Show less
                      </button>
                    )}

                    {!isExpanded && c.description.length > 100 && (
                      <button
                        onClick={() => setExpandedCard(c.id)}
                        className="text-indigo-600 text-xs font-medium mb-3 hover:underline self-start"
                      >
                        Read more
                      </button>
                    )}

                    {/* META */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                      <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                        🏷️ {c.issue_type}
                      </span>
                      <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                        📍 {c.area}
                      </span>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-2 mb-4">
                      {c.status === "resolved" && (
                        <button
                          onClick={() => verify(c.id)}
                          disabled={processingActions[`verify-${c.id}`]}
                          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex-1"
                        >
                          {processingActions[`verify-${c.id}`] ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <CheckCircle size={16} />
                          )}
                          <span className="font-medium">Verify Resolution</span>
                        </button>
                      )}

                      {/* upvote removed on My Complaints (users cannot upvote their own complaints) */}
                    </div>

                    {/* comments removed on My Complaints */}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------- STAT CARD -------- */
function StatCard({ title, value, icon, color, pulse }) {
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
    purple: {
      bg: "from-purple-500 to-violet-600",
      text: "text-purple-600",
      light: "bg-purple-50"
    },
  };

  return (
    <div className={`
      bg-white rounded-xl shadow-lg border border-gray-200
      hover:shadow-xl hover:-translate-y-1 
      transition-all duration-300 
      overflow-hidden
      ${pulse ? 'animate-pulse' : ''}
    `}>
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