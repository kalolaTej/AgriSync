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
          { label: 'Animal Intrusion Alerts', path: '/alerts', icon: 'warning' },
          { label: 'Perimeter Cameras', path: '/cameras', icon: 'videocam' },
          { label: 'Detections Log', path: '/detections', icon: 'shield' },
          { label: 'Protect (Incidents)', path: '/protect/incidents', icon: 'shield_with_heart' },
          { label: 'Incident Analytics', path: '/protect/analytics', icon: 'analytics' },
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
    <div className="min-h-screen bg-surface flex">
      {/* Fixed Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low z-50 flex flex-col justify-between py-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-slate-200">
        <div>
          {/* Brand Logo & Header */}
          <div className="px-4 pb-4 flex items-center gap-3 border-b border-slate-200">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xl">agriculture</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-base text-primary leading-none">AgriSync</span>
              <span className="text-[11px] text-secondary mt-0.5">{user.roleLabel}</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="px-2 pt-3 space-y-3">
            {currentNavGroups.map((group, gIdx) => (
              <div key={gIdx}>
                <div className="px-3 pb-1 text-[10px] font-bold uppercase text-secondary tracking-wider">
                  {group.group}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item, iIdx) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={iIdx}
                        to={item.path}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs transition-all ${
                          isActive
                            ? 'bg-primary-container text-white font-semibold shadow-sm'
                            : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">{item.icon}</span>
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
        <div className="px-3 pt-3">
          <nav className="space-y-1">
            <Link
              to="/settings"
              className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs transition-all ${
                location.pathname === '/settings'
                  ? 'bg-primary-container text-white font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-lg">tune</span>
              <span>Settings</span>
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2.5 px-3 py-2 rounded text-xs text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              <span>Exit to Portal</span>
            </Link>
          </nav>

          <div className="mt-3 mx-1 p-2.5 bg-surface-container rounded border border-slate-200">
            <div className="flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined text-sm">support</span>
              <span className="text-[11px] font-semibold">APMC Toll Free</span>
            </div>
            <span className="font-data-tabular text-xs font-semibold text-on-surface block mt-0.5">1800 233 4567</span>
          </div>
        </div>
      </aside>

      {/* Main Layout Body */}
      <div className="pl-64 flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="pt-16 min-h-screen p-6 bg-surface">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
