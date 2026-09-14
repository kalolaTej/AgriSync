import React from 'react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Greeting & Top Bar Actions */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">Good morning, Rajesh Patil</h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">Verified Farmer</span>
          </div>
          <p className="text-xs text-secondary flex items-center gap-1.5 mt-1">
            <span className="material-symbols-outlined text-sm text-primary">wb_sunny</span>
            <span>Green Acres Farm, Niphad Taluka • Weather: Clear 28°C, optimal for mandi dispatch</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/mandi/queue" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-on-surface rounded-lg text-xs font-medium border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-base text-secondary">calendar_month</span>
            <span>Book Mandi Slot</span>
          </Link>
          <Link to="/produce" className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-xs font-medium shadow-sm hover:bg-primary-hover transition-colors">
            <span className="material-symbols-outlined text-base">add_box</span>
            <span>+ Add Produce</span>
          </Link>
        </div>
      </section>

      {/* Priority Action Callout (Green line removed) */}
      <div className="bg-surface-container-high/70 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden border border-slate-200">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-primary shrink-0 shadow-sm border border-slate-100">
            <span className="material-symbols-outlined text-xl">local_shipping</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-on-surface">Gate Pass Confirmation Required</span>
              <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-semibold">Priority</span>
            </div>
            <p className="text-xs text-secondary mt-0.5">
              Token <strong className="text-on-surface">#B-14</strong> entry scheduled for tomorrow at <strong className="text-on-surface">08:30 AM</strong> at Gate #2 (Pimpalgaon APMC). Driver <strong className="text-on-surface">Dattatray Shinde</strong> assigned (MH-15-EG-4412).
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="px-3 py-1.5 bg-white text-on-surface text-xs font-medium rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors">
            Reschedule
          </button>
          <Link to="/driver/gate-pass" className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg shadow-sm hover:bg-primary-hover transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">check_circle</span>
            <span>Confirm & Dispatch</span>
          </Link>
        </div>
      </div>

      {/* Core Status Summary Tiles */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Lots Card */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">Active Produce Lots</span>
              <span className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-lg">inventory_2</span>
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-on-surface">3 Batches</span>
              <span className="text-xs text-secondary">(42.5 MT Total)</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-secondary">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span>2 Ready for Sale</span>
              <span>•</span>
              <span>1 In Quality Testing</span>
            </div>
          </div>
          <Link to="/produce" className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline pt-1">
            <span>View My Produce</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {/* Procurement Slot Card */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">Procurement Slot</span>
              <span className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center text-sky-700">
                <span className="material-symbols-outlined text-lg">schedule</span>
              </span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-on-surface">Tomorrow, 08:30 AM</span>
            </div>
            <div className="mt-1 text-xs text-on-surface font-medium">
              Token #B-14 • Pimpalgaon APMC Yard
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-secondary bg-slate-100 px-2 py-1 rounded w-fit">
              <span className="material-symbols-outlined text-xs text-sky-700">group</span>
              <span>12 vehicles ahead • Est. wait ~40 min</span>
            </div>
          </div>
          <Link to="/mandi/queue" className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline pt-1">
            <span>View Mandi Queue</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {/* Market Price Snapshot Card */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">Market Price Snapshot</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">Good time to sell</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-on-surface font-data-tabular">₹2,420</span>
              <span className="text-xs text-secondary">/ Qtl</span>
            </div>
            <div className="mt-1 text-xs text-on-surface font-medium">
              Red Onion Garwa (Pimpalgaon Bench)
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              <span>+₹140 vs yesterday (+6.2% 7-day)</span>
            </div>
          </div>
          <Link to="/market" className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline pt-1">
            <span>View All Mandi Prices</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* Main Two-Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Produce & Advisory */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Produce Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm text-on-surface">My Active Produce</h2>
                <p className="text-xs text-secondary">Harvested inventory ready for dispatch, testing, or trade</p>
              </div>
              <Link to="/produce" className="text-xs text-primary font-semibold hover:underline">
                View All Lots →
              </Link>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-xl">eco</span>
                  </div>
                  <div>
                    <div className="font-semibold text-on-surface">Red Onion (Nashik Red)</div>
                    <div className="text-secondary">Lot #LOT-2024-098 • 24.0 MT • Grade A (Moisture 11.2%)</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">Ready</span>
                  <Link to="/sell/buyers" className="px-2.5 py-1 bg-primary text-white rounded text-[11px] font-semibold hover:bg-primary-hover">
                    Book Slot
                  </Link>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-xl">grain</span>
                  </div>
                  <div>
                    <div className="font-semibold text-on-surface">Soybean (JS-335)</div>
                    <div className="text-secondary">Lot #LOT-2024-099 • 12.5 MT • Grade B+ (FAQ)</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">In Storage</span>
                  <Link to="/produce" className="px-2.5 py-1 bg-slate-100 text-on-surface rounded text-[11px] font-semibold hover:bg-slate-200">
                    View Lot
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Market Advisory Widget */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm text-on-surface">Selling Window Advisory</h2>
                <p className="text-xs text-secondary">Optimal Timing Recommendation: Red Onion (Garwa)</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">Optimal: Next 2-3 Days</span>
            </div>
            <div className="p-4 bg-emerald-50/60 rounded-lg border border-emerald-100 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <span className="material-symbols-outlined text-lg">lightbulb</span>
                <span>Wholesale demand in Bengaluru & Hyderabad surged by 18%</span>
              </div>
              <p className="text-secondary leading-relaxed">
                Selling your 24.0 MT Red Onion lot in the next 48-72 hours locks in today's ₹2,420/Qtl modal rate before weekend arrival volumes increase.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/sell/advisory" className="px-3.5 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover transition-colors">
                View Full Selling Advisory
              </Link>
              <Link to="/sell/buyers" className="px-3.5 py-1.5 bg-slate-100 text-on-surface text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                View Direct Buyer Offers (3)
              </Link>
            </div>
          </div>

        </div>

        {/* Right Column: Queue & Protection */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Mandi Queue Status */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-base">warehouse</span>
                Mandi Yard Queue
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-semibold">Live</span>
            </div>
            <div className="space-y-2 bg-slate-50 p-3 rounded-lg">
              <div className="flex justify-between"><span className="text-secondary">Pimpalgaon APMC:</span> <span className="font-semibold font-data-tabular">Token #B-14</span></div>
              <div className="flex justify-between"><span className="text-secondary">Vehicles Ahead:</span> <span className="font-semibold">12 Vehicles</span></div>
              <div className="flex justify-between"><span className="text-secondary">Est. Wait Time:</span> <span className="font-semibold text-primary font-data-tabular">~42 Minutes</span></div>
            </div>
            <Link to="/mandi/queue" className="block text-center w-full py-2 bg-slate-100 text-on-surface rounded font-semibold hover:bg-slate-200 transition-colors">
              Open Live Queue Terminal
            </Link>
          </div>

          {/* Protection Incident Summary */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-base">shield</span>
                Field Protection Status
              </span>
              <span className="text-emerald-700 font-semibold">4 Sensors Active</span>
            </div>
            <div className="p-3 bg-emerald-50/50 rounded-lg text-secondary space-y-1">
              <div className="font-semibold text-on-surface">Recent Intrusion Deterred</div>
              <p>Wild boar movement detected South Perimeter Node #2 at 03:14 AM. Acoustic alarm triggered automatically.</p>
              <div className="text-[10px] text-emerald-700 font-semibold pt-1">✓ Zero crop damage recorded</div>
            </div>
            <Link to="/protect/incidents" className="block text-center w-full py-2 bg-slate-100 text-on-surface rounded font-semibold hover:bg-slate-200 transition-colors">
              View Incident Log & Alerts
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
