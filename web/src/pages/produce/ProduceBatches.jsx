import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const ProduceBatches = () => {
  const [batches, setBatches] = useState([
    { id: 'LOT-2024-098', crop: 'Red Onion (Garwa)', qty: '24.0 MT', moisture: '11.2%', grade: 'A1', status: 'Ready for Sale', harvestDate: '12 Sep 2026', cert: 'NIR-88412' },
    { id: 'LOT-2024-099', crop: 'Soybean (JS-335)', qty: '12.5 MT', moisture: '9.8%', grade: 'FAQ', status: 'In Storage', harvestDate: '08 Sep 2026', cert: 'NIR-88401' },
    { id: 'LOT-2024-102', crop: 'Pomegranate (Bhagwa)', qty: '6.0 MT', moisture: '78.5%', grade: 'Export Grade', status: 'Testing', harvestDate: '18 Sep 2026', cert: 'Pending' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newBatch, setNewBatch] = useState({
    crop: 'Red Onion (Garwa)',
    qty: '',
    moisture: '11.0%',
    grade: 'A1',
    harvestDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const handleCreate = (e) => {
    e.preventDefault();
    const errs = {};
    if (!newBatch.qty || isNaN(newBatch.qty) || Number(newBatch.qty) <= 0) {
      errs.qty = 'Enter a valid positive quantity in MT (e.g. 15.5)';
    }
    if (!newBatch.harvestDate) {
      errs.harvestDate = 'Harvest date is required.';
    }
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const created = {
      id: `LOT-2024-${Math.floor(100 + Math.random() * 900)}`,
      crop: newBatch.crop,
      qty: `${Number(newBatch.qty).toFixed(1)} MT`,
      moisture: newBatch.moisture || '11.0%',
      grade: newBatch.grade || 'Grade A',
      status: 'Ready for Sale',
      harvestDate: newBatch.harvestDate,
      cert: `NIR-${Math.floor(80000 + Math.random() * 10000)}`
    };

    setBatches([created, ...batches]);
    setShowModal(false);
    setNewBatch({ crop: 'Red Onion (Garwa)', qty: '', moisture: '11.0%', grade: 'A1', harvestDate: new Date().toISOString().split('T')[0], notes: '' });
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0f172a]">My Harvest Batches & Produce Inventory</h1>
          <p className="text-xs text-slate-600 mt-1">Manage harvested crop lots, view NIR quality assay certificates, and book Mandi sales slots.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-[#047857] text-white rounded-xl text-xs font-extrabold shadow-md hover:bg-[#065f46] transition-colors flex items-center gap-1.5 w-fit"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          <span>+ Register New Batch</span>
        </button>
      </div>

      {/* Produce Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {batches.map((b, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <span className="text-[11px] font-bold text-[#0f172a] font-data-tabular">{b.id}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  b.status === 'Ready for Sale' ? 'bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]' : 'bg-slate-100 text-slate-700'
                }`}>
                  {b.status}
                </span>
              </div>
              <h3 className="text-lg font-black text-[#0f172a]">{b.crop}</h3>
              <div className="mt-3 space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between"><span className="text-slate-500 font-medium">Batch Weight:</span> <span className="font-bold text-[#0f172a]">{b.qty}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-medium">NIR Moisture:</span> <span className="font-bold text-[#0f172a]">{b.moisture}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-medium">Quality Grade:</span> <span className="font-extrabold text-[#047857]">{b.grade}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-medium">Harvest Date:</span> <span>{b.harvestDate}</span></div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">Cert: {b.cert}</span>
              <Link to="/sell/advisory" className="px-3 py-1.5 bg-[#047857] text-white rounded-lg text-xs font-bold hover:bg-[#065f46] transition-colors">
                Sell Advisory →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Register New Batch Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#047857] text-2xl">inventory_2</span>
                <h2 className="text-lg font-black text-[#0f172a]">Register Harvest Produce Batch</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 text-xl font-bold">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Commodity Crop *</label>
                <select 
                  value={newBatch.crop}
                  onChange={(e) => setNewBatch({...newBatch, crop: e.target.value})}
                  className="w-full px-3.5 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-bold text-[#0f172a] outline-none focus:border-[#047857]"
                >
                  <option value="Red Onion (Garwa)">Red Onion (Garwa)</option>
                  <option value="Soybean (JS-335)">Soybean (JS-335)</option>
                  <option value="Tomato (Hybrid)">Tomato (Hybrid)</option>
                  <option value="Pomegranate (Bhagwa)">Pomegranate (Bhagwa)</option>
                  <option value="Grapes (Thomson Seedless)">Grapes (Thomson Seedless)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Batch Harvest Quantity (Metric Tonnes / MT) *</label>
                <input 
                  type="number"
                  step="0.1"
                  placeholder="e.g. 18.5"
                  value={newBatch.qty}
                  onChange={(e) => setNewBatch({...newBatch, qty: e.target.value})}
                  className="w-full px-3.5 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-bold text-[#0f172a] outline-none focus:border-[#047857]"
                />
                {errors.qty && <span className="text-red-600 text-[10px] font-bold mt-0.5 block">{errors.qty}</span>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIR Moisture Level</label>
                  <input 
                    type="text"
                    value={newBatch.moisture}
                    onChange={(e) => setNewBatch({...newBatch, moisture: e.target.value})}
                    className="w-full px-3.5 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-semibold text-[#0f172a] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quality Grade</label>
                  <select 
                    value={newBatch.grade}
                    onChange={(e) => setNewBatch({...newBatch, grade: e.target.value})}
                    className="w-full px-3.5 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-bold text-[#0f172a] outline-none"
                  >
                    <option value="A1 (Export Grade)">A1 (Export Grade)</option>
                    <option value="FAQ (Fair Average Quality)">FAQ (Fair Average Quality)</option>
                    <option value="Grade B">Grade B</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Harvest Completion Date *</label>
                <input 
                  type="date"
                  value={newBatch.harvestDate}
                  onChange={(e) => setNewBatch({...newBatch, harvestDate: e.target.value})}
                  className="w-full px-3.5 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-bold text-[#0f172a] outline-none focus:border-[#047857]"
                />
                {errors.harvestDate && <span className="text-red-600 text-[10px] font-bold mt-0.5 block">{errors.harvestDate}</span>}
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
                  + Create Lot Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProduceBatches;
