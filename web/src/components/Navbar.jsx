import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user, logoutUser, language, setLanguage } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white/95 backdrop-blur-xl border-b border-[#e2e8f0] shadow-xs z-40 flex items-center justify-between px-6">
      {/* Role Pill Display & Language Controls */}
      <div className="flex items-center gap-4">
        {/* Active Role Pill (Read-Only) */}
        <div className="flex items-center gap-2 bg-[#dcfce7] px-3 py-1.5 rounded-lg text-xs border border-[#bbf7d0] shadow-2xs">
          <span className="material-symbols-outlined text-base text-[#166534]">badge</span>
          <span className="font-extrabold text-[#166534]">Active Role:</span>
          <span className="text-[#047857] font-bold">{user.roleLabel}</span>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center bg-[#f0fdf4] rounded-lg p-0.5 text-xs border border-[#dcfce7]">
          <button 
            onClick={() => setLanguage('EN')} 
            className={`px-2.5 py-1 font-bold rounded-md transition-colors ${language === 'EN' ? 'bg-[#047857] text-white shadow-xs' : 'text-[#166534] hover:bg-[#dcfce7]'}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLanguage('MR')} 
            className={`px-2.5 py-1 font-bold rounded-md transition-colors ${language === 'MR' ? 'bg-[#047857] text-white shadow-xs' : 'text-[#166534] hover:bg-[#dcfce7]'}`}
          >
            मराठी
          </button>
          <button 
            onClick={() => setLanguage('HI')} 
            className={`px-2.5 py-1 font-bold rounded-md transition-colors ${language === 'HI' ? 'bg-[#047857] text-white shadow-xs' : 'text-[#166534] hover:bg-[#dcfce7]'}`}
          >
            हिन्दी
          </button>
        </div>
      </div>

      {/* Action Controls & User Profile */}
      <div className="flex items-center gap-4">
        {/* Gate-In Entry Button: RESTRICTED STRICTLY TO DRIVER ROLE */}
        {user?.role === 'driver' && (
          <button 
            onClick={() => navigate('/mandi/queue')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#dcfce7] text-[#047857] hover:bg-[#bbf7d0] font-extrabold text-xs transition-colors border border-[#bbf7d0]"
          >
            <span className="material-symbols-outlined text-sm">local_shipping</span>
            <span>+ Gate-In Entry</span>
          </button>
        )}

        <div className="h-6 w-px bg-slate-200"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="font-extrabold text-xs text-[#0f172a] leading-tight">{user.name}</div>
            <div className="text-[11px] text-[#047857] font-semibold flex items-center justify-end gap-0.5">
              <span className="material-symbols-outlined text-xs text-[#166534]">location_on</span>
              {user.apmc}
            </div>
          </div>
          {user.avatar ? (
            <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 border-[#047857] shadow-xs" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold text-xs border border-[#a7f3d0]">
              {user.name.charAt(0)}
            </div>
          )}

          <button 
            onClick={handleLogout}
            title="Log out of account"
            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
