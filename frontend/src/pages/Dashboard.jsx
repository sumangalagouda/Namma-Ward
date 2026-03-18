import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  Search,
  RefreshCw,
  Filter,
  TrendingUp,
  CheckCircle2,
  Clock,
  FileText,
  ChevronDown,
  X,
  AlertCircle,
  MapPin,
  Tag,
  ThumbsUp,
  MessageSquare,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";

// ─── Design Tokens (mirrors Navbar tokens) ───────────────────────────────────
const C = {
  primary:      "#0f2a4a",   // navy
  primaryMid:   "#1a3a6e",
  accent:       "#2563eb",   // blue-600  (CTA)
  accentLight:  "#eff6ff",   // blue-50
  accentText:   "#1d4ed8",   // blue-700
  sky:          "#38bdf8",   // active indicator
  surface:      "#ffffff",
  pageBg:       "#f1f5f9",   // slate-100
  border:       "#e2e8f0",   // slate-200
  textPrimary:  "#0f172a",   // slate-900
  textSecondary:"#475569",   // slate-600
  textMuted:    "#94a3b8",   // slate-400
};

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:     { label: "Pending",     bg: "bg-amber-50",   text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500"  },
  in_progress: { label: "In Progress", bg: "bg-blue-50",    text: "text-blue-700",   border: "border-blue-200",   dot: "bg-blue-500"   },
  resolved:    { label: "Resolved",    bg: "bg-emerald-50", text: "text-emerald-700",border: "border-emerald-200",dot: "bg-emerald-500"},
  verified:    { label: "Verified",    bg: "bg-violet-50",  text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500" },
};

const statusCfg = (s) =>
  STATUS_CONFIG[s] ?? { label: s, bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", dot: "bg-gray-400" };

// ─── StatusBadge ─────────────────────────────────────────────────────────────
function StatusBadge({ status, size = "sm" }) {
  const cfg = statusCfg(status);
  const text = size === "sm" ? "text-[11px]" : "text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border} ${text} whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
const STAT_VARIANTS = {
  navy:    { gradient: "from-[#0f2a4a] to-[#1a3a6e]", iconBg: "bg-white/15", iconText: "text-white", valueTxt: "text-white", labelTxt: "text-white/70" },
  blue:    { gradient: "from-[#2563eb] to-[#1d4ed8]", iconBg: "bg-white/15", iconText: "text-white", valueTxt: "text-white", labelTxt: "text-white/70" },
  amber:   { gradient: "from-amber-500 to-orange-500", iconBg: "bg-white/15", iconText: "text-white", valueTxt: "text-white", labelTxt: "text-white/70" },
  emerald: { gradient: "from-emerald-500 to-teal-500", iconBg: "bg-white/15", iconText: "text-white", valueTxt: "text-white", labelTxt: "text-white/70" },
};

function StatCard({ title, value, variant = "navy", icon, trend }) {
  const v = STAT_VARIANTS[variant] ?? STAT_VARIANTS.navy;
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${v.gradient} p-5 shadow-lg`}>
      {/* decorative circle */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/5" />
      <div className="absolute -right-2 -bottom-6 w-32 h-32 rounded-full bg-white/5" />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2.5 rounded-xl ${v.iconBg}`}>
            <span className={v.iconText}>{icon}</span>
          </div>
          {trend && (
            <span className="flex items-center gap-1 text-[11px] font-semibold bg-white/20 text-white px-2 py-1 rounded-full">
              <TrendingUp size={11} />
              {trend}
            </span>
          )}
        </div>
        <p className={`text-sm font-medium mb-1 ${v.labelTxt}`}>{title}</p>
        <p className={`text-3xl font-bold ${v.valueTxt}`}>{value}</p>
      </div>
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

// ─── ComplaintCard ────────────────────────────────────────────────────────────
function ComplaintCard({ complaint: c, onClick, index }) {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Image */}
      {c.image && (
        <div className="relative h-44 overflow-hidden bg-slate-100 flex-shrink-0">
          <img
            src={`http://localhost:5000/uploads/${c.image}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            alt={c.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute top-3 right-3">
            <StatusBadge status={c.status} />
          </div>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Title row */}
        <div className="flex items-start gap-2 mb-2">
          <h3 className="font-semibold text-[#0f172a] text-base leading-snug group-hover:text-[#1d4ed8] transition-colors line-clamp-2 flex-1">
            {c.title}
          </h3>
          {!c.image && <StatusBadge status={c.status} />}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-1">
          {c.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {c.issue_type && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
              <Tag size={11} />
              {c.issue_type}
            </span>
          )}
          {c.area && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
              <MapPin size={11} />
              {c.area}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3">
            {c.upvote_count !== undefined && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                <ThumbsUp size={13} />
                {c.upvote_count}
              </span>
            )}
            {c.comments?.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                <MessageSquare size={13} />
                {c.comments.length}
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1d4ed8] group-hover:gap-2 transition-all">
            View <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── LoadingGrid ─────────────────────────────────────────────────────────────
function LoadingGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
          <div className="h-44 bg-slate-200" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-full" />
            <div className="h-3 bg-slate-100 rounded w-5/6" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 bg-slate-100 rounded-full w-20" />
              <div className="h-6 bg-slate-100 rounded-full w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
function EmptyState({ onClear, hasFilters }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 py-20 flex flex-col items-center justify-center text-center px-6">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <FileText size={28} className="text-slate-400" />
      </div>
      <p className="text-slate-700 font-semibold text-lg mb-1">No complaints found</p>
      <p className="text-slate-400 text-sm">
        {hasFilters ? "Try adjusting your search or filters" : "No complaints have been filed yet"}
      </p>
      {hasFilters && (
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

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [selectedIssueType, setSelectedIssueType] = useState("");

  // ── Fetch ──
  const fetchComplaints = async (filter = "") => {
    setLoading(true);
    try {
      const url = filter ? `/complaints/dashboard?status=${filter}` : "/complaints/dashboard";
      const res = await api.get(url);
      setComplaints(res.data);
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const handleStatusFilter = (value) => {
    setStatus(value);
    fetchComplaints(value);
  };

  const clearFilters = () => {
    setStatus("");
    setSearch("");
    setSelectedIssueType("");
    setSortBy("recent");
    fetchComplaints("");
  };

  // ── Derived data ──
  const total      = complaints.length;
  const pending    = complaints.filter((c) => c.status === "pending").length;
  const inProgress = complaints.filter((c) => c.status === "in_progress").length;
  const resolved   = complaints.filter((c) => c.status === "resolved").length;
  const issueTypes = [...new Set(complaints.map((c) => c.issue_type).filter(Boolean))];

  const hasActiveFilters = !!(status || selectedIssueType || search);

  const filtered = complaints
    .filter((c) =>
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((c) => (selectedIssueType ? c.issue_type === selectedIssueType : true))
    .sort((a, b) =>
      sortBy === "upvotes" ? (b.upvote_count || 0) - (a.upvote_count || 0) : 0
    );

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ── Page header ── */}
      <div className="bg-gradient-to-br from-[#0f2a4a] to-[#1a3a6e] pt-8 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Community Dashboard</h1>
            <p className="text-white/60 text-sm">Browse, search, and track all civic complaints</p>
          </div>

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Complaints"
              value={total}
              variant="navy"
              icon={<FileText size={20} />}
            />
            <StatCard
              title="Pending"
              value={pending}
              variant="amber"
              icon={<Clock size={20} />}
            />
            <StatCard
              title="In Progress"
              value={inProgress}
              variant="blue"
              icon={<AlertCircle size={20} />}
            />
            <StatCard
              title="Resolved"
              value={resolved}
              variant="emerald"
              icon={<CheckCircle2 size={20} />}
              trend="+12%"
            />
          </div>
        </div>
      </div>

      {/* ── Content (overlaps header) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-16">

        {/* ── Search + Filter Card ── */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 mb-6">

          {/* Top bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                placeholder="Search complaints…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 transition-all bg-slate-50 placeholder:text-slate-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowFilters((v) => !v)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  showFilters
                    ? "bg-[#0f2a4a] text-white shadow"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <SlidersHorizontal size={16} />
                Filters
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
                />
              </button>

              <button
                onClick={() => fetchComplaints(status)}
                title="Refresh"
                className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:border-[#2563eb] hover:text-[#2563eb] hover:bg-blue-50 transition-all group"
              >
                <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3.5 py-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all text-sm font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Expanded filter panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* Status pills */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">Status</p>
                <div className="flex flex-wrap gap-2">
                  {["", "pending", "in_progress", "resolved", "verified"].map((s) => (
                    <FilterPill
                      key={s}
                      active={status === s}
                      onClick={() => handleStatusFilter(s)}
                    >
                      {s ? statusCfg(s).label : "All"}
                    </FilterPill>
                  ))}
                </div>
              </div>

              {/* Issue Type */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">Issue Type</p>
                <select
                  value={selectedIssueType}
                  onChange={(e) => setSelectedIssueType(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 bg-white"
                >
                  <option value="">All Types</option>
                  {issueTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">Sort By</p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 bg-white"
                >
                  <option value="recent">Most Recent</option>
                  <option value="upvotes">Most Upvoted</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* ── Active filter chips + count ── */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-[#1d4ed8]">{filtered.length}</span>
            {" "}of {total} complaints
          </p>
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {status && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#eff6ff] text-[#1d4ed8] rounded-full text-xs font-medium border border-blue-100">
                  Status: {statusCfg(status).label}
                  <button onClick={() => handleStatusFilter("")}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedIssueType && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#eff6ff] text-[#1d4ed8] rounded-full text-xs font-medium border border-blue-100">
                  Type: {selectedIssueType}
                  <button onClick={() => setSelectedIssueType("")}>
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Grid / States ── */}
        {loading ? (
          <LoadingGrid />
        ) : filtered.length === 0 ? (
          <EmptyState onClear={clearFilters} hasFilters={hasActiveFilters} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((c, i) => (
              <ComplaintCard
                key={c.id}
                complaint={c}
                index={i}
                onClick={() => navigate(`/complaint/${c.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer className="bg-[#0f2a4a] text-white py-8 mt-4">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white/70 text-sm">
            © 2026 Namma Ward · Citizen Complaint Portal · Government Initiative for Public Welfare
          </p>
          <p className="text-white/40 text-xs mt-1">
            Making governance transparent and accessible to all
          </p>
        </div>
      </footer>
    </div>
  );
}
