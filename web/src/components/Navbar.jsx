import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sprout, ShieldCheck, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, switchRole, language, setLanguage, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-40 h-16 shadow-2xs">
      <div className="px-4 sm:px-6 h-full flex items-center justify-between gap-4">
        
        {/* Brand */}
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Sprout size={18} />
          </div>
          <span className="font-extrabold text-[#2F2F2F] text-base tracking-tight">
            AgriSync
          </span>
        </Link>

        {/* Role Switcher & Controls */}
        <div className="flex items-center gap-3">
          {switchRole && (
            <div className="hidden sm:flex items-center gap-1.5 bg-stone-100 px-2.5 py-1 rounded-md text-xs border border-stone-200">
              <span className="text-stone-500 font-medium">Role:</span>
              <select
                value={user?.role || 'farmer'}
                onChange={(e) => switchRole(e.target.value)}
                className="bg-transparent text-emerald-700 font-semibold outline-none cursor-pointer text-xs"
              >
                <option value="farmer">Farmer (FPO)</option>
                <option value="procurement_operator">Procurement Operator</option>
                <option value="buyer">Institutional Buyer</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          )}

          {setLanguage && (
            <div className="hidden md:flex items-center bg-stone-100 rounded p-0.5 text-xs border border-stone-200">
              {['EN', 'MR', 'HI'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    language === lang ? 'bg-emerald-600 text-white font-semibold' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}

          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-xs font-semibold text-stone-800 hidden sm:inline">
                {user.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
