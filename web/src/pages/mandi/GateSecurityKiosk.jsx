import React, { useState } from 'react';

export const GateSecurityKiosk = () => {
  const [plate, setPlate] = useState('MH-15-BJ-9182');
  const [barrierOpen, setBarrierOpen] = useState(false);

  const handleScan = () => {
    setBarrierOpen(true);
    setTimeout(() => setBarrierOpen(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <span className="text-xs font-bold text-[#047857] uppercase tracking-wider">APMC Gate Terminal Kiosk</span>
        <h1 className="text-2xl font-black text-[#0f172a]">ANPR Automatic Barrier Security Console</h1>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="h-52 bg-[#0f172a] rounded-xl flex items-center justify-center text-white relative overflow-hidden">
            <span className="material-symbols-outlined text-6xl text-[#a7f3d0]">videocam</span>
            <div className="absolute bottom-3 left-3 bg-[#047857] text-white text-[10px] px-2 py-0.5 rounded font-bold">ANPR CAMERA #1 LIVE</div>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#0f172a] mb-1">Detected Vehicle Plate</label>
            <input 
              type="text" 
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#f8fafc] border-2 border-[#047857] rounded-xl text-base font-black text-[#0f172a] uppercase text-center font-data-tabular outline-none"
            />
          </div>
          <button 
            onClick={handleScan}
            className="w-full py-3 bg-[#047857] text-white font-extrabold text-xs rounded-xl hover:bg-[#065f46] shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">qr_code_scanner</span> Scan & Open Barrier
          </button>
        </div>

        <div className="space-y-4 flex flex-col justify-between">
          <div className="p-4 bg-[#f0fdf4] rounded-xl border border-[#dcfce7] space-y-3">
            <h3 className="font-extrabold text-sm text-[#0f172a]">Verification Slip</h3>
            <div className="text-xs text-slate-700 space-y-1.5">
              <div className="flex justify-between"><span>Farmer Name:</span> <strong>Rajesh Patil (FPO)</strong></div>
              <div className="flex justify-between"><span>Queue Token:</span> <strong className="text-[#047857]">Token #B-15</strong></div>
              <div className="flex justify-between"><span>Produce Batch:</span> <strong>Red Onion (24.0 MT)</strong></div>
              <div className="flex justify-between"><span>Assigned Gate:</span> <strong>Gate #2 Entry</strong></div>
            </div>
          </div>

          <div className={`p-5 rounded-2xl text-center border font-black text-sm transition-all ${
            barrierOpen ? 'bg-[#047857] text-white border-[#047857]' : 'bg-[#0f172a] text-white border-[#0f172a]'
          }`}>
            {barrierOpen ? 'OPEN — AUTOMATIC BARRIER LIFTED' : 'BARRIER CLOSED — AWAITING SCAN'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GateSecurityKiosk;
