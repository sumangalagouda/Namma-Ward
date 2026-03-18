import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import logo from "../assets/LOGO1.png";
import {
  Sun,
  Moon,
  LogOut,
  Globe,
  Menu,
  X,
  User,
  Shield,
  ChevronDown,
  Bell,
  Settings,
  LayoutDashboard,
  FileText,
  DollarSign,
  Trophy,
  Sparkles,
  UserCircle,
} from "lucide-react";

// ─── Design Tokens ──────────────────────────────────────────────────────────
// All color/spacing decisions live here. Update once → applies everywhere.
const TOKEN = {
  nav: {
    base: "bg-[#0f2a4a]",
    scrolled: "bg-[#0a1f38] shadow-[0_4px_24px_rgba(0,0,0,0.35)]",
  },
  accent: "text-[#38bdf8]",          // sky-400
  accentBg: "bg-[#38bdf8]",
  highlight: "bg-[#1d4ed8] text-white",  // active / CTA
  muted: "text-white/60",
  pill: "rounded-lg",
  transition: "transition-all duration-200",
};

// ─── NavLink ────────────────────────────────────────────────────────────────
function NavLink({ to, icon, label, active, highlight }) {
  const base =
    "relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200";
  const activeStyle = "bg-white/15 text-white ring-1 ring-white/20";
  const highlightStyle =
    "bg-[#2563eb] text-white shadow-lg shadow-blue-700/40 hover:bg-[#1d4ed8]";
  const defaultStyle = "text-white/80 hover:text-white hover:bg-white/10";

  return (
    <Link
      to={to}
      className={`${base} ${
        active ? activeStyle : highlight ? highlightStyle : defaultStyle
      }`}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span>{label}</span>
      {active && !highlight && (
        <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#38bdf8] rounded-full" />
      )}
    </Link>
  );
}

