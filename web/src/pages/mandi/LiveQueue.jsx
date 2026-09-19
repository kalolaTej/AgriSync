import React, { useState } from 'react';

export const LiveQueue = () => {
  const [tokens] = useState([
    { token: '#B-14', driver: 'Dattatray Shinde (MH-15-EG-4412)', crop: 'Red Onion (24.0 MT)', status: 'Proceeding to Weighbridge', gate: 'Gate #2', wait: 'In Yard' },
    { token: '#B-15', driver: 'Sanjay More (MH-15-BJ-9182)', crop: 'Soybean (12.5 MT)', status: 'Waiting in ANPR Barrier', gate: 'Gate #1', wait: '~12 mins' },
    { token: '#B-16', driver: 'Kishan Logistics (MH-15-CL-3390)', crop: 'Tomato (8.0 MT)', status: 'Slot Booked', gate: 'Gate #2', wait: '~35 mins' }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#047857] uppercase tracking-wider">APMC Yard Operations Terminal</span>
          <h1 className="text-2xl font-black text-[#0f172a]">Live Mandi Procurement Queue</h1>
        </div>
        <div className="px-4 py-2 bg-[#0f172a] text-white rounded-xl text-xs font-bold shadow-xs">
          Pimpalgaon APMC Yard • Active Tokens: 14
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Currently Processing</div>
          <div className="text-2xl font-black text-[#047857] mt-1 font-data-tabular">Token #B-14</div>
          <div className="text-xs text-slate-700 font-bold mt-1">Weighbridge Scale #1</div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Next In Line</div>
          <div className="text-2xl font-black text-[#0f172a] mt-1 font-data-tabular">Token #B-15</div>
          <div className="text-xs text-slate-700 font-bold mt-1">ANPR Gate #1</div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Avg Processing Speed</div>
          <div className="text-2xl font-black text-[#0f172a] mt-1 font-data-tabular">4.5 Min / Truck</div>
          <div className="text-xs text-[#15803d] font-bold mt-1">Zero Bottleneck</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0f172a] text-[#dcfce7] text-[11px] font-extrabold uppercase tracking-wider">
                <th className="p-4">Queue Token</th>
                <th className="p-4">Driver & Vehicle Plate</th>
                <th className="p-4">Harvest Produce</th>
                <th className="p-4">Mandi Gate</th>
                <th className="p-4">Current Yard Status</th>
                <th className="p-4 text-right">Est. Wait</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-[#0f172a]">
              {tokens.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 font-medium">
                  <td className="p-4 font-black text-[#047857] font-data-tabular text-sm">{row.token}</td>
                  <td className="p-4 font-bold">{row.driver}</td>
                  <td className="p-4">{row.crop}</td>
                  <td className="p-4">{row.gate}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] text-[10px] font-bold border border-[#bbf7d0]">
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold text-[#0f172a] font-data-tabular">{row.wait}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LiveQueue;
