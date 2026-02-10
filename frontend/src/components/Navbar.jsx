import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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
  Home,
  FileText,
  LayoutDashboard,
  Trophy,
  Sparkles
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState("EN");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [isScrolled, setIsScrolled] = useState(false);

  const token = localStorage.getItem("token");

  let role = null;
  let username = "User";

  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    role = payload.role;
    username = payload.username || payload.email?.split('@')[0] || "User";
  }

  // ---------------- Scroll effect ----------------
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ---------------- Theme toggle ----------------
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  // ---------------- Close menus on route change ----------------
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Navigation items
  const citizenLinks = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: "/my-complaints", label: "My Complaints", icon: <FileText size={18} /> },
    { path: "/complaint", label: "File Complaint", icon: <Sparkles size={18} />, highlight: true },
    { path: "/leaderboard", label: "Leaderboard", icon: <Trophy size={18} /> },
    {path :"/citizen-profile", label:"Citizen Profile", icon:<User size={18} />},
    {path :"/notifications", label:"Notifications", icon:<Bell size={18} />},
  ];

  const officerLinks = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: "/officer-complaints", label: "Assigned", icon: <FileText size={18} /> },
    { path: "/leaderboard", label: "Leaderboard", icon: <Trophy size={18} /> },
    
  ];

  const links = role === "citizen" ? citizenLinks : role === "officer" ? officerLinks : [];

  // Active link style
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={`
          sticky top-0 z-50
          transition-all duration-300
          ${isScrolled 
            ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-2xl py-2' 
            : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-lg py-3'
          }
          backdrop-blur-md
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* ---------------- LOGO ---------------- */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                  <Home className="text-teal-600" size={24} />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold tracking-tight group-hover:scale-105 transition-transform">
                  CivicTrack
                </h1>
                <p className="text-white/70 text-xs font-medium">Community First</p>
              </div>
            </div>

            {/* ---------------- DESKTOP LINKS ---------------- */}
            <div className="hidden lg:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    relative px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm
                    flex items-center gap-2 group overflow-hidden
                    ${isActive(link.path)
                      ? 'bg-white text-teal-600 shadow-lg scale-105'
                      : link.highlight
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 hover:from-yellow-300 hover:to-orange-300 shadow-md'
                      : 'text-white/90 hover:text-white hover:bg-white/15'
                    }
                  `}
                >
                  <span className={`transition-transform duration-300 ${isActive(link.path) ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                  {isActive(link.path) && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>

            {/* ---------------- RIGHT ACTIONS ---------------- */}
            <div className="flex items-center gap-2">

              {/* Notifications */}
              {token && (
                <button className="hidden md:flex relative p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all group">
                  <Bell size={20} className="group-hover:animate-wiggle" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce">
                      {notifications}
                    </span>
                  )}
                </button>
              )}

              {/* Language Toggle */}
              <button
                onClick={() => setLang(lang === "EN" ? "HI" : "EN")}
                className="hidden md:flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-all group"
              >
                <Globe size={18} className="group-hover:rotate-12 transition-transform" />
                <span className="font-semibold">{lang}</span>
              </button>



              {/* User Menu */}
              {token && (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-all group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-gray-900 shadow-md">
                      {username.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left hidden xl:block">
                      <p className="text-sm font-semibold">{username}</p>
                      <p className="text-xs text-white/70 capitalize">{role}</p>
                    </div>
                    <ChevronDown size={16} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-top">
                      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-4 text-white">
                        <p className="font-bold text-lg">{username}</p>
                        <p className="text-sm text-white/80 capitalize flex items-center gap-1">
                          {role === "officer" ? <Shield size={14} /> : <User size={14} />}
                          {role}
                        </p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-all text-red-600 font-medium"
                        >
                          <LogOut size={18} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Logout Button (when no user menu) */}
              {token && !userMenuOpen && (
                <button
                  onClick={logout}
                  className="hidden md:flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <LogOut size={18} />
                  <span className="font-semibold">Logout</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ---------------- MOBILE MENU ---------------- */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl animate-in slide-in-from-right">
            
            {/* Mobile Header */}
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-6 text-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              {token && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-gray-900 text-lg shadow-lg">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold">{username}</p>
                    <p className="text-sm text-white/80 capitalize">{role}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Links */}
            <div className="p-4 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
                    ${isActive(link.path)
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                      : link.highlight
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}

              <div className="border-t border-gray-200 my-4"></div>

              {/* Mobile Actions */}
              <button
                onClick={() => setLang(lang === "EN" ? "HI" : "EN")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all font-medium"
              >
                <Globe size={20} />
                Language: {lang}
              </button>

              

              {token && (
                <>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all font-medium">
                    <Bell size={20} />
                    Notifications
                    {notifications > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        {notifications}
                      </span>
                    )}
                  </button>

                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all font-medium">
                    <Settings size={20} />
                    Settings
                  </button>

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 transition-all font-medium shadow-lg mt-4"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}