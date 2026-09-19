import React from 'react';
import { Link } from 'react-router-dom';

export const TransportOptions = () => {
  const drivers = [
    { name: 'Dattatray Shinde', vehicle: 'Mahindra Bolero Pickup (MH-15-EG-4412)', capacity: '3.5 MT', fare: '₹1,200 / Trip', rating: '★ 4.9', eta: '15 mins away' },
    { name: 'Sanjay More Transport', vehicle: 'Tata 1109 Eicher (MH-15-BJ-9182)', capacity: '10.0 MT', fare: '₹2,800 / Trip', rating: '★ 4.8', eta: '30 mins away' },
    { name: 'Kishan Logistics Fleet', vehicle: 'Ashok Leyland 6-Wheeler (MH-15-CL-3390)', capacity: '25.0 MT', fare: '₹5,500 / Trip', rating: '★ 5.0', eta: '1 hour away' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#0f172a]">Rural Transport & Drayage Options</h1>
        <p className="text-xs text-slate-600 mt-1">Book verified farm-to-mandi drayage pickup vehicles with ANPR gate pass integration.</p>
      </div>

      <div className="space-y-4">
        {drivers.map((d, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base text-[#0f172a]">{d.name}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] text-[10px] font-bold">{d.rating}</span>
              </div>
              <div className="text-xs text-slate-600 mt-0.5">{d.vehicle} • Capacity: <strong>{d.capacity}</strong> • {d.eta}</div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <div className="text-lg font-black text-[#0f172a] font-data-tabular">{d.fare}</div>
                <div className="text-[10px] text-[#047857] font-bold">Fast-Track Gate Pass Incl.</div>
              </div>
              <Link to="/driver/gate-pass" className="px-4 py-2 bg-[#047857] text-white rounded-xl text-xs font-extrabold hover:bg-[#065f46] transition-colors shadow-xs">
                Book Transport
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransportOptions;
