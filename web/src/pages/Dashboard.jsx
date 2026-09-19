import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [slotInfo, setSlotInfo] = useState({
    token: '#B-14',
    time: 'Tomorrow, 08:30 AM',
    mandi: 'Pimpalgaon APMC Yard #2',
    driver: 'Dattatray Shinde (MH-15-EG-4412)',
    ahead: '12 vehicles ahead • Est. wait ~40 min'
  });

  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  // Slot Form State
  const [slotForm, setSlotForm] = useState({
    mandi: 'Pimpalgaon APMC Yard #2',
    lot: 'LOT-2024-098 (Red Onion 24.0 MT)',
    date: '2026-09-20',
    timeWindow: '08:30 AM - 09:15 AM',
    driver: 'Dattatray Shinde (MH-15-EG-4412)'
  });

  // Reschedule Form State
  const [newTime, setNewTime] = useState('Tomorrow, 11:00 AM');

  const handleBookSlotSubmit = (e) => {
    e.preventDefault();
    const newTokenNum = Math.floor(15 + Math.random() * 10);
    setSlotInfo({
      token: `#B-${newTokenNum}`,
      time: `${slotForm.date === '2026-09-20' ? 'Tomorrow' : slotForm.date}, ${slotForm.timeWindow.split(' - ')[0]}`,
      mandi: slotForm.mandi,
      driver: slotForm.driver,
      ahead: '4 vehicles ahead • Est. wait ~15 min'
    });
    setShowSlotModal(false);
    navigate('/mandi/queue');
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    setSlotInfo({
      ...slotInfo,
      time: newTime
    });
    setShowRescheduleModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Greeting & Top Bar Actions */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">Good morning, {user.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] text-xs font-bold border border-[#bbf7d0]">{user.roleLabel || 'Verified User'}</span>
          </div>
          <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1 font-medium">
            <span className="material-symbols-outlined text-sm text-[#047857]">wb_sunny</span>
            <span>Green Acres Farm, Niphad Taluka • Weather: Clear 28°C, optimal for mandi dispatch</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowSlotModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-[#0f172a] rounded-xl text-xs font-bold border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <span className="material-symbols-outlined text-base text-[#047857]">calendar_month</span>
            <span>Book Mandi Slot</span>
          </button>
          <Link to="/produce" className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#047857] text-white rounded-xl text-xs font-extrabold shadow-md hover:bg-[#065f46] transition-colors">
            <span className="material-symbols-outlined text-base">add_box</span>
            <span>+ Add Produce</span>
          </Link>
        </div>
      </section>

      {/* Priority Action Callout Banner */}
      <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#047857] flex items-center justify-center text-white shrink-0 shadow-md">
            <span className="material-symbols-outlined text-2xl">local_shipping</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white">Gate Pass Scheduled</span>
              <span className="bg-[#dcfce7] text-[#15803d] text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider">Confirmed</span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Token <strong className="text-white font-bold">{slotInfo.token}</strong> entry scheduled for <strong className="text-white font-bold">{slotInfo.time}</strong> at {slotInfo.mandi}. Driver <strong className="text-white font-bold">{slotInfo.driver}</strong>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => setShowRescheduleModal(true)}
            className="px-3.5 py-2 bg-white/10 text-slate-200 hover:bg-white/20 text-xs font-bold rounded-xl border border-white/20 transition-colors"
          >
            Reschedule
          </button>
          <Link to="/driver/gate-pass" className="px-4 py-2 bg-[#047857] text-white text-xs font-extrabold rounded-xl shadow-md hover:bg-[#065f46] transition-colors flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">qr_code_2</span>
            <span>View Gate Pass QR</span>
          </Link>
        </div>
      </div>

      {/* Core Status Summary Tiles */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Lots Card */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Active Produce Lots</span>
              <span className="w-8 h-8 rounded-xl bg-[#dcfce7] flex items-center justify-center text-[#047857]">
                <span className="material-symbols-outlined text-xl">inventory_2</span>
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#0f172a]">3 Batches</span>
              <span className="text-xs text-slate-500 font-bold">(42.5 MT Total)</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#047857]"></span>
              <span>2 Ready for Sale</span>
              <span>•</span>
              <span>1 In Quality Testing</span>
            </div>
          </div>
          <Link to="/produce" className="text-xs text-[#047857] font-extrabold flex items-center gap-1 hover:underline pt-1">
            <span>View My Produce</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {/* Procurement Slot Card */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Procurement Slot</span>
              <span className="w-8 h-8 rounded-xl bg-[#dcfce7] flex items-center justify-center text-[#047857]">
                <span className="material-symbols-outlined text-xl">schedule</span>
              </span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-[#0f172a]">{slotInfo.time}</span>
            </div>
            <div className="mt-1 text-xs text-slate-800 font-bold">
              Token {slotInfo.token} • {slotInfo.mandi}
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-[#166534] bg-[#dcfce7] border border-[#bbf7d0] px-2.5 py-1 rounded-lg w-fit font-bold">
              <span className="material-symbols-outlined text-xs text-[#047857]">group</span>
              <span>{slotInfo.ahead}</span>
            </div>
          </div>
          <Link to="/mandi/queue" className="text-xs text-[#047857] font-extrabold flex items-center gap-1 hover:underline pt-1">
            <span>View Mandi Queue</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {/* Market Price Snapshot Card */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Market Price Snapshot</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] text-[10px] font-extrabold border border-[#bbf7d0]">Good time to sell</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-black text-[#0f172a] font-data-tabular">₹2,420</span>
              <span className="text-xs text-slate-500 font-bold">/ Qtl</span>
            </div>
            <div className="mt-1 text-xs text-slate-800 font-bold">
              Red Onion Garwa (Pimpalgaon Bench)
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-[#15803d] font-extrabold">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              <span>+₹140 vs yesterday (+6.2% 7-day)</span>
            </div>
          </div>
          <Link to="/market" className="text-xs text-[#047857] font-extrabold flex items-center gap-1 hover:underline pt-1">
            <span>View All Mandi Prices</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* Booking Slot Modal Wizard */}
      {showSlotModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#047857] text-2xl">calendar_month</span>
                <h2 className="text-lg font-black text-[#0f172a]">Book APMC Mandi Procurement Slot</h2>
              </div>
              <button onClick={() => setShowSlotModal(false)} className="text-slate-400 hover:text-slate-700 text-xl font-bold">✕</button>
            </div>

            <form onSubmit={handleBookSlotSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">1. Select APMC Mandi Centre *</label>
                <select 
                  value={slotForm.mandi}
                  onChange={(e) => setSlotForm({...slotForm, mandi: e.target.value})}
                  className="w-full px-3.5 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-bold text-[#0f172a] outline-none"
                >
                  <option value="Pimpalgaon APMC Yard #2">Pimpalgaon APMC Yard #2 (Nashik)</option>
                  <option value="Lasalgaon APMC Yard #1">Lasalgaon APMC Yard #1 (Nashik)</option>
                  <option value="Yeola APMC Yard">Yeola APMC Yard (Nashik)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">2. Select Produce Batch to Sell *</label>
                <select 
                  value={slotForm.lot}
                  onChange={(e) => setSlotForm({...slotForm, lot: e.target.value})}
                  className="w-full px-3.5 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-bold text-[#0f172a] outline-none"
                >
                  <option value="LOT-2024-098 (Red Onion 24.0 MT)">LOT-2024-098 — Red Onion (Garwa 24.0 MT)</option>
                  <option value="LOT-2024-099 (Soybean 12.5 MT)">LOT-2024-099 — Soybean (JS-335 12.5 MT)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">3. Select Date *</label>
                  <input 
                    type="date"
                    value={slotForm.date}
                    onChange={(e) => setSlotForm({...slotForm, date: e.target.value})}
                    className="w-full px-3.5 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-bold text-[#0f172a] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">4. Arrival Window *</label>
                  <select 
                    value={slotForm.timeWindow}
                    onChange={(e) => setSlotForm({...slotForm, timeWindow: e.target.value})}
                    className="w-full px-3.5 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-bold text-[#0f172a] outline-none"
                  >
                    <option value="08:30 AM - 09:15 AM">08:30 AM - 09:15 AM</option>
                    <option value="10:00 AM - 10:45 AM">10:00 AM - 10:45 AM</option>
                    <option value="02:00 PM - 02:45 PM">02:00 PM - 02:45 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">5. Assigned Drayage Transport Vehicle</label>
                <select 
                  value={slotForm.driver}
                  onChange={(e) => setSlotForm({...slotForm, driver: e.target.value})}
                  className="w-full px-3.5 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-bold text-[#0f172a] outline-none"
                >
                  <option value="Dattatray Shinde (MH-15-EG-4412)">Dattatray Shinde (MH-15-EG-4412)</option>
                  <option value="Sanjay More (MH-15-BJ-9182)">Sanjay More (MH-15-BJ-9182)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowSlotModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#047857] text-white font-extrabold rounded-xl hover:bg-[#065f46] shadow-md"
                >
                  ✓ Confirm Slot & Generate Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Gate Pass Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-[#0f172a]">Reschedule Gate Pass Entry</h2>
              <button onClick={() => setShowRescheduleModal(false)} className="text-slate-400 hover:text-slate-700 text-xl font-bold">✕</button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select New Time Slot</label>
                <select 
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-bold text-[#0f172a] outline-none"
                >
                  <option value="Tomorrow, 11:00 AM">Tomorrow, 11:00 AM</option>
                  <option value="Tomorrow, 02:30 PM">Tomorrow, 02:30 PM</option>
                  <option value="Day After, 08:30 AM">Day After, 08:30 AM</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowRescheduleModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#047857] text-white font-extrabold rounded-xl hover:bg-[#065f46]"
                >
                  Confirm New Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
