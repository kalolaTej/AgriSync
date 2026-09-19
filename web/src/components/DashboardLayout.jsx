import React, { useState } from 'react'
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ShieldAlert,
  Camera,
  Bell,
  Settings,
  LogOut,
  TrendingUp,
  Clock,
  Users,
  Truck,
  Store,
  PanelLeftClose,
  PanelLeft,
  Sprout,
  BarChart3,
  PackagePlus,
  Building2,
  AlertTriangle,
  ChevronDown,
  Menu,
  X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function DashboardLayout({ children }) {
  const { user, logout, switchRole } = useAuth()
  const navigate = useNavigate()
  
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const navSections = [
    {
      title: 'Platform Overview',
      items: [
        { label: 'Overview Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'Pre-Harvest ("Protect")',
      items: [
        { label: 'Live Intrusion Detections', path: '/detections', icon: ShieldAlert },
        { label: 'Perimeter Cameras', path: '/cameras', icon: Camera },
        { label: 'Intrusion Alerts', path: '/alerts', icon: Bell },
        { label: 'Crop-Loss Incidents', path: '/preharvest/incidents/report', icon: AlertTriangle },
        { label: 'Intrusion Analytics', path: '/preharvest/incidents/analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'Post-Harvest ("Grow")',
      items: [
        { label: 'Create Produce Lot', path: '/produce/create', icon: PackagePlus },
        { label: 'Procurement Centres', path: '/procurement', icon: Building2 },
        { label: 'Post-Harvest Analytics', path: '/analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'Market & Value ("Value")',
      items: [
        { label: 'Mandi Market Prices', path: '/market/prices', icon: TrendingUp, tag: 'Live' },
        { label: 'Sale-Window Advisory', path: '/market/sale-window', icon: Clock },
        { label: 'Smart Buyer Matches', path: '/market/buyer-matches', icon: Users },
        { label: 'Buyer Demand Profiles', path: '/market/buyer-profile', icon: Store },
        { label: 'Logistics & Storage', path: '/market/logistics', icon: Truck },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-[#FAFBF8] text-[#2F2F2F] flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-40 h-16 shadow-2xs">
        <div className="px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          
          {/* Left: Brand & Sidebar Toggles */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl text-[#666666] hover:text-[#2F2F2F] hover:bg-slate-100 hidden md:flex items-center justify-center transition-colors"
              title={sidebarOpen ? 'Collapse Navigation Sidebar' : 'Expand Navigation Sidebar'}
              aria-label="Toggle navigation sidebar"
            >
              {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
            </button>

            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="p-2 rounded-xl text-[#666666] hover:text-[#2F2F2F] hover:bg-slate-100 md:hidden transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileDrawerOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <Link to="/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                <Sprout size={20} />
              </div>
              <div>
                <span className="font-extrabold text-[#2F2F2F] text-base sm:text-lg tracking-tight leading-tight block">
                  AgriSync
                </span>
                <span className="text-[11px] text-[#666666] font-medium hidden sm:block">
                  Guard the Harvest. Grow the Value.
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Role & Profile Menu */}
          <div className="flex items-center gap-3">
            {switchRole && (
              <div className="hidden sm:flex items-center gap-1.5 bg-[#FAFBF8] px-2.5 py-1 rounded-xl text-xs border border-[#E5E7EB]">
                <span className="text-[#8A8A8A] font-medium">Role:</span>
                <select
                  value={user?.role || 'farmer'}
                  onChange={(e) => switchRole(e.target.value)}
                  className="bg-transparent text-emerald-700 font-bold outline-none cursor-pointer text-xs"
                >
                  <option value="farmer">Farmer (FPO)</option>
                  <option value="procurement_operator">Procurement Operator</option>
                  <option value="buyer">Institutional Buyer</option>
                  <option value="admin">System Admin</option>
                </select>
              </div>
            )}

            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#FAFBF8] transition-colors border border-transparent hover:border-[#E5E7EB]"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'A')}
                </div>
                <span className="text-xs font-bold text-[#2F2F2F] hidden lg:inline max-w-[120px] truncate">
                  {user?.name || user?.email || 'Operator'}
                </span>
                <ChevronDown size={14} className="text-[#8A8A8A]" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5E7EB] rounded-xl shadow-lg p-2.5 z-50 animate-in fade-in duration-200">
                  <div className="px-3 py-2 border-b border-[#E5E7EB]">
                    <p className="text-xs font-bold text-[#2F2F2F] truncate">{user?.name || 'AgriSync User'}</p>
                    <p className="text-[11px] text-[#666666] capitalize">{user?.role?.replace('_', ' ') || 'Farmer'}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/settings"
                      onClick={() => setProfileMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#2F2F2F] hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <Settings size={15} className="text-[#666666]" />
                      <span>Farm Settings</span>
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

      {/* Main Layout Container */}
      <div className="flex-1 flex min-w-0">
        {/* Sidebar */}
        <aside
          className={`bg-white border-r border-[#E5E7EB] transition-all duration-300 ease-in-out z-30 flex flex-col justify-between ${
            mobileDrawerOpen
              ? 'fixed inset-y-0 left-0 w-72 pt-16 shadow-2xl translate-x-0 z-50'
              : 'fixed inset-y-0 left-0 w-72 pt-16 -translate-x-full md:translate-x-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:self-start md:pt-0'
          } ${
            sidebarOpen ? 'md:w-64' : 'md:w-20'
          }`}
        >
          <div className="p-3 flex flex-col justify-between h-full overflow-y-auto">
            <nav className="space-y-4">
              {navSections.map((section, sIdx) => (
                <div key={sIdx}>
                  {sidebarOpen && (
                    <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#8A8A8A]">
                      {section.title}
                    </div>
                  )}
                  <div className="space-y-0.5 mt-1">
                    {section.items.map((item) => {
                      const Icon = item.icon
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileDrawerOpen(false)}
                          title={!sidebarOpen ? item.label : undefined}
                          className={({ isActive }) =>
                            `flex items-center ${sidebarOpen ? 'justify-between px-3 py-2' : 'justify-center p-2.5'} rounded-xl text-xs font-semibold transition-all ${
                              isActive
                                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                : 'text-[#666666] hover:bg-[#FAFBF8] hover:text-[#2F2F2F]'
                            }`
                          }
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon size={17} className="flex-shrink-0" />
                            {sidebarOpen && <span className="truncate">{item.label}</span>}
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
                </div>
              ))}
            </nav>

            {sidebarOpen && (
              <div className="mt-4 pt-3 border-t border-[#E5E7EB] px-2 text-[11px] text-[#8A8A8A]">
                AgriSync Unified Platform • SIH 2026
              </div>
            )}
          </div>
        </aside>

        {/* Mobile backdrop */}
        {mobileDrawerOpen && (
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-xs z-20 md:hidden"
          ></div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full min-w-0">
          {children ? children : <Outlet />}
        </main>
      </div>
    </div>
  )
}
