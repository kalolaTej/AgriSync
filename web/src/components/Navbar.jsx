import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user, switchRole, language, setLanguage } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-6">
      {/* Role Switcher & Language Controls */}
      <div className="flex items-center gap-4">
        {/* Role Selector Pill */}
        <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded text-on-surface-variant text-xs border border-slate-200 shadow-sm">
          <span className="material-symbols-outlined text-base text-primary">swap_horiz</span>
          <span className="font-medium text-on-surface">Role:</span>
          <select 
            value={user.role} 
            onChange={(e) => switchRole(e.target.value)}
            className="bg-transparent text-primary font-semibold outline-none cursor-pointer"
          >
            <option value="farmer">Farmer Producer (FPO)</option>
            <option value="apmc">APMC Mandi Official</option>
            <option value="buyer">Institutional Buyer</option>
            <option value="driver">Logistics Driver</option>
            <option value="public">Public Portal Visitor</option>
          </select>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center bg-surface-container-low rounded p-0.5 text-on-surface-variant text-xs border border-slate-200">
          <button 
            onClick={() => setLanguage('EN')} 
            className={`px-2 py-0.5 font-medium rounded transition-colors ${language === 'EN' ? 'bg-primary text-white font-semibold' : 'hover:text-on-surface'}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLanguage('MR')} 
            className={`px-2 py-0.5 font-medium rounded transition-colors ${language === 'MR' ? 'bg-primary text-white font-semibold' : 'hover:text-on-surface'}`}
          >
            मराठी
          </button>
          <button 
            onClick={() => setLanguage('HI')} 
            className={`px-2 py-0.5 font-medium rounded transition-colors ${language === 'HI' ? 'bg-primary text-white font-semibold' : 'hover:text-on-surface'}`}
          >
            हिन्दी
          </button>
        </div>
      </div>

      {/* Action Button & User Profile */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/mandi/queue')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-white rounded font-medium text-xs hover:bg-primary-hover transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          <span>Gate-In Entry</span>
        </button>

        <div className="h-6 w-px bg-outline-variant"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="font-semibold text-xs text-on-surface leading-tight">{user.name}</div>
            <div className="text-[11px] text-secondary flex items-center justify-end gap-0.5">
              <span className="material-symbols-outlined text-xs text-primary">location_on</span>
              {user.apmc}
            </div>
          </div>
          {user.avatar ? (
            <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-sm" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
              {user.name.charAt(0)}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
