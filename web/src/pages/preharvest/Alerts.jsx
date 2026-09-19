import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Volume2, Filter, VolumeX } from 'lucide-react';
import { playSirenSound } from '../../lib/soundEffects';

const DEFAULT_ALERTS = [
  { id: 'alert_01', animal: 'Wild Boar / Pig', camera: 'North Field Cam #1', zone: 'North Field (Onion Plot)', severity: 'High', time: '2 mins ago', status: 'Active' },
  { id: 'alert_02', animal: 'Stray Cattle / Cow', camera: 'East Barn Cam #2', zone: 'East Boundary', severity: 'Medium', time: '14 mins ago', status: 'Active' },
  { id: 'alert_03', animal: 'Nilgai / Blue Bull', camera: 'South Gate Cam #4', zone: 'South Canal Track', severity: 'Low', time: '1 hour ago', status: 'Active' },
];

export default function Alerts() {
  const [alerts, setAlerts] = useState(DEFAULT_ALERTS);
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [sirenActiveToast, setSirenActiveToast] = useState(null);

  const handleResolve = (id) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'Resolved' } : a)));
  };

  const handleSirenClick = (animalName) => {
    playSirenSound(3.5);
    setSirenActiveToast(`🚨 High-Decibel Alert Siren Activated for ${animalName || 'Wild Animal'}! Dispatching acoustic deterrent...`);
    setTimeout(() => {
      setSirenActiveToast(null);
    }, 3500);
  };

  const filteredAlerts = alerts.filter(
    (a) => filterSeverity === 'All' || a.severity === filterSeverity
  );

  return (
    <div className="space-y-6">
      {sirenActiveToast && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-[#047857] text-white font-extrabold text-xs shadow-2xl flex items-center gap-3 border border-[#a7f3d0] animate-bounce">
          <Volume2 size={20} className="animate-spin text-[#dcfce7]" />
          <span>{sirenActiveToast}</span>
          <button onClick={() => setSirenActiveToast(null)} className="ml-2 hover:opacity-80">
            <VolumeX size={16} />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">Active Animal Intrusion Alerts</h1>
          <p className="text-xs text-slate-600 mt-1 font-medium">Real-time perimeter intrusion log dispatched from edge camera detection events.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 font-bold flex items-center gap-1">
            <Filter size={14} /> Filter Severity:
          </span>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-[#0f172a] outline-none"
          >
            <option value="All">All Severities</option>
            <option value="High">High Severity</option>
            <option value="Medium">Medium Severity</option>
            <option value="Low">Low Severity</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAlerts.map((alert, idx) => {
          const isHigh = alert.severity === 'High';
          const isMedium = alert.severity === 'Medium';
          const isResolved = alert.status === 'Resolved';

          return (
            <div key={alert.id || idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isHigh
                      ? 'bg-red-100 text-red-700'
                      : isMedium
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-[#dcfce7] text-[#15803d]'
                  }`}
                >
                  <AlertTriangle size={20} />
                </div>

                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-extrabold text-[#0f172a]">{alert.animal || 'Wild Animal'} Intrusion</h3>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        isHigh
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : isMedium
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]'
                      }`}
                    >
                      {alert.severity || 'Medium'} Severity
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {alert.camera} • Zone: {alert.zone} • {alert.time}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {isResolved ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#15803d] bg-[#dcfce7] border border-[#bbf7d0] px-3 py-1.5 rounded-xl">
                    <CheckCircle2 size={14} className="text-[#047857]" /> Resolved & Logged
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-[#0f172a] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Mark Resolved
                    </button>
                    <button
                      onClick={() => handleSirenClick(alert.animal)}
                      title="Click to trigger high-volume alarm siren"
                      className="px-4 py-2 bg-[#047857] hover:bg-[#065f46] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                    >
                      <Volume2 size={14} /> Trigger Siren
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
