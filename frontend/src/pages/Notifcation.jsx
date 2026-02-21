import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Bell,
  CheckCircle2,
  Loader2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  MapPin,
  Tag,
  Calendar,
  Eye,
  Filter,
  Search,
  X,
  PartyPopper,
  Award,
  TrendingUp
} from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [expandedCard, setExpandedCard] = useState(null);
  const [showToast, setShowToast] = useState({ show: false, message: "", type: "" });

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/citizen/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
      showNotification("Failed to load notifications", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Toast notification
  const showNotification = (message, type = "success") => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: "", type: "" }), 3000);
  };

  // Verify complaint
  const verifyComplaint = async (id, title) => {
    setVerifying({ ...verifying, [id]: true });

    try {
      await api.put(`/complaints/citizen/${id}`);

      // Remove from list with animation
      setTimeout(() => {
        setNotifications(prev => prev.filter(c => c.id !== id));
      }, 500);

      showNotification(`"${title}" verified successfully! 🎉`, "success");
    } catch (err) {
      console.error(err);
      showNotification("Failed to verify complaint", "error");
    } finally {
      setVerifying({ ...verifying, [id]: false });
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.area.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterType === "all" || n.issue_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  // Get unique issue types
  const issueTypes = [...new Set(notifications.map(n => n.issue_type))];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      
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
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <Bell size={40} className="text-white" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce">
                      {notifications.length}
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold">
                  Notifications
                </h1>
              </div>
              <p className="text-indigo-100 text-lg">
                {notifications.length > 0 
                  ? `You have ${notifications.length} resolved complaint${notifications.length > 1 ? 's' : ''} to verify`
                  : "All caught up! No pending verifications"
                }
              </p>
            </div>

            <button
              onClick={fetchNotifications}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all flex items-center gap-2 group"
            >
              <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-8">

        {/* Stats Cards */}
        {notifications.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <CheckCircle2 className="text-indigo-600" size={28} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Pending Verification</p>
                  <p className="text-3xl font-bold text-indigo-600">{notifications.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <TrendingUp className="text-emerald-600" size={28} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Resolution Rate</p>
                  <p className="text-3xl font-bold text-emerald-600">100%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Award className="text-purple-600" size={28} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Impact Points</p>
                  <p className="text-3xl font-bold text-purple-600">+{notifications.length * 10}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        {notifications.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              
              {/* Search */}
              <div className="relative flex-1">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="Search notifications..."
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

              {/* Filter Buttons */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    filterType === "all"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All ({notifications.length})
                </button>
                {issueTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                      filterType === type
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {type} ({notifications.filter(n => n.issue_type === type).length})
                  </button>
                ))}
              </div>
            </div>

            {/* Results Info */}
            <div className="mt-4 text-sm text-gray-600">
              Showing <span className="font-semibold text-indigo-600">{filteredNotifications.length}</span> of {notifications.length} notifications
            </div>
          </div>
        )}

        {/* Notifications Grid */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300 p-12 text-center">
            {notifications.length === 0 ? (
              <>
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PartyPopper className="text-white" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">All Caught Up!</h3>
                <p className="text-gray-600 mb-4">
                  No resolved complaints to verify right now
                </p>
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg font-medium">
                  <Sparkles size={18} />
                  You're doing great!
                </div>
              </>
            ) : (
              <>
                <Bell className="mx-auto text-gray-300 mb-4" size={64} />
                <p className="text-gray-400 text-xl font-medium">No notifications match your filters</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterType("all");
                  }}
                  className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                >
                  Clear Filters
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredNotifications.map((c, index) => {
              const isExpanded = expandedCard === c.id;
              const isVerifying = verifying[c.id];

              return (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
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
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full shadow-lg">
                          <CheckCircle2 size={14} />
                          Resolved
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Title */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                        <CheckCircle2 className="text-white" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-800 mb-1">
                          {c.title}
                        </h3>
                        {!c.image && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
                            <CheckCircle2 size={12} />
                            Resolved
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className={`text-gray-600 mb-4 ${isExpanded ? '' : 'line-clamp-2'}`}>
                      {c.description}
                    </p>

                    {!isExpanded && c.description?.length > 100 && (
                      <button
                        onClick={() => setExpandedCard(c.id)}
                        className="text-indigo-600 text-sm font-medium mb-4 hover:underline flex items-center gap-1"
                      >
                        <Eye size={14} />
                        Read more
                      </button>
                    )}

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 gap-2 mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg px-3 py-2">
                        <Tag className="text-gray-400" size={16} />
                        <span className="text-gray-700 font-medium">{c.issue_type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg px-3 py-2">
                        <MapPin className="text-gray-400" size={16} />
                        <span className="text-gray-700 font-medium">{c.area}</span>
                      </div>
                    </div>

                    {/* Success Message */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 text-green-700">
                        <Sparkles size={20} className="flex-shrink-0" />
                        <p className="text-sm font-medium">
                          Great news! This complaint has been resolved by our team
                        </p>
                      </div>
                    </div>

                    {/* Verify Button */}
                    <button
                      onClick={() => verifyComplaint(c.id, c.title)}
                      disabled={isVerifying}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={20} />
                          Verify Resolution
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-500 text-center mt-2">
                      By verifying, you confirm the issue has been resolved
                    </p>
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