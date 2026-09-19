import React from 'react';

export const IncidentAnalytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#0f172a]">Crop Protection Incident Analytics</h1>
        <p className="text-xs text-slate-600 mt-1">Aggregated heatmaps, night breach frequencies, and deterrent effectiveness metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Intrusions Logged</div>
          <div className="text-3xl font-black text-[#0f172a] mt-1 font-data-tabular">28 Events</div>
          <div className="text-xs text-[#047857] font-bold mt-1">Past 30 Days</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Successful Deterrences</div>
          <div className="text-3xl font-black text-[#0f172a] mt-1 font-data-tabular">27 / 28 (96.4%)</div>
          <div className="text-xs text-[#047857] font-bold mt-1">Acoustic Siren Triggered</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Prevented Crop Damage</div>
          <div className="text-3xl font-black text-[#0f172a] mt-1 font-data-tabular">₹1,45,000</div>
          <div className="text-xs text-[#047857] font-bold mt-1">Estimated PMFBY Savings</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-extrabold text-[#0f172a]">Intrusion Frequency by Animal Type</h3>
        <div className="space-y-3 text-xs">
          <div>
            <div className="flex justify-between mb-1 font-extrabold text-[#0f172a]"><span>Wild Boar (18 Intrusions)</span> <span>64%</span></div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div className="bg-[#047857] h-full rounded-full w-[64%]"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1 font-extrabold text-[#0f172a]"><span>Stray Cattle (7 Intrusions)</span> <span>25%</span></div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div className="bg-[#166534] h-full rounded-full w-[25%]"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1 font-extrabold text-[#0f172a]"><span>Nilgai / Blue Bull (3 Intrusions)</span> <span>11%</span></div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div className="bg-[#10b981] h-full rounded-full w-[11%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentAnalytics;
