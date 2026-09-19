import React, { useState } from 'react';

export const CropIncidents = () => {
  const [incidents, setIncidents] = useState([
    { id: 'INC-2024-001', crop: 'Red Onion (Plot #2)', damage: '0% (Deterred)', cause: 'Wild Boar Perimeter Breach', date: '18 Sep 2026', time: '03:14 AM', claimStatus: 'Not Required' },
    { id: 'INC-2024-002', crop: 'Pomegranate (Plot #4)', damage: '3.5% Loss', cause: 'Stray Cattle Intrusion', date: '10 Sep 2026', time: '11:45 PM', claimStatus: 'PMFBY Filed' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newIncident, setNewIncident] = useState({
    crop: 'Red Onion (North Field Plot #1)',
    cause: 'Wild Boar Intrusion',
    damage: '2.0% Crop Loss',
    date: new Date().toISOString().split('T')[0],
    time: '02:30 AM',
    fileClaim: true
  });
  const [errors, setErrors] = useState({});

  const handleCreate = (e) => {
    e.preventDefault();
    const errs = {};
    if (!newIncident.cause.trim()) errs.cause = 'Cause of intrusion is required.';
    if (!newIncident.damage.trim()) errs.damage = 'Damage estimate is required.';
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const created = {
      id: `INC-2024-00${incidents.length + 1}`,
      crop: newIncident.crop,
      cause: newIncident.cause,
      damage: newIncident.damage,
      date: newIncident.date,
      time: newIncident.time,
      claimStatus: newIncident.fileClaim ? 'PMFBY Claim Filed (Demo)' : 'Logged (Field Audit Only)'
    };

    setIncidents([created, ...incidents]);
    setShowModal(false);
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0f172a]">Crop Protection Field Incidents & Claims</h1>
          <p className="text-xs text-slate-600 mt-1">Pre-harvest intrusion loss evidence logging and PMFBY crop insurance claims verification.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-[#047857] text-white rounded-xl text-xs font-extrabold shadow-md hover:bg-[#065f46] transition-colors flex items-center gap-1.5 w-fit"
        >
          <span className="material-symbols-outlined text-base">add_alert</span>
          <span>+ Log Field Incident</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0f172a] text-[#dcfce7] text-[11px] font-extrabold uppercase tracking-wider">
                <th className="p-4">Incident ID</th>
                <th className="p-4">Crop & Field Plot</th>
                <th className="p-4">Intrusion Cause</th>
                <th className="p-4">Damage Estimate</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">PMFBY Insurance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-[#0f172a]">
              {incidents.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 font-medium">
                  <td className="p-4 font-bold font-data-tabular">{row.id}</td>
                  <td className="p-4 font-extrabold">{row.crop}</td>
                  <td className="p-4">{row.cause}</td>
                  <td className="p-4 font-extrabold text-[#047857]">{row.damage}</td>
                  <td className="p-4">{row.date} at {row.time}</td>
                  <td className="p-4 font-bold">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] text-[10px] border border-[#bbf7d0]">
                      {row.claimStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Incident Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#047857] text-2xl">shield</span>
                <h2 className="text-lg font-black text-[#0f172a]">Log Field Intrusion Incident</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 text-xl font-bold">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Field Plot & Crop Variety *</label>
                <select 
                  value={newIncident.crop}
                  onChange={(e) => setNewIncident({...newIncident, crop: e.target.value})}
                  className="w-full px-3.5 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-bold text-[#0f172a] outline-none"
                >
                  <option value="Red Onion (North Field Plot #1)">Red Onion (North Field Plot #1)</option>
                  <option value="Soybean (East Plot #2)">Soybean (East Plot #2)</option>
                  <option value="Pomegranate (South Orchard #4)">Pomegranate (South Orchard #4)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Intrusion Cause / Species *</label>
                <input 
                  type="text"
                  placeholder="e.g. Wild Boar / Stray Cattle"
                  value={newIncident.cause}
                  onChange={(e) => setNewIncident({...newIncident, cause: e.target.value})}
                  className="w-full px-3.5 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-bold text-[#0f172a] outline-none focus:border-[#047857]"
                />
                {errors.cause && <span className="text-red-600 text-[10px] font-bold mt-0.5 block">{errors.cause}</span>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Damage Estimate *</label>
                  <input 
                    type="text"
                    placeholder="e.g. 2.0% Crop Loss or Deterred"
                    value={newIncident.damage}
                    onChange={(e) => setNewIncident({...newIncident, damage: e.target.value})}
                    className="w-full px-3.5 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-bold text-[#0f172a] outline-none focus:border-[#047857]"
                  />
                  {errors.damage && <span className="text-red-600 text-[10px] font-bold mt-0.5 block">{errors.damage}</span>}
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Intrusion Time</label>
                  <input 
                    type="text"
                    value={newIncident.time}
                    onChange={(e) => setNewIncident({...newIncident, time: e.target.value})}
                    className="w-full px-3.5 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-bold text-[#0f172a] outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#f0fdf4] rounded-xl border border-[#dcfce7]">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-[#166534]">
                  <input 
                    type="checkbox" 
                    checked={newIncident.fileClaim} 
                    onChange={(e) => setNewIncident({...newIncident, fileClaim: e.target.checked})}
                    className="accent-[#047857]"
                  />
                  <span>File PMFBY Crop Insurance Evidence Claim</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#047857] text-white font-extrabold rounded-xl hover:bg-[#065f46] shadow-md"
                >
                  + Log Incident Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropIncidents;
