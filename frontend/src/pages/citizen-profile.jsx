import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  User,
  Mail,
  MapPin,
  Flag,
  Award,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileText,
  BarChart3,
  Star,
  Zap,
  Target,
  Activity,
  Loader2,
  RefreshCw,
  Eye,
  ThumbsUp,
  MessageSquare,
  Shield,
  Sparkles,
  Trophy,
  Crown,
  Gift
} from "lucide-react";

export default function CitizenProfile() {
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedCard, setExpandedCard] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Calculate stats and achievements
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "pending").length,
    inProgress: complaints.filter(c => c.status === "in_progress").length,
    resolved: complaints.filter(c => c.status === "resolved").length,
    verified: complaints.filter(c => c.status === "verified").length,
  };

  const totalUpvotes = complaints.reduce((sum, c) => sum + (c.upvote_count || 0), 0);
  const totalComments = complaints.reduce((sum, c) => sum + (c.comments?.length || 0), 0);
  
  const impactScore = (stats.verified * 10) + (stats.resolved * 5) + (stats.total * 2) + totalUpvotes;
  const citizenLevel = Math.floor(impactScore / 50) + 1;

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

  // Achievements
  const achievements = [
    { 
      id: 1, 
      title: "First Report", 
      desc: "Filed your first complaint", 
      icon: <Sparkles />, 
      unlocked: stats.total >= 1,
      color: "from-blue-500 to-cyan-500"
    },
    { 
      id: 2, 
      title: "Community Guardian", 
      desc: "5 complaints filed", 
      icon: <Shield />, 
      unlocked: stats.total >= 5,
      color: "from-purple-500 to-pink-500"
    },
    { 
      id: 3, 
      title: "Change Maker", 
      desc: "3 verified resolutions", 
      icon: <Trophy />, 
      unlocked: stats.verified >= 3,
      color: "from-yellow-500 to-orange-500"
    },
    { 
      id: 4, 
      title: "Super Citizen", 
      desc: "Reached level 5", 
      icon: <Crown />, 
      unlocked: citizenLevel >= 5,
      color: "from-pink-500 to-rose-500"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 text-white shadow-2xl overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                <span className="text-5xl font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase() || "C"}
                </span>
              </div>
              {/* Level Badge */}
              <div className="absolute -bottom-3 -right-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full px-4 py-2 shadow-xl border-4 border-white">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-white fill-current" />
                  <span className="text-white font-bold text-sm">Level {citizenLevel}</span>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                <h1 className="text-4xl md:text-5xl font-bold">{user?.name || "Citizen"}</h1>
                <Sparkles className="text-yellow-300 animate-pulse" size={28} />
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-purple-100 mb-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <Mail size={18} />
                  <span>{user?.email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <MapPin size={18} />
                  <span>{user?.area || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <Flag size={18} />
                  <span>{user?.state || "N/A"}</span>
                </div>
              </div>

              {/* Impact Score */}
              <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border-2 border-white/30">
                <Zap className="text-yellow-300" size={24} />
                <div className="text-left">
                  <p className="text-xs text-purple-100">Impact Score</p>
                  <p className="text-2xl font-bold">{impactScore}</p>
                </div>
              </div>
            </div>

            {/* Action */}
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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <StatCard
            title="Total"
            value={stats.total}
            icon={<FileText />}
            color="purple"
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<Clock />}
            color="amber"
            pulse={stats.pending > 0}
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={<Activity />}
            color="blue"
          />
          <StatCard
            title="Resolved"
            value={stats.resolved}
            icon={<CheckCircle2 />}
            color="emerald"
          />
          <StatCard
            title="Verified"
            value={stats.verified}
            icon={<Star />}
            color="violet"
          />
          <StatCard
            title="Upvotes"
            value={totalUpvotes}
            icon={<ThumbsUp />}
            color="pink"
          />
          <StatCard
            title="Comments"
            value={totalComments}
            icon={<MessageSquare />}
            color="indigo"
          />
        </div>

        {/* Achievements Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="text-yellow-500" size={28} />
            <h3 className="text-2xl font-bold text-gray-800">Achievements</h3>
            <span className="ml-auto text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              {achievements.filter(a => a.unlocked).length}/{achievements.length} Unlocked
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`relative rounded-xl p-5 border-2 transition-all duration-300 ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br ' + achievement.color + ' text-white shadow-lg hover:scale-105'
                    : 'bg-gray-50 border-gray-200 grayscale opacity-60'
                }`}
              >
                {achievement.unlocked && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="text-white" size={20} />
                  </div>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${achievement.unlocked ? 'bg-white/20' : 'bg-gray-200'}`}>
                    {achievement.icon}
                  </div>
                  <h4 className="font-bold">{achievement.title}</h4>
                </div>
                <p className={`text-sm ${achievement.unlocked ? 'text-white/90' : 'text-gray-500'}`}>
                  {achievement.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Overview */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
            <BarChart3 className="text-purple-600" size={24} />
            Activity Overview
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Progress Ring */}
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
                    stroke="url(#gradientPurple)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${stats.total > 0 ? ((stats.resolved + stats.verified) / stats.total) * 351.86 : 0} 351.86`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradientPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-purple-600">
                    {stats.total > 0 ? Math.round(((stats.resolved + stats.verified) / stats.total) * 100) : 0}%
                  </span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700">Success Rate</p>
            </div>

            {/* Quick Stats */}
            <div className="col-span-2 grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Target className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-700">{citizenLevel}</p>
                    <p className="text-xs text-gray-600">Citizen Level</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-500 rounded-lg">
                    <Award className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-pink-700">{achievements.filter(a => a.unlocked).length}</p>
                    <p className="text-xs text-gray-600">Achievements</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <TrendingUp className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-700">{totalUpvotes}</p>
                    <p className="text-xs text-gray-600">Total Support</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500 rounded-lg">
                    <Zap className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-700">{impactScore}</p>
                    <p className="text-xs text-gray-600">Impact Score</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Complaints Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-50 to-fuchsia-50 border-b border-gray-200 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FileText className="text-purple-600" size={24} />
                My Complaints ({filteredComplaints.length})
              </h3>

              {/* Status Filter */}
              <div className="flex gap-2 flex-wrap">
                {["all", "pending", "in_progress", "resolved", "verified"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                      filterStatus === status
                        ? "bg-purple-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status === "all" ? "All" : status.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Complaints Grid */}
          <div className="p-6">
            {filteredComplaints.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto text-gray-300 mb-4" size={64} />
                <p className="text-gray-400 text-lg font-medium">No complaints found</p>
                <p className="text-gray-400 text-sm">Start making a difference in your community!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredComplaints.map((c, index) => {
                  const isExpanded = expandedCard === c.id;
                  const config = statusConfig[c.status] || statusConfig.pending;

                  return (
                    <div
                      key={c.id}
                      className="bg-gradient-to-br from-white to-purple-50 rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-2xl hover:border-purple-300 transition-all duration-300 group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Image */}
                      {c.image && (
                        <div className="relative h-48 overflow-hidden bg-gray-100">
                          <img
                            src={`http://localhost:5000/uploads/${c.image}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            alt={c.title}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>
                      )}

                      <div className="p-5">
                        {/* Title & Status */}
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-lg text-gray-800 flex-1 line-clamp-1">
                            {c.title}
                          </h4>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ml-2 ${config.color}`}>
                            {config.icon}
                            {config.label}
                          </span>
                        </div>

                        {/* Description */}
                        <p className={`text-sm text-gray-600 mb-4 ${isExpanded ? '' : 'line-clamp-2'}`}>
                          {c.description}
                        </p>

                        {!isExpanded && c.description?.length > 100 && (
                          <button
                            onClick={() => setExpandedCard(c.id)}
                            className="text-purple-600 text-xs font-medium mb-3 hover:underline flex items-center gap-1"
                          >
                            <Eye size={14} />
                            Read more
                          </button>
                        )}

                        {/* Meta Info */}
                        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                          <div className="flex items-center gap-1 bg-purple-50 rounded-lg px-2 py-1.5">
                            <span className="text-gray-500">Issue:</span>
                            <span className="font-semibold text-gray-700 truncate">{c.issue_type}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-purple-50 rounded-lg px-2 py-1.5">
                            <span className="text-gray-500">Area:</span>
                            <span className="font-semibold text-gray-700 truncate">{c.area}</span>
                          </div>
                        </div>

                        {/* Engagement Stats */}
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          {c.upvote_count > 0 && (
                            <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">
                              <ThumbsUp size={12} />
                              {c.upvote_count}
                            </div>
                          )}
                          {c.comments?.length > 0 && (
                            <div className="flex items-center gap-1">
                              <MessageSquare size={12} />
                              {c.comments.length}
                            </div>
                          )}
                        </div>
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
    purple: {
      bg: "from-purple-500 to-violet-600",
      text: "text-purple-600",
      light: "bg-purple-50"
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
    violet: {
      bg: "from-violet-500 to-purple-600",
      text: "text-violet-600",
      light: "bg-violet-50"
    },
    pink: {
      bg: "from-pink-500 to-rose-600",
      text: "text-pink-600",
      light: "bg-pink-50"
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