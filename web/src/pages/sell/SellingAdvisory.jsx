import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ShieldCheck, ArrowRight, CheckCircle2, Sliders, Calendar } from 'lucide-react';

export const SellingAdvisory = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#047857] uppercase tracking-wider">Commerce & Advisory</span>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
            RULE-BASED SALE-WINDOW RECOMMENDATION
          </span>
        </div>
        <h1 className="text-2xl font-black text-[#0f172a]">Smart Selling Window Advisory</h1>
        <p className="text-xs text-slate-600 mt-1">
          Algorithmic recommendation derived from Agmarknet modal price trends, storage depreciation curves, and wholesale demand heuristics.
        </p>
      </div>

      {/* Main Banner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#047857]">
              Target Batch: #LOT-2024-098 (24.0 MT Red Onion Garwa)
            </span>
            <h2 className="text-xl font-black text-[#0f172a] mt-0.5">
              Recommended Selling Window: Next 48–72 Hours
            </h2>
          </div>
          <span className="px-3.5 py-1.5 rounded-xl bg-[#047857] text-white text-xs font-black shadow-xs shrink-0">
            DECISION: SELL NOW (+6.2% Upside Window)
          </span>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#f8fafc] rounded-2xl border border-slate-100 space-y-1">
            <div className="text-xs text-slate-500 font-bold uppercase">Pimpalgaon APMC Today</div>
            <div className="text-2xl font-black text-[#0f172a] font-data-tabular">₹2,420 / Qtl</div>
            <div className="text-xs text-[#15803d] font-bold">Current Modal Mandi Rate</div>
          </div>

          <div className="p-4 bg-[#f8fafc] rounded-2xl border border-slate-100 space-y-1">
            <div className="text-xs text-slate-500 font-bold uppercase">Projected 72h Modal Target</div>
            <div className="text-2xl font-black text-[#0f172a] font-data-tabular">₹2,540 / Qtl</div>
            <div className="text-xs text-[#15803d] font-bold">+₹120 Net Margin / Qtl</div>
          </div>

          <div className="p-4 bg-[#f8fafc] rounded-2xl border border-slate-100 space-y-1">
            <div className="text-xs text-slate-500 font-bold uppercase">Estimated Gross Realization</div>
            <div className="text-2xl font-black text-[#0f172a] font-data-tabular">₹6,09,600</div>
            <div className="text-xs text-slate-500 font-bold">240 Quintals Total Payload</div>
          </div>
        </div>

        {/* Rule-Based Rationale Box */}
        <div className="p-5 bg-[#0f172a] text-white rounded-2xl text-xs space-y-2.5">
          <div className="font-black text-[#dcfce7] flex items-center gap-1.5 text-sm">
            <Sliders size={16} className="text-[#a7f3d0]" />
            <span>Rule-Based Decision Rationale (Heuristic Engine):</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Interstate buyer procurement demand from South India (Bengaluru & Chennai) increased by 14% due to delayed onion arrivals from Southern districts. Current modal price exceeds the 14-day moving average and cold storage holding costs would exceed incremental margin after 72 hours.
          </p>
          <div className="text-[11px] text-emerald-400 font-mono pt-1">
            Heuristic Status: Rule evaluated true [sell_now] • Confidence metric derived from 14-day Agmarknet time-series.
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/sell/buyers"
            className="px-5 py-2.5 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl text-xs font-black shadow-md transition-colors inline-flex items-center gap-1.5 cursor-pointer active:scale-98"
          >
            <span>View Weighted Rule-Matched Buyers</span>
            <ArrowRight size={14} />
          </Link>

          <Link
            to="/mandi/queue"
            className="px-5 py-2.5 bg-slate-100 text-[#0f172a] border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Mandi Live Queue Terminal</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellingAdvisory;
