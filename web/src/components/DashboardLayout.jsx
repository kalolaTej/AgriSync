import { useState, useEffect } from 'react'
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Bell,
  Search,
  Settings,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  User,
  ChevronDown,
  TrendingUp,
  Clock,
  Users,
  Truck,
  Store,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
  Sprout,
  BarChart3,
  CircleDollarSign
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function DashboardLayout() {
  const { user, logout, session } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // AgriSync Market Intelligence Navigation Items
  const marketNavItems = [
    { label: 'Overview Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Mandi Market Prices', path: '/market/prices', icon: TrendingUp, tag: 'Live API' },
    { label: 'Sale-Window Advisory', path: '/market/sale-window', icon: Clock },
    { label: 'Buyer Demand Profiles', path: '/market/buyer-profile', icon: Store },
    { label: 'Smart Buyer Matches', path: '/market/buyer-matches', icon: Users },
    { label: 'Logistics & Storage', path: '/market/logistics', icon: Truck },
  ]

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/market/prices`)
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
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-700 transition-colors">
                <Sprout size={20} />
              </div>
              <div>
                <span className="font-extrabold text-[#2F2F2F] text-base sm:text-lg tracking-tight leading-tight block">
                  AgriSync <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider ml-1 bg-emerald-100 px-1.5 py-0.5 rounded">Market Intelligence</span>
                </span>
                <span className="text-[11px] text-[#666666] font-medium hidden sm:block">
                  Mandi Rates, Advisory & Buyer Matching
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
                placeholder="Search commodity prices, mandis, or buyer matches..."
                className="w-full pl-9 pr-10 py-1.5 text-sm bg-[#FAFBF8] border border-[#E5E7EB] rounded-xl text-[#2F2F2F] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition-all"
              />
            </form>
          </div>

          {/* Right section: Live Mandi Rates badge & Profile */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/market/prices"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <TrendingUp size={14} className="text-emerald-600" />
              <span>data.gov.in Live Feed</span>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#FAFBF8] transition-colors border border-transparent hover:border-[#E5E7EB]"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
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
                    <p className="text-[11px] text-[#666666]">Platform Lead</p>
                  </div>
                  <div className="py-1">
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
        {/* SIDEBAR NAVIGATION */}
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
            <nav className="space-y-2">
              
              {sidebarOpen && (
                <div className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-emerald-900 bg-emerald-50/70 border border-emerald-200/60 rounded-xl mb-3">
                  Market & Advisory Hub
                </div>
              )}

              <div className="space-y-1">
                {marketNavItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileDrawerOpen(false)}
                      title={!sidebarOpen ? item.label : undefined}
                      className={({ isActive }) =>
                        `flex items-center ${sidebarOpen ? 'justify-between px-3.5 py-2.5' : 'justify-center p-2.5'} rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-emerald-600 text-white font-bold shadow-xs'
                            : 'text-[#666666] hover:bg-[#FAFBF8] hover:text-[#2F2F2F]'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} className="flex-shrink-0" />
                        {sidebarOpen && <span>{item.label}</span>}
                      </div>
                      {sidebarOpen && item.tag && (
                        <span className="text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded">
                          {item.tag}
                        </span>
                      )}
                    </NavLink>
                  )
                })}
              </div>

            </nav>

            {/* Sidebar Footer */}
            {sidebarOpen && (
              <div className="mt-6 pt-4 border-t border-[#E5E7EB] px-2 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-semibold text-slate-700">
                  <span>AgriSync API Engine</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    AGMARKNET Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">data.gov.in Mandi Price Synchronization</p>
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
