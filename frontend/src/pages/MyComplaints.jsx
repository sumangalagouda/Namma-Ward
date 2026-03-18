import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  CheckCircle,
  Search,
  Clock,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  MapPin,
  Tag,
  Loader2,
  X,
  RefreshCw,
  FileText,
  ArrowRight,
  ThumbsUp,
} from "lucide-react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:     { label: "Pending",     bg: "bg-amber-50",   text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500"   },
  in_progress: { label: "In Progress", bg: "bg-blue-50",    text: "text-blue-700",   border: "border-blue-200",   dot: "bg-blue-500"    },
  resolved:    { label: "Resolved",    bg: "bg-emerald-50", text: "text-emerald-700",border: "border-emerald-200",dot: "bg-emerald-500" },
  verified:    { label: "Verified",    bg: "bg-violet-50",  text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500"  },
};
const statusCfg = (s) =>
  STATUS_CONFIG[s] ?? { label: s, bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", dot: "bg-gray-400" };

// ─── StatusBadge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = statusCfg(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ show, message, type }) {
  if (!show) return null;
  const ok = type === "success";
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium ${
      ok ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"
    }`}>
      {ok ? <CheckCircle2 size={18} className="text-emerald-600" /> : <AlertCircle size={18} className="text-red-600" />}
      {message}
    </div>
  );
}

// ─── FilterPill ───────────────────────────────────────────────────────────────
function FilterPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
        active
          ? "bg-[#0f2a4a] text-white shadow"
          : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
const STAT_GRADIENTS = {
  navy:    "from-[#0f2a4a] to-[#1a3a6e]",
  amber:   "from-amber-500 to-orange-500",
  blue:    "from-[#2563eb] to-[#1d4ed8]",
  emerald: "from-emerald-500 to-teal-500",
  violet:  "from-violet-500 to-purple-600",
};
function StatCard({ label, value, variant = "navy" }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${STAT_GRADIENTS[variant]} p-4 shadow-lg`}>
      <div className="absolute -right-3 -top-3 w-20 h-20 rounded-full bg-white/5" />
      <p className="text-white/70 text-xs font-medium mb-1">{label}</p>
      <p className="text-white text-3xl font-bold">{value}</p>
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function LoadingGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
          <div className="h-40 bg-slate-200" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-full" />
            <div className="h-3 bg-slate-100 rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ isEmpty, onClear }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 py-20 flex flex-col items-center text-center px-6">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <FileText size={28} className="text-slate-400" />
      </div>
      <p className="text-slate-700 font-semibold text-lg mb-1">
        {isEmpty ? "No complaints yet" : "No matching complaints"}
      </p>
      <p className="text-slate-400 text-sm">
        {isEmpty ? "Submit your first complaint to get started" : "Try adjusting your search or filters"}
      </p>
      {!isEmpty && (
        <button
          onClick={onClear}
          className="mt-5 px-5 py-2 bg-[#0f2a4a] text-white text-sm font-medium rounded-lg hover:bg-[#1a3a6e] transition-all"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [expandedCard, setExpandedCard] = useState(null);
  const [processingActions, setProcessingActions] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get("/complaints/my");
      setComplaints(res.data);
    } catch {
      notify("Failed to load complaints", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const notify = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const verify = async (id) => {
    setProcessingActions((p) => ({ ...p, [`verify-${id}`]: true }));
    try {
      await api.put(`/complaints/citizen/${id}`);
      setComplaints((prev) => prev.map((c) => c.id === id ? { ...c, status: "verified" } : c));
      notify("Complaint verified successfully!", "success");
    } catch {
      notify("Failed to verify complaint", "error");
    } finally {
      setProcessingActions((p) => ({ ...p, [`verify-${id}`]: false }));
    }
  };

  const stats = {
    total:      complaints.length,
    pending:    complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in_progress").length,
    resolved:   complaints.filter((c) => c.status === "resolved").length,
    verified:   complaints.filter((c) => c.status === "verified").length,
  };

  const filtered = complaints
    .filter((c) => {
      if (filterStatus !== "all" && c.status !== filterStatus) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!c.title?.toLowerCase().includes(q) && !c.description?.toLowerCase().includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "upvotes") return (b.upvote_count || 0) - (a.upvote_count || 0);
      if (sortBy === "status") return (a.status || "").localeCompare(b.status || "");
      return 0;
    });

  const hasFilters = filterStatus !== "all" || !!searchQuery;
  const clearFilters = () => { setFilterStatus("all"); setSearchQuery(""); };

  return (
    <div className="min-h-screen bg-slate-100">
      <Toast {...toast} />

      {/* Page header */}
      <div className="bg-gradient-to-br from-[#0f2a4a] to-[#1a3a6e] pt-8 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                <MessageSquare size={22} /> My Complaints
              </h1>
              <p className="text-white/60 text-sm">Track and manage your submitted complaints</p>
            </div>
            <button
              onClick={fetchComplaints}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium rounded-xl transition-all group"
            >
              <RefreshCw size={15} className="group-hover:rotate-180 transition-transform duration-500" />
              Refresh
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard label="Total"       value={stats.total}      variant="navy"    />
            <StatCard label="Pending"     value={stats.pending}    variant="amber"   />
            <StatCard label="In Progress" value={stats.inProgress} variant="blue"    />
            <StatCard label="Resolved"    value={stats.resolved}   variant="emerald" />
            <StatCard label="Verified"    value={stats.verified}   variant="violet"  />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-16">

        {/* Filter card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                placeholder="Search your complaints…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 transition-all bg-slate-50 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              )}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#2563eb] bg-white text-slate-700"
            >
              <option value="recent">Most Recent</option>
              <option value="upvotes">Most Upvoted</option>
              <option value="status">By Status</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
            {["all", "pending", "in_progress", "resolved", "verified"].map((s) => (
              <FilterPill key={s} active={filterStatus === s} onClick={() => setFilterStatus(s)}>
                {s === "all" ? "All" : statusCfg(s).label}
              </FilterPill>
            ))}
          </div>
        </div>

        {/* Count row */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-[#1d4ed8]">{filtered.length}</span> of {complaints.length} complaints
          </p>
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-slate-500 hover:text-red-500 transition-colors flex items-center gap-1">
              <X size={12} /> Clear filters
            </button>
          )}
        </div>

        {/* Cards */}
        {loading ? (
          <LoadingGrid />
        ) : filtered.length === 0 ? (
          <EmptyState isEmpty={complaints.length === 0} onClear={clearFilters} />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((c, index) => {
              const isExpanded = expandedCard === c.id;
              return (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 flex flex-col overflow-hidden"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  {c.image && (
                    <div className="relative h-40 overflow-hidden bg-slate-100 flex-shrink-0">
                      <img
                        src={`http://localhost:5000/uploads/${c.image}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        alt={c.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <div className="absolute top-3 right-3"><StatusBadge status={c.status} /></div>
                    </div>
                  )}

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start gap-2 mb-2">
                      <h3 className="font-semibold text-[#0f172a] text-base leading-snug line-clamp-2 flex-1">{c.title}</h3>
                      {!c.image && <StatusBadge status={c.status} />}
                    </div>

                    <p className={`text-sm text-slate-500 leading-relaxed mb-1 ${isExpanded ? "" : "line-clamp-2"}`}>
                      {c.description}
                    </p>
                    {c.description?.length > 100 && (
                      <button
                        onClick={() => setExpandedCard(isExpanded ? null : c.id)}
                        className="text-[#1d4ed8] text-xs font-medium mb-3 hover:underline self-start"
                      >
                        {isExpanded ? "Show less" : "Read more"}
                      </button>
                    )}

                    <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-slate-100 mb-4">
                      {c.issue_type && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                          <Tag size={11} />{c.issue_type}
                        </span>
                      )}
                      {c.area && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                          <MapPin size={11} />{c.area}
                        </span>
                      )}
                      {c.upvote_count !== undefined && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full ml-auto">
                          <ThumbsUp size={11} />{c.upvote_count}
                        </span>
                      )}
                    </div>

                    {c.status === "resolved" && (
                      <button
                        onClick={() => verify(c.id)}
                        disabled={processingActions[`verify-${c.id}`]}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow disabled:opacity-50"
                      >
                        {processingActions[`verify-${c.id}`]
                          ? <Loader2 className="animate-spin" size={15} />
                          : <CheckCircle size={15} />}
                        Verify Resolution
                        <ArrowRight size={14} />
                      </button>
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
