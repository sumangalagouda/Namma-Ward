import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Shield,
  FileText,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Filter,
  Search,
  Calendar,
  TrendingUp,
  Eye,
  X,
  ChevronDown,
  Tag,
  User,
  BarChart3
} from "lucide-react";

export default function OfficerDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [proofs, setProofs] = useState({});
  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCard, setExpandedCard] = useState(null);
  const [proofPreviews, setProofPreviews] = useState({});
  const [showToast, setShowToast] = useState({ show: false, message: "", type: "" });
  const [sortBy, setSortBy] = useState("recent");

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get("/complaints/officer");
      setComplaints(res.data);
    } catch (error) {
      showNotification("Failed to load complaints", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Toast notification
  const showNotification = (message, type = "success") => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: "", type: "" }), 3000);
  };

  // Handle proof file selection
  const handleProofChange = (id, file) => {
    if (file) {
      // Validate file
      if (file.size > 5 * 1024 * 1024) {
        showNotification("File size must be less than 5MB", "error");
        return;
      }

      setProofs({ ...proofs, [id]: file });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreviews({ ...proofPreviews, [id]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove proof
  const removeProof = (id) => {
    const newProofs = { ...proofs };
    const newPreviews = { ...proofPreviews };
    delete newProofs[id];
    delete newPreviews[id];
    setProofs(newProofs);
    setProofPreviews(newPreviews);
  };

  // Update status
  const updateStatus = async (id) => {
    if (!statusMap[id]) {
      showNotification("Please select a status", "error");
      return;
    }

    if (!proofs[id]) {
      showNotification("Please upload proof image", "error");
      return;
    }

    setUpdating({ ...updating, [id]: true });

    try {
      const formData = new FormData();
      formData.append("status", statusMap[id]);
      formData.append("proof", proofs[id]);

      await api.put(`/complaints/officer/${id}`, formData);

      // Clear state for this complaint
      const newStatusMap = { ...statusMap };
      const newProofs = { ...proofs };
      const newPreviews = { ...proofPreviews };
      delete newStatusMap[id];
      delete newProofs[id];
      delete newPreviews[id];
      setStatusMap(newStatusMap);
      setProofs(newProofs);
      setProofPreviews(newPreviews);

      showNotification("Complaint updated successfully!", "success");
      fetchComplaints();
    } catch (error) {
      showNotification(error.response?.data?.error || "Failed to update", "error");
    }

    setUpdating({ ...updating, [id]: false });
  };

  // Filter and sort
  const filteredComplaints = complaints
    .filter((c) => {
      if (filterStatus !== "all" && c.status !== filterStatus) return false;
      if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !c.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "priority") {
        const priorityOrder = { pending: 0, in_progress: 1, resolved: 2, verified: 3 };
        return priorityOrder[a.status] - priorityOrder[b.status];
      }
      return 0;
    });

  // Stats
  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in_progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
  };

  const statusConfig = {
    pending: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      badge: "bg-amber-500",
      icon: <Clock size={16} />,
      label: "Pending"
    },
    in_progress: {
      color: "bg-blue-50 text-blue-700 border-blue-200",
      badge: "bg-blue-500",
      icon: <RefreshCw size={16} />,
      label: "In Progress"
    },
    resolved: {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      badge: "bg-emerald-500",
      icon: <CheckCircle2 size={16} />,
      label: "Resolved"
    },
    verified: {
      color: "bg-purple-50 text-purple-700 border-purple-200",
      badge: "bg-purple-500",
      icon: <CheckCircle2 size={16} />,
      label: "Verified"
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50">
      
      {/* Toast Notification */}
      {showToast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl border-2 animate-in slide-in-from-top ${
          showToast.type === "success"
            ? "bg-emerald-50 border-emerald-500 text-emerald-800"
            : "bg-red-50 border-red-500 text-red-800"
        }`}>
          <div className="flex items-center gap-3">
            {showToast.type === "success" ? (
              <CheckCircle2 className="text-emerald-600" size={20} />
            ) : (
              <AlertCircle className="text-red-600" size={20} />
            )}
            <p className="font-medium">{showToast.message}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Shield size={36} />
                Officer Dashboard
              </h1>
              <p className="text-cyan-100 text-lg">
                Manage and resolve assigned complaints
              </p>
            </div>
            <button
              onClick={fetchComplaints}
              disabled={loading}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all flex items-center gap-2 group disabled:opacity-50"
            >
              <RefreshCw size={18} className={`group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Search */}
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search complaints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
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
                      ? "bg-teal-600 text-white shadow-md"
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
              className="px-4 py-2 border-2 border-gray-200 rounded-lg outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              <option value="recent">Most Recent</option>
              <option value="priority">By Priority</option>
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-teal-600">{filteredComplaints.length}</span> of {complaints.length} complaints
          </p>
        </div>

        {/* Complaints Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 text-lg">Loading complaints...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-md border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-400 text-xl font-medium">No complaints found</p>
            <p className="text-gray-400 text-sm mt-2">
              {complaints.length === 0 ? "No complaints assigned yet" : "Try adjusting your filters"}
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            
            {filteredComplaints.map((c, index) => {
              const isExpanded = expandedCard === c.id;
              const config = statusConfig[c.status] || statusConfig.pending;
              const selectedStatus = statusMap[c.id];
              const hasProof = proofs[c.id];

              return (
                <div
                  key={c.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Header with Image */}
                  {c.image && (
                    <div className="relative h-48 overflow-hidden bg-gray-100 group">
                      <img
                        src={`http://localhost:5000/uploads/${c.image}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={c.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm bg-white/90 ${config.color}`}>
                          {config.icon}
                          {config.label}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    
                    {/* Title & Status */}
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-xl text-gray-800 flex-1">
                        {c.title}
                      </h3>
                      {!c.image && (
                        <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ml-2 ${config.color}`}>
                          {config.icon}
                          {config.label}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className={`text-gray-600 mb-4 ${isExpanded ? '' : 'line-clamp-2'}`}>
                      {c.description}
                    </p>

                    {!isExpanded && c.description.length > 100 && (
                      <button
                        onClick={() => setExpandedCard(c.id)}
                        className="text-teal-600 text-sm font-medium mb-4 hover:underline"
                      >
                        Read more
                      </button>
                    )}

                    {isExpanded && (
                      <button
                        onClick={() => setExpandedCard(null)}
                        className="text-teal-600 text-sm font-medium mb-4 hover:underline"
                      >
                        Show less
                      </button>
                    )}

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-2 text-sm">
                        <Tag className="text-gray-400" size={16} />
                        <span className="text-gray-600 font-medium">{c.issue_type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="text-gray-400" size={16} />
                        <span className="text-gray-600 font-medium">{c.area}</span>
                      </div>
                      {c.upvote_count !== undefined && (
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="text-gray-400" size={16} />
                          <span className="text-gray-600 font-medium">{c.upvote_count} upvotes</span>
                        </div>
                      )}
                      {c.created_by && (
                        <div className="flex items-center gap-2 text-sm">
                          <User className="text-gray-400" size={16} />
                          <span className="text-gray-600 font-medium">{c.created_by}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Panel (only if not verified) */}
                    {c.status !== "verified" ? (
                      <div className="space-y-4 bg-gradient-to-br from-gray-50 to-teal-50 p-4 rounded-lg border border-teal-100">
                        <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <BarChart3 size={16} className="text-teal-600" />
                          Update Complaint Status
                        </p>

                        {/* Status Selection */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-2">
                            Select Status
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => setStatusMap({ ...statusMap, [c.id]: "in_progress" })}
                              className={`px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium ${
                                selectedStatus === "in_progress"
                                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                                  : "border-gray-200 hover:border-blue-300"
                              }`}
                            >
                              <RefreshCw size={16} className="mx-auto mb-1" />
                              In Progress
                            </button>
                            <button
                              onClick={() => setStatusMap({ ...statusMap, [c.id]: "resolved" })}
                              className={`px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium ${
                                selectedStatus === "resolved"
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md"
                                  : "border-gray-200 hover:border-emerald-300"
                              }`}
                            >
                              <CheckCircle2 size={16} className="mx-auto mb-1" />
                              Resolved
                            </button>
                          </div>
                        </div>

                        {/* Proof Upload */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-2">
                            Upload Proof <span className="text-red-500">*</span>
                          </label>
                          
                          {!proofPreviews[c.id] ? (
                            <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleProofChange(c.id, e.target.files[0])}
                              />
                              <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                              <p className="text-sm text-gray-600 font-medium">Click to upload proof</p>
                              <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                            </label>
                          ) : (
                            <div className="relative rounded-lg overflow-hidden border-2 border-teal-500 group">
                              <img
                                src={proofPreviews[c.id]}
                                alt="Proof preview"
                                className="w-full h-32 object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                                <button
                                  onClick={() => removeProof(c.id)}
                                  className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full transition-all hover:scale-110"
                                >
                                  <X size={20} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Update Button */}
                        <button
                          onClick={() => updateStatus(c.id)}
                          disabled={!selectedStatus || !hasProof || updating[c.id]}
                          className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-3 rounded-lg font-bold hover:from-teal-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {updating[c.id] ? (
                            <>
                              <Loader2 className="animate-spin" size={20} />
                              Updating...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={20} />
                              Update Complaint
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center gap-3">
                        <CheckCircle2 className="text-purple-600" size={24} />
                        <div>
                          <p className="font-semibold text-purple-800">Verified by Citizen</p>
                          <p className="text-sm text-purple-600">This complaint has been verified and closed</p>
                        </div>
                      </div>
                    )}
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

/* Stat Card Component */
function StatCard({ title, value, icon, color, pulse }) {
  const colors = {
    cyan: {
      bg: "from-cyan-500 to-teal-600",
      text: "text-cyan-600",
      light: "bg-cyan-50"
    },
    amber: {
      bg: "from-amber-500 to-orange-600",
      text: "text-amber-600",
      light: "bg-amber-50"
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
        <h3 className={`text-3xl font-bold ${colors[color].text}`}>
          {value}
        </h3>
      </div>
    </div>
  );
}