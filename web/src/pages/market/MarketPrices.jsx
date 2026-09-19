import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const MarketPrices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const prices = [
    { commodity: 'Red Onion (Garwa)', mandi: 'Pimpalgaon APMC', min: '₹1,800', max: '₹2,650', modal: '₹2,420', trend: '+5.2%', arrival: '14,200 Qtl' },
    { commodity: 'Red Onion (Kharif)', mandi: 'Lasalgaon APMC', min: '₹1,750', max: '₹2,580', modal: '₹2,380', trend: '+3.8%', arrival: '18,500 Qtl' },
    { commodity: 'Tomato (Hybrid)', mandi: 'Pimpalgaon APMC', min: '₹1,200', max: '₹2,100', modal: '₹1,850', trend: '+2.4%', arrival: '8,400 Qtl' },
    { commodity: 'Soybean (JS-335)', mandi: 'Latur APMC', min: '₹4,100', max: '₹4,750', modal: '₹4,520', trend: '+1.1%', arrival: '22,000 Qtl' },
    { commodity: 'Pomegranate (Bhagwa)', mandi: 'Solapur APMC', min: '₹5,500', max: '₹8,400', modal: '₹7,200', trend: 'Stable', arrival: '3,200 Qtl' },
    { commodity: 'Grapes (Thomson)', mandi: 'Nashik APMC', min: '₹4,200', max: '₹6,100', modal: '₹5,400', trend: '+4.0%', arrival: '5,600 Qtl' }
  ];

  const filtered = prices.filter(p => p.commodity.toLowerCase().includes(searchTerm.toLowerCase()) || p.mandi.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0f172a]">Agmarknet Live Mandi Market Prices</h1>
          <p className="text-xs text-slate-600 mt-1">Real-time daily modal rates and arrivals synced from Govt Agmarknet API.</p>
        </div>
        <div className="w-full sm:w-64">
          <input 
            type="text" 
            placeholder="Search crop or APMC mandi..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-[#0f172a] outline-none shadow-2xs focus:border-[#047857]"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0f172a] text-[#dcfce7] text-[11px] font-extrabold uppercase tracking-wider">
                <th className="p-4">Commodity / Variety</th>
                <th className="p-4">APMC Mandi Yard</th>
                <th className="p-4">Min Price</th>
                <th className="p-4">Max Price</th>
                <th className="p-4">Modal Price</th>
                <th className="p-4">24h Trend</th>
                <th className="p-4">Daily Arrivals</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-[#0f172a]">
              {filtered.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors font-medium">
                  <td className="p-4 font-black text-[#0f172a]">{row.commodity}</td>
                  <td className="p-4 text-slate-600">{row.mandi}</td>
                  <td className="p-4 font-data-tabular">{row.min}</td>
                  <td className="p-4 font-data-tabular">{row.max}</td>
                  <td className="p-4 font-black text-[#047857] font-data-tabular">{row.modal} / Qtl</td>
                  <td className="p-4 font-extrabold text-[#15803d]">{row.trend}</td>
                  <td className="p-4 font-data-tabular">{row.arrival}</td>
                  <td className="p-4 text-right">
                    <Link to="/market/pimpalgaon" className="px-3 py-1 bg-slate-100 text-[#0f172a] border border-slate-200 rounded-lg text-[11px] font-bold hover:bg-slate-200">
                      View Trends
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarketPrices;
