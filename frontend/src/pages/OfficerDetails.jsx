import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  Shield,
  Mail,
  MapPin,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  Activity,
  Award,
  ArrowLeft,
  Loader2,
  AlertCircle,
  BarChart3,
  Target,
  Star,
  Calendar,
  Eye,
  RefreshCw
} from "lucide-react";

export default function OfficerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [officer, setOfficer] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/citizens/off-profile/${id}`);
      setOfficer(res.data.officer);
      setComplaints(res.data.complaints);
      setError("");
    } catch (err) {
      setError("Officer not found or unable to load details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOADING STATE ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading officer details...</p>
        </div>
      </div>
    );
  }

  /* ---------------- ERROR STATE ---------------- */
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-red-200 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Officer Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Calculate stats
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "pending").length,
    inProgress: complaints.filter(c => c.status === "in_progress").length,
    resolved: complaints.filter(c => c.status === "resolved").length,
    verified: complaints.filter(c => c.status === "verified").length,
  };

  const completionRate = stats.total > 0 
    ? Math.round(((stats.resolved + stats.verified) / stats.total) * 100) 
    : 0;

  const filteredComplaints = complaints.filter(c => 
    filterStatus === "all" || c.status === filterStatus
  );

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
      icon: <CheckCircle2 size={14} />,
      label: "Verified"
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/90 hover:text-white bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/20 transition-all mb-4 border border-white/20"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
                <span className="text-4xl font-bold text-white">
                  {officer?.name?.charAt(0).toUpperCase() || "O"}
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                <Shield className="text-teal-600" size={20} />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">{officer?.name || "Officer"}</h1>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30">
                  Officer
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-cyan-100">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <Mail size={18} />
                  <span>{officer?.email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <MapPin size={18} />
                  <span>{officer?.area || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchProfile}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all flex items-center gap-2 group"
            >
              <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-8">

        {/* Performance Overview */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 className="text-teal-600" size={24} />
              Performance Overview
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Completion Rate Circle */}
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-3">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${completionRate * 3.51} 351.86`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#14b8a6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-teal-600">{completionRate}%</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700">Completion Rate</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="col-span-2 grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-500 rounded-lg">
                    <Activity className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-teal-700">{stats.inProgress}</p>
                    <p className="text-xs text-gray-600">Active Cases</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500 rounded-lg">
                    <Award className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-700">{stats.verified}</p>
                    <p className="text-xs text-gray-600">Verified</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500 rounded-lg">
                    <Clock className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
                    <p className="text-xs text-gray-600">Pending</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <TrendingUp className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-700">{stats.total}</p>
                    <p className="text-xs text-gray-600">Total Assigned</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Complaints Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-50 to-cyan-50 border-b border-gray-200 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FileText className="text-teal-600" size={24} />
                Assigned Complaints ({filteredComplaints.length})
              </h3>

              {/* Status Filter */}
              <div className="flex gap-2 flex-wrap">
                {["all", "pending", "in_progress", "resolved", "verified"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                      filterStatus === status
                        ? "bg-teal-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status === "all" ? "All" : status.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Complaints List */}
          <div className="p-6">
            {filteredComplaints.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto text-gray-300 mb-4" size={64} />
                <p className="text-gray-400 text-lg font-medium">No complaints found</p>
                <p className="text-gray-400 text-sm">
                  {complaints.length === 0 ? "No complaints assigned yet" : "No complaints match the selected filter"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredComplaints.map((c, index) => {
                  const isExpanded = expandedCard === c.id;
                  const config = statusConfig[c.status] || statusConfig.pending;

                  return (
                    <div
                      key={c.id}
                      className="bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 p-5 hover:shadow-lg hover:border-teal-300 transition-all duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="text-teal-600" size={20} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-lg text-gray-800 mb-1">
                                {c.title}
                              </h4>
                              {c.description && (
                                <p className={`text-sm text-gray-600 ${isExpanded ? '' : 'line-clamp-2'}`}>
                                  {c.description}
                                </p>
                              )}
                              {!isExpanded && c.description?.length > 100 && (
                                <button
                                  onClick={() => setExpandedCard(c.id)}
                                  className="text-teal-600 text-xs font-medium mt-1 hover:underline flex items-center gap-1"
                                >
                                  <Eye size={12} />
                                  Read more
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Meta Info */}
                          {(c.issue_type || c.area) && (
                            <div className="flex gap-2 ml-13">
                              {c.issue_type && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {c.issue_type}
                                </span>
                              )}
                              {c.area && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  📍 {c.area}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Status Badge */}
                        <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full border whitespace-nowrap ${config.color}`}>
                          {config.icon}
                          {config.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
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
    purple: {
      bg: "from-purple-500 to-violet-600",
      text: "text-purple-600",
      light: "bg-purple-50"
    },
    indigo: {
      bg: "from-indigo-500 to-blue-600",
      text: "text-indigo-600",
      light: "bg-indigo-50"
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