import React from 'react';
import { Link } from 'react-router-dom';

export const SellingAdvisory = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#0f172a]">Smart Selling Window Advisory</h1>
        <p className="text-xs text-slate-600 mt-1">Data-driven recommendation derived from Agmarknet price trends and interstate wholesale demand.</p>
      </div>

      {/* Main Banner Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#047857]">Target Batch: #LOT-2024-098 (24.0 MT Red Onion)</span>
            <h2 className="text-xl font-black text-[#0f172a] mt-0.5">Optimal Selling Window: Next 48–72 Hours</h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#047857] text-white text-xs font-extrabold w-fit shadow-xs">
            +6.2% Price Upside Predicted
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-[#f8fafc] rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 font-semibold">Pimpalgaon APMC Today</div>
            <div className="text-2xl font-black text-[#0f172a] font-data-tabular mt-1">₹2,420 / Qtl</div>
            <div className="text-xs text-[#15803d] font-bold mt-1">High Mandi Modal Rate</div>
          </div>
          <div className="p-4 bg-[#f8fafc] rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 font-semibold">Predicted 72-Hour Peak</div>
            <div className="text-2xl font-black text-[#0f172a] font-data-tabular mt-1">₹2,540 / Qtl</div>
            <div className="text-xs text-[#15803d] font-bold mt-1">+₹120 Net Gain per Qtl</div>
          </div>
          <div className="p-4 bg-[#f8fafc] rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 font-semibold">Estimated Gross Revenue</div>
            <div className="text-2xl font-black text-[#0f172a] font-data-tabular mt-1">₹6,09,600</div>
            <div className="text-xs text-slate-600 font-bold mt-1">240 Quintals Total</div>
          </div>
        </div>

        <div className="p-4 bg-[#0f172a] text-white rounded-xl text-xs space-y-2">
          <div className="font-bold text-[#dcfce7] flex items-center gap-1.5 text-sm">
            <span className="material-symbols-outlined text-base text-[#a7f3d0]">insights</span> Market Intelligence Rationale:
          </div>
          <p className="text-slate-300 leading-relaxed">
            Interstate buyer procurement demand from South India (Bengaluru & Chennai) increased by 14% due to delayed onion arrivals from Southern districts. Selling before Saturday arrival surge ensures instant buyer competition.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link to="/sell/buyers" className="px-5 py-2.5 bg-[#047857] text-white rounded-xl text-xs font-extrabold hover:bg-[#065f46] shadow-md transition-colors">
            View Direct Verified Buyer Offers →
          </Link>
          <Link to="/mandi/queue" className="px-5 py-2.5 bg-slate-100 text-[#0f172a] border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors">
            Reserve Mandi Yard Slot
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellingAdvisory;
