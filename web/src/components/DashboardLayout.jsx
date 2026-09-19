import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

export const DashboardLayout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Role-aware navigation definitions
  const navByRole = {
    farmer: [
      {
        group: 'Overview',
        items: [
          { label: 'Dashboard', path: '/dashboard', icon: 'grid_view' },
        ]
      },
      {
        group: 'Risk & Field (Animal Intrusion)',
        items: [
          { label: 'Intrusion Summary', path: '/protect/analytics', icon: 'analytics' },
          { label: 'Animal Management', path: '/protect/animals', icon: 'pets' },
          { label: 'Perimeter Cameras', path: '/cameras', icon: 'videocam' },
          { label: 'Detection History', path: '/detections', icon: 'history' },
          { label: 'Intrusion Alerts', path: '/alerts', icon: 'warning' },
          { label: 'Crop Incidents', path: '/protect/incidents', icon: 'shield_with_heart' },
        ]
      },
      {
        group: 'Commerce & Mandi',
        items: [
          { label: 'My Produce', path: '/produce', icon: 'inventory_2' },
          { label: 'Selling Advisory', path: '/sell/advisory', icon: 'lightbulb' },
          { label: 'Verified Buyers', path: '/sell/buyers', icon: 'storefront' },
          { label: 'Market Prices', path: '/market', icon: 'trending_up' },
        ]
      },
      {
        group: 'Fulfillment & Finance',
        items: [
          { label: 'Storage & Warehouses', path: '/storage', icon: 'warehouse' },
          { label: 'Rural Transport', path: '/transport', icon: 'local_shipping' },
          { label: 'Transactions', path: '/transactions', icon: 'receipt_long' },
        ]
      }
    ],
    apmc: [
      {
        group: 'Mandi Operations',
        items: [
          { label: 'Live Queue Status', path: '/mandi/queue', icon: 'format_list_numbered' },
          { label: 'Gate Security ANPR', path: '/mandi/gate', icon: 'videocam' },
          { label: 'Weighbridge Console', path: '/mandi/weighbridge', icon: 'scale' },
          { label: 'Quality Assayer (NIR)', path: '/mandi/quality', icon: 'science' },
        ]
      }
    ],
    buyer: [
      {
        group: 'Procurement',
        items: [
          { label: 'Procurement Bids & POs', path: '/buyer/bids', icon: 'shopping_bag' },
          { label: 'Market Prices', path: '/market', icon: 'trending_up' },
          { label: 'Storage Facilities', path: '/storage', icon: 'warehouse' },
        ]
      }
    ],
    driver: [
      {
        group: 'Drayage',
        items: [
          { label: 'Fast-Track Gate Pass', path: '/driver/gate-pass', icon: 'qr_code_2' },
          { label: 'Mandi Live Queue', path: '/mandi/queue', icon: 'format_list_numbered' },
        ]
      }
    ],
    public: [
      {
        group: 'Portal',
        items: [
          { label: 'Public Homepage', path: '/', icon: 'language' },
          { label: 'How It Works', path: '/how-it-works', icon: 'play_circle' },
          { label: 'Register / KYC', path: '/register', icon: 'how_to_reg' },
          { label: 'Market Prices', path: '/market', icon: 'trending_up' },
        ]
      }
    ]
  };

  const currentNavGroups = navByRole[user.role] || navByRole.farmer;

  return (
    <div className="min-h-screen bg-[#f4fbf7] flex">
      {/* Fixed Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#0f172a] text-white z-50 flex flex-col justify-between py-4 shadow-xl border-r border-[#1e293b]">
        <div>
          {/* Brand Logo & Title */}
          <div className="px-4 pb-4 flex items-center gap-3 border-b border-[#1e293b]">
            <img src="/agrisync-logo.png" alt="AgriSync Logo" className="w-10 h-10 rounded-xl object-contain shadow-xs bg-white p-0.5 border border-[#dcfce7]" />
            <div>
              <span className="text-base font-black text-white tracking-tight block">AgriSync</span>
              <span className="text-[10px] text-[#a7f3d0] font-bold uppercase tracking-wider block">{user.roleLabel || 'Unified APMC'}</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="px-3 pt-4 space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto">
            {currentNavGroups.map((group, gIdx) => (
              <div key={gIdx}>
                <div className="px-2 pb-1 text-[10px] font-bold uppercase text-[#a7f3d0] tracking-wider opacity-90">
                  {group.group}
                </div>
                <div className="space-y-1">
                  {group.items.map((item, iIdx) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={iIdx}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all ${
                          isActive
                            ? 'bg-[#047857] text-white font-bold shadow-md translate-x-0.5'
                            : 'text-slate-300 hover:bg-[#1e293b] hover:text-white'
                        }`}
                      >
                        <span className={`material-symbols-outlined text-lg ${isActive ? 'text-white' : 'text-[#a7f3d0]'}`}>{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="px-3 pt-3 border-t border-[#1e293b]">
          <nav className="space-y-1">
            <Link
              to="/settings"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                location.pathname === '/settings'
                  ? 'bg-[#047857] text-white font-bold'
                  : 'text-slate-300 hover:bg-[#1e293b] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg text-[#a7f3d0]">tune</span>
              <span>Settings</span>
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-[#1e293b] hover:text-white transition-all"
            >
              <span className="material-symbols-outlined text-lg text-[#a7f3d0]">logout</span>
              <span>Exit to Portal</span>
            </Link>
          </nav>

          <div className="mt-3 mx-1 p-2.5 bg-[#1e293b] rounded-lg border border-[#047857]/40">
            <div className="flex items-center gap-1.5 text-[#a7f3d0]">
              <span className="material-symbols-outlined text-sm">support</span>
              <span className="text-[11px] font-bold text-[#dcfce7]">APMC Support</span>
            </div>
            <span className="font-data-tabular text-xs font-bold text-white block mt-0.5">1800 233 4567</span>
          </div>
        </div>
      </aside>

      {/* Main Layout Body */}
      <div className="pl-64 flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="pt-16 min-h-screen p-6 bg-[#f4fbf7]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