// ─── Avatar ─────────────────────────────────────────────────────────────────
function Avatar({ name, size = "md" }) {
  const sizes = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-12 h-12 text-base" };
  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-br from-[#38bdf8] to-[#2563eb] flex items-center justify-center font-bold text-white flex-shrink-0 shadow`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

// ─── NotificationBadge ──────────────────────────────────────────────────────
function NotificationBadge({ count }) {
  if (!count) return null;
  return (
    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
      {count > 9 ? "9+" : count}
    </span>
  );
}

// ─── Dropdown Item ───────────────────────────────────────────────────────────
function DropdownItem({ icon, label, onClick, to, danger, badge, className = "" }) {
  const base =
    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150";
  const variant = danger
    ? "text-red-500 hover:bg-red-50 hover:text-red-600"
    : "text-gray-700 hover:bg-[#eff6ff] hover:text-[#1d4ed8]";

  const content = (
    <>
      <span className="flex-shrink-0">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {badge != null && badge > 0 && (
        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={`${base} ${variant} ${className}`}>
        {content}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={`${base} ${variant} ${className}`}>
      {content}
    </button>
  );
}

// ─── Main Navbar ─────────────────────────────────────────────────────────────
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState("EN");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications] = useState(3);
  const [scrolled, setScrolled] = useState(false);

  const userMenuRef = useRef(null);

  // ── Auth ──
  const token = localStorage.getItem("token");
  let role = null;
  let username = "User";
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload.role;
      username = payload.username || payload.email?.split("@")[0] || "User";
    } catch (_) {}
  }

  // ── Scroll ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Theme ──
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // ── Close on route change ──
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  // ── Click-outside to close user menu ──
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ── Nav definitions ──
  const citizenLinks = [
    { path: "/dashboard",      label: "Dashboard",     icon: <LayoutDashboard size={16} /> },
    { path: "/my-complaints",  label: "My Complaints", icon: <FileText size={16} /> },
    { path: "/pay-bill",       label: "Pay Bill",      icon: <DollarSign size={16} /> },
    { path: "/complaint",      label: "File Complaint",icon: <Sparkles size={16} />, highlight: true },
    { path: "/leaderboard",    label: "Leaderboard",   icon: <Trophy size={16} /> },
  ];

  const officerLinks = [
    { path: "/dashboard",         label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { path: "/officer-complaints",label: "Assigned",  icon: <FileText size={16} /> },
    { path: "/officer-profile",   label: "Profile",   icon: <UserCircle size={16} /> },
    { path: "/leaderboard",       label: "Leaderboard",icon: <Trophy size={16} /> },
  ];

  const links = role === "citizen" ? citizenLinks : role === "officer" ? officerLinks : [];
  const profilePath = role === "citizen" ? "/citizen-profile" : "/officer-profile";
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ════════════════════ TOP NAV ════════════════════ */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? TOKEN.nav.scrolled : TOKEN.nav.base
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 shrink-0 group focus:outline-none"
          >
            <img src={logo} alt="Namma Ward" className="h-9 w-9 object-contain" />
            <span className="text-white text-xl font-bold tracking-tight group-hover:text-[#38bdf8] transition-colors">
              Namma Ward
            </span>
          </button>

          {/* ── Desktop Links ── */}
          {links.length > 0 && (
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  icon={link.icon}
                  label={link.label}
                  active={isActive(link.path)}
                  highlight={link.highlight}
                />
              ))}
            </div>
          )}

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Notifications */}
            {token && (
              <button
                onClick={() => navigate("/notifications")}
                aria-label="Notifications"
                className="hidden md:flex relative p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all"
              >
                <Bell size={20} />
                <NotificationBadge count={notifications} />
              </button>
            )}

            {/* Language */}
            <button
              onClick={() => setLang(lang === "EN" ? "HI" : "EN")}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
            >
              <Globe size={16} />
              <span>{lang}</span>
            </button>

            {/* User Menu */}
            {token && (
              <div className="relative hidden md:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 transition-all group"
                >
                  <Avatar name={username} />
                  <div className="hidden xl:block text-left">
                    <p className="text-sm font-semibold text-white leading-none">{username}</p>
                    <p className="text-[11px] text-white/60 capitalize mt-0.5">{role}</p>
                  </div>
                  <ChevronDown
                    size={15}
                    className={`text-white/60 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-[#0f2a4a] to-[#1d4ed8] px-4 py-3.5 flex items-center gap-3">
                      <Avatar name={username} size="lg" />
                      <div>
                        <p className="font-semibold text-white text-sm">{username}</p>
                        <p className="text-[11px] text-white/60 capitalize flex items-center gap-1 mt-0.5">
                          {role === "officer" ? <Shield size={11} /> : <User size={11} />}
                          {role}
                        </p>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="p-2">
                      <DropdownItem
                        to={profilePath}
                        icon={<UserCircle size={16} className="text-[#1d4ed8]" />}
                        label="My Profile"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <DropdownItem
                        icon={<Settings size={16} className="text-gray-500" />}
                        label="Settings"
                      />
                      <div className="border-t border-gray-100 my-1.5" />
                      <DropdownItem
                        icon={<LogOut size={16} />}
                        label="Sign Out"
                        onClick={logout}
                        danger
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ════════════════════ MOBILE DRAWER ════════════════════ */}
      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <aside
        className={`lg:hidden fixed top-0 right-0 bottom-0 z-50 w-72 bg-white flex flex-col shadow-2xl transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="bg-gradient-to-br from-[#0f2a4a] to-[#1a3a6e] px-5 py-5 flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white font-bold text-lg">Menu</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-all"
            >
              <X size={18} />
            </button>
          </div>
          {token && (
            <div className="flex items-center gap-3">
              <Avatar name={username} size="lg" />
              <div>
                <p className="font-semibold text-white">{username}</p>
                <p className="text-xs text-white/60 capitalize">{role}</p>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">

          {/* Navigation */}
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive(link.path)
                  ? "bg-[#0f2a4a] text-white"
                  : link.highlight
                  ? "bg-[#2563eb] text-white"
                  : "text-gray-700 hover:bg-[#eff6ff] hover:text-[#1d4ed8]"
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}

          {token && (
            <>
              <div className="border-t border-gray-100 my-3" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 pb-1">
                Account
              </p>
              <Link
                to={profilePath}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-[#eff6ff] hover:text-[#1d4ed8] transition-all"
              >
                <UserCircle size={16} className="text-[#1d4ed8]" />
                <span>My Profile</span>
              </Link>
              <Link
                to="/notifications"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-[#eff6ff] hover:text-[#1d4ed8] transition-all"
              >
                <Bell size={16} className="text-[#1d4ed8]" />
                <span className="flex-1">Notifications</span>
                {notifications > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {notifications}
                  </span>
                )}
              </Link>

              <div className="border-t border-gray-100 my-3" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 pb-1">
                Preferences
              </p>
              <button
                onClick={() => setLang(lang === "EN" ? "HI" : "EN")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
              >
                <Globe size={16} />
                <span>Language: {lang}</span>
              </button>
              <button
                onClick={() => setDark(!dark)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
              >
                {dark ? <Sun size={16} /> : <Moon size={16} />}
                <span>{dark ? "Light Mode" : "Dark Mode"}</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all">
                <Settings size={16} />
                <span>Settings</span>
              </button>

              <div className="border-t border-gray-100 my-3" />
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
