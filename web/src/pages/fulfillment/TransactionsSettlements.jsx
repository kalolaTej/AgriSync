import React from 'react';
import { Link } from 'react-router-dom';

export const TransactionsSettlements = () => {
  const transactions = [
    { id: 'SAUDA-2024-8842', buyer: 'Maharshi Agro Exports', crop: 'Red Onion (24.0 MT)', amount: '₹5,80,800', date: '18 Sep 2026', status: 'DBT Cleared (ICICI Escrow)', reference: 'UTR981240182' },
    { id: 'SAUDA-2024-8710', buyer: 'Reliance Retail Agritech', crop: 'Soybean (12.5 MT)', amount: '₹5,65,000', date: '04 Sep 2026', status: 'DBT Cleared', reference: 'UTR981240102' },
    { id: 'SAUDA-2024-8622', buyer: 'Pimpalgaon APMC Trader #42', crop: 'Tomato (8.0 MT)', amount: '₹1,48,000', date: '28 Aug 2026', status: 'DBT Cleared', reference: 'UTR981240091' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0f172a]">My Transactions & Instant DBT Settlements</h1>
          <p className="text-xs text-slate-600 mt-1">Escrow payment history, banking UTR references, and transparent trade slips.</p>
        </div>
        <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs text-right">
          <div className="text-[10px] text-slate-500 font-semibold">Total Season Payouts</div>
          <div className="text-xl font-black text-[#0f172a] font-data-tabular">₹12,93,800</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0f172a] text-[#dcfce7] text-[11px] font-extrabold uppercase tracking-wider">
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Buyer / Procurement Agency</th>
                <th className="p-4">Produce Batch</th>
                <th className="p-4">Gross Payout</th>
                <th className="p-4">Settlement Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Invoice Slip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-[#0f172a]">
              {transactions.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-50 font-medium">
                  <td className="p-4 font-black font-data-tabular text-[#047857]">{t.id}</td>
                  <td className="p-4 font-bold">{t.buyer}</td>
                  <td className="p-4">{t.crop}</td>
                  <td className="p-4 font-black text-[#0f172a] font-data-tabular">{t.amount}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] text-[10px] font-bold border border-[#bbf7d0]">
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4">{t.date}</td>
                  <td className="p-4 text-right">
                    <Link to={`/transactions/${t.id}`} className="px-3 py-1 bg-[#047857] text-white rounded-lg text-[11px] font-bold hover:bg-[#065f46]">
                      View Slip →
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

export default TransactionsSettlements;
