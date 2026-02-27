import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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
  Home,
  FileText,
  DollarSign,
  LayoutDashboard,
  Trophy,
  Sparkles,
  UserCircle
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

  // Navigation items (removed profile and notifications from main nav)
  const citizenLinks = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: "/my-complaints", label: "My Complaints", icon: <FileText size={18} /> },
    { path: "/pay-bill", label: "Pay Bill", icon: <DollarSign size={18} /> },
    { path: "/complaint", label: "File Complaint", icon: <Sparkles size={18} />, highlight: true },
    { path: "/leaderboard", label: "Leaderboard", icon: <Trophy size={18} /> },
  ];

  const officerLinks = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: "/officer-complaints", label: "Assigned", icon: <FileText size={18} /> },
    { path: "/officer-profile", label: "Profile", icon: <UserCircle size={18} /> },
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
                          <div className="flex justify-center mb-4">
                            <img
                              src={logo}
                              alt="logo"
                              className="h-10 w-10 object-contain"
                            />
                  {/* <Home className="text-teal-600" size={24} /> */}
                  
                </div>
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold tracking-tight group-hover:scale-105 transition-transform">
                  Namma Ward
                </h1>
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

              {/* Notifications - Single Instance */}
              {token && (
                <button 
                  onClick={() => navigate('/notifications')}
                  className="hidden md:flex relative p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all group"
                >
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

              {/* User Menu - Consolidated */}
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

                  {/* User Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-top">
                      {/* User Info Header */}
                      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-4 text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-gray-900 text-lg shadow-lg">
                            {username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-lg">{username}</p>
                            <p className="text-sm text-white/80 capitalize flex items-center gap-1">
                              {role === "officer" ? <Shield size={14} /> : <User size={14} />}
                              {role}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        {/* Profile Link */}
                        <Link
                          to={role === "citizen" ? "/citizen-profile" : "/officer-profile"}
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-teal-50 transition-all text-gray-700 font-medium group"
                        >
                          <UserCircle size={18} className="text-teal-600 group-hover:scale-110 transition-transform" />
                          <span>My Profile</span>
                        </Link>

                        {/* Notifications Link (Mobile/Tablet) */}
                        <Link
                          to="/notifications"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition-all text-gray-700 font-medium group md:hidden"
                        >
                          <Bell size={18} className="text-blue-600 group-hover:scale-110 transition-transform" />
                          <span>Notifications</span>
                          {notifications > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              {notifications}
                            </span>
                          )}
                        </Link>

                        {/* Settings */}
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-all text-gray-700 font-medium group">
                          <Settings size={18} className="text-gray-600 group-hover:scale-110 transition-transform" />
                          <span>Settings</span>
                        </button>

                        <div className="border-t border-gray-200 my-2"></div>

                        {/* Logout */}
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-all text-red-600 font-medium group"
                        >
                          <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl animate-in slide-in-from-right overflow-y-auto">
            
            {/* Mobile Header */}
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-6 text-white sticky top-0 z-10">
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
              {/* Main Navigation Links */}
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

              {/* User Actions Section */}
              {token && (
                <>
                  <p className="text-xs font-semibold text-gray-500 uppercase px-4 mb-2">Account</p>
                  
                  {/* Profile */}
                  <Link
                    to={role === "citizen" ? "/citizen-profile" : "/officer-profile"}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-teal-50 transition-all font-medium"
                  >
                    <UserCircle size={20} className="text-teal-600" />
                    <span>My Profile</span>
                  </Link>

                  {/* Notifications */}
                  <Link
                    to="/notifications"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 transition-all font-medium"
                  >
                    <Bell size={20} className="text-blue-600" />
                    <span>Notifications</span>
                    {notifications > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        {notifications}
                      </span>
                    )}
                  </Link>

                  <div className="border-t border-gray-200 my-4"></div>

                  <p className="text-xs font-semibold text-gray-500 uppercase px-4 mb-2">Preferences</p>

                  {/* Language */}
                  <button
                    onClick={() => setLang(lang === "EN" ? "HI" : "EN")}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all font-medium"
                  >
                    <Globe size={20} />
                    <span>Language: {lang}</span>
                  </button>

                  {/* Theme Toggle */}
                  <button
                    onClick={() => setDark(!dark)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all font-medium"
                  >
                    {dark ? <Sun size={20} /> : <Moon size={20} />}
                    <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>

                  {/* Settings */}
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all font-medium">
                    <Settings size={20} />
                    <span>Settings</span>
                  </button>

                  <div className="border-t border-gray-200 my-4"></div>

                  {/* Logout */}
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 transition-all font-medium shadow-lg"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
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