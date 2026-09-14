import { useState, useEffect } from 'react'
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  History,
  Camera,
  Bell,
  Search,
  Settings,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  FileBarChart,
  User,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  Clock,
  Users,
  Truck,
  Store,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
  ShieldAlert,
  Sprout
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function DashboardLayout() {
  const { user, logout, session } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [sidebarOpen, setSidebarOpen] = useState(true) // Collapsible sidebar state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [notifMenuOpen, setNotifMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState([])

  // Section Accordion State
  const [protectionExpanded, setProtectionExpanded] = useState(true)
  const [marketExpanded, setMarketExpanded] = useState(true)

  // Pre-Harvest Protection Nav Items
  const protectionNavItems = [
    { label: 'Overview Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Detection History', path: '/detections', icon: History },
    { label: 'Camera Feeds', path: '/cameras', icon: Camera },
    { label: 'Intrusion Alerts', path: '/alerts', icon: AlertTriangle, badge: notifications.length > 0 ? String(notifications.length) : null },
    { label: 'Surveillance Reports', path: '/reports', icon: FileBarChart },
    { label: 'System Settings', path: '/settings', icon: Settings },
  ]

  // Post-Harvest & Market Intelligence Nav Items
  const marketNavItems = [
    { label: 'Mandi Market Prices', path: '/market/prices', icon: TrendingUp, tag: 'Live' },
    { label: 'Sale-Window Advisory', path: '/market/sale-window', icon: Clock },
    { label: 'Buyer Demand Profiles', path: '/market/buyer-profile', icon: Store },
    { label: 'Smart Buyer Matches', path: '/market/buyer-matches', icon: Users },
    { label: 'Logistics & Storage', path: '/market/logistics', icon: Truck },
  ]

  useEffect(() => {
    const fetchNotifs = async () => {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      try {
        const headers = {}
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`
        }
        const res = await fetch(`${backendUrl}/api/notifications`, { headers })
        if (res.ok) {
          const data = await res.json()
          const items = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []
          setNotifications(items)
        }
      } catch {
        // Safe fallback
      }
    }

    fetchNotifs()
  }, [session])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/detections?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFBF8] text-[#2F2F2F] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-40 h-16 shadow-2xs">
        <div className="px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          
          {/* Left section: Hamburger Toggle & Logo */}
          <div className="flex items-center gap-3">
            {/* Desktop Hamburger Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl text-[#666666] hover:text-[#2F2F2F] hover:bg-slate-100 hidden md:flex items-center justify-center transition-colors"
              title={sidebarOpen ? 'Collapse Navigation Sidebar' : 'Expand Navigation Sidebar'}
              aria-label="Toggle navigation sidebar"
            >
              {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="p-2 rounded-xl text-[#666666] hover:text-[#2F2F2F] hover:bg-slate-100 md:hidden transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileDrawerOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#8FAF5A] flex items-center justify-center text-white shadow-xs group-hover:bg-[#6B8E23] transition-colors">
                <ShieldCheck size={20} />
              </div>
              <div>
                <span className="font-extrabold text-[#2F2F2F] text-base sm:text-lg tracking-tight leading-tight block">
                  AgriSync <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider ml-1 bg-emerald-100 px-1.5 py-0.5 rounded">Platform</span>
                </span>
                <span className="text-[11px] text-[#666666] font-medium hidden sm:block">
                  Protection & Market Intelligence
                </span>
              </div>
            </Link>
          </div>

          {/* Center search bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search camera ID, crop prices, or buyer matches..."
                className="w-full pl-9 pr-10 py-1.5 text-sm bg-[#FAFBF8] border border-[#E5E7EB] rounded-xl text-[#2F2F2F] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#8FAF5A]/30 focus:border-[#8FAF5A] focus:bg-white transition-all"
              />
            </form>
          </div>

          {/* Right section: Notifications & Profile */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/market/prices"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <TrendingUp size={14} className="text-emerald-600" />
              <span>Live Mandi Rates</span>
            </Link>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifMenuOpen(!notifMenuOpen)
                  setProfileMenuOpen(false)
                }}
                className="p-2 rounded-xl text-[#666666] hover:text-[#2F2F2F] hover:bg-[#FAFBF8] relative transition-colors"
                title="Alert notifications"
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#DC2626]"></span>
                )}
              </button>

              {notifMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E5E7EB] rounded-xl shadow-lg p-4 z-50 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E5E7EB]">
                    <span className="text-sm font-bold text-[#2F2F2F]">System Notifications</span>
                    <span className="text-xs font-bold bg-[#FEF3C7] text-[#D97706] px-2.5 py-0.5 rounded-full">
                      {notifications.length} Alerts
                    </span>
                  </div>

                  {notifications.length === 0 ? (
                    <p className="text-xs text-[#8A8A8A] text-center py-4">No active alerts.</p>
                  ) : (
                    <div className="space-y-2 text-xs max-h-60 overflow-y-auto">
                      {notifications.slice(0, 5).map((n, i) => (
                        <div key={n.id || i} className="p-2.5 rounded-lg bg-[#FAFBF8] border border-[#E5E7EB]">
                          <div className="flex items-center justify-between font-bold text-[#2F2F2F]">
                            <span>{n.title || 'Intrusion Alert'}</span>
                            <span className="text-xs text-[#8A8A8A] font-medium">{n.time || 'Live'}</span>
                          </div>
                          <p className="text-xs text-[#666666] mt-1">{n.body || 'Alert detected'}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <Link
                    to="/alerts"
                    onClick={() => setNotifMenuOpen(false)}
                    className="block text-center text-xs font-bold text-[#6B8E23] hover:underline mt-3 pt-2 border-t border-[#E5E7EB]"
                  >
                    View all alert history →
                  </Link>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileMenuOpen(!profileMenuOpen)
                  setNotifMenuOpen(false)
                }}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#FAFBF8] transition-colors border border-transparent hover:border-[#E5E7EB]"
              >
                <div className="w-8 h-8 rounded-xl bg-[#A3B18A]/25 text-[#526F1B] flex items-center justify-center font-bold text-xs">
                  {user?.email ? user.email.charAt(0).toUpperCase() : 'T'}
                </div>
                <span className="text-xs font-bold text-[#2F2F2F] hidden lg:inline max-w-[120px] truncate">
                  {user?.email ? user.email.split('@')[0] : 'Tej'}
                </span>
                <ChevronDown size={14} className="text-[#8A8A8A]" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5E7EB] rounded-xl shadow-lg p-2.5 z-50 animate-in fade-in duration-200">
                  <div className="px-3 py-2 border-b border-[#E5E7EB]">
                    <p className="text-xs font-bold text-[#2F2F2F] truncate">{user?.email || 'tej@agrisync.farm'}</p>
                    <p className="text-[11px] text-[#666666]">Platform Operator</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/settings"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#2F2F2F] hover:bg-[#FAFBF8] rounded-lg transition-colors"
                    >
                      <User size={15} className="text-[#666666]" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false)
                        logout()
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#DC2626] hover:bg-[#FEE2E2]/40 rounded-lg transition-colors text-left"
                    >
                      <LogOut size={15} />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      <div className="flex-1 flex min-w-0">
        {/* SIDEBAR NAVIGATION (Collapsible + Expandable Accordion Categories) */}
        <aside
          className={`bg-white border-r border-[#E5E7EB] transition-all duration-300 ease-in-out z-30 flex flex-col justify-between ${
            mobileDrawerOpen
              ? 'fixed inset-y-0 left-0 w-72 pt-16 shadow-2xl translate-x-0'
              : 'fixed inset-y-0 left-0 w-72 pt-16 -translate-x-full md:translate-x-0 md:static md:pt-0'
          } ${
            sidebarOpen ? 'md:w-68' : 'md:w-20'
          }`}
        >
          <div className="p-3 flex flex-col justify-between h-full overflow-y-auto">
            <nav className="space-y-4">
              
              {/* SECTION 1: CROP PROTECTION (ANIMAL INTRUSION) - ACCORDION */}
              <div className="space-y-1">
                {sidebarOpen ? (
                  <button
                    onClick={() => setProtectionExpanded(!protectionExpanded)}
                    className="w-full px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/70 rounded-xl flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <ShieldAlert size={14} className="text-amber-700" />
                      <span>1. Crop Protection</span>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-amber-700 transition-transform duration-200 ${
                        protectionExpanded ? 'rotate-0' : '-rotate-90'
                      }`}
                    />
                  </button>
                ) : (
                  <div className="text-center py-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" title="Crop Protection"></span>
                  </div>
                )}

                {/* Sub-items (collapsible) */}
                {(protectionExpanded || !sidebarOpen) && (
                  <div className="space-y-1 pt-1">
                    {protectionNavItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileDrawerOpen(false)}
                          title={!sidebarOpen ? item.label : undefined}
                          className={({ isActive }) =>
                            `flex items-center ${sidebarOpen ? 'justify-between px-3.5 py-2' : 'justify-center p-2.5'} rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                              isActive
                                ? 'bg-amber-100 text-amber-950 font-bold shadow-xs'
                                : 'text-[#666666] hover:bg-[#FAFBF8] hover:text-[#2F2F2F]'
                            }`
                          }
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={17} className="flex-shrink-0" />
                            {sidebarOpen && <span>{item.label}</span>}
                          </div>
                          {sidebarOpen && item.badge && (
                            <span className="text-[10px] font-bold bg-[#FEF3C7] text-[#D97706] px-2 py-0.5 rounded-md">
                              {item.badge}
                            </span>
                          )}
                        </NavLink>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* SECTION 2: MARKET ADVISORY (POST-HARVEST) - ACCORDION */}
              <div className="space-y-1 pt-2 border-t border-slate-100">
                {sidebarOpen ? (
                  <button
                    onClick={() => setMarketExpanded(!marketExpanded)}
                    className="w-full px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-emerald-900 bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200/70 rounded-xl flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <Sprout size={14} className="text-emerald-700" />
                      <span>2. Market Advisory</span>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-emerald-700 transition-transform duration-200 ${
                        marketExpanded ? 'rotate-0' : '-rotate-90'
                      }`}
                    />
                  </button>
                ) : (
                  <div className="text-center py-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" title="Market Advisory"></span>
                  </div>
                )}

                {/* Sub-items (collapsible) */}
                {(marketExpanded || !sidebarOpen) && (
                  <div className="space-y-1 pt-1">
                    {marketNavItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileDrawerOpen(false)}
                          title={!sidebarOpen ? item.label : undefined}
                          className={({ isActive }) =>
                            `flex items-center ${sidebarOpen ? 'justify-between px-3.5 py-2' : 'justify-center p-2.5'} rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                              isActive
                                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                : 'text-[#666666] hover:bg-[#FAFBF8] hover:text-[#2F2F2F]'
                            }`
                          }
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={17} className="flex-shrink-0" />
                            {sidebarOpen && <span>{item.label}</span>}
                          </div>
                          {sidebarOpen && item.tag && (
                            <span className="text-[10px] font-bold bg-white/25 px-1.5 py-0.5 rounded">
                              {item.tag}
                            </span>
                          )}
                        </NavLink>
                      )
                    })}
                  </div>
                )}
              </div>

            </nav>

            {/* Sidebar footer status */}
            {sidebarOpen && (
              <div className="mt-6 pt-4 border-t border-[#E5E7EB] px-2 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-semibold text-slate-700">
                  <span>AgriSync Platform</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">AGMARKNET API & YOLO Surveillance</p>
              </div>
            )}
          </div>
        </aside>

        {/* Mobile backdrop overlay */}
        {mobileDrawerOpen && (
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-xs z-20 md:hidden"
          ></div>
        )}

        {/* Main page content container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
