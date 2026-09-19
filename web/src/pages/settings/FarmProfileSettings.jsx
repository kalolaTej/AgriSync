import React, { useState } from 'react';

export const FarmProfileSettings = () => {
  const [farmName, setFarmName] = useState('Green Acres Farm (Niphad)');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-[#0f172a]">Farm Profile & Platform Settings</h1>
        <p className="text-xs text-slate-600 mt-1">Configure role permissions, notification preferences, and farm geolocation settings.</p>
      </div>

      {saved && (
        <div className="p-3 bg-[#dcfce7] border border-[#bbf7d0] text-[#15803d] rounded-xl text-xs font-bold">
          ✓ Profile and settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div>
          <label className="block text-xs font-bold text-[#0f172a] mb-1">Registered Farm Name</label>
          <input 
            type="text" 
            value={farmName}
            onChange={(e) => setFarmName(e.target.value)}
            className="w-full px-3.5 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-semibold text-[#0f172a] outline-none focus:border-[#047857]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#0f172a]">SMS & Push Notification Events</label>
          <label className="flex items-center gap-2 text-xs text-slate-700">
            <input type="checkbox" defaultChecked className="accent-[#047857]" /> SMS alerts for ANPR Mandi queue token updates
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-700">
            <input type="checkbox" defaultChecked className="accent-[#047857]" /> Real-time sound siren push for perimeter animal intrusions
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-700">
            <input type="checkbox" defaultChecked className="accent-[#047857]" /> Agmarknet daily price advisory notifications
          </label>
        </div>

        <div className="pt-2">
          <button type="submit" className="px-5 py-2.5 bg-[#047857] text-white rounded-xl text-xs font-bold hover:bg-[#065f46] shadow-xs transition-colors">
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};

export default FarmProfileSettings;
