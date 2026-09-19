import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const BuyerMatches = () => {
  const navigate = useNavigate();
  const [buyers] = useState([
    { id: 'BUY-01', name: 'Maharshi Agro Exports Ltd.', price: '2,520', unitPrice: 2520, qty: '24.0 MT', terms: 'ICICI Escrow • Zero Commission', location: 'Pimpalgaon APMC Yard', badge: 'Verified Exporter' },
    { id: 'BUY-02', name: 'Reliance Retail Agritech', price: '2,480', unitPrice: 2480, qty: '15.0 MT', terms: 'Direct Farmgate Pickup', location: 'Niphad Warehouse', badge: 'Corporate Buyer' },
    { id: 'BUY-03', name: 'Sahyadri Farmers Producer Co.', price: '2,450', unitPrice: 2450, qty: '30.0 MT', terms: 'FPO Pool Escrow', location: 'Nashik Mandi', badge: 'FPO Federation' }
  ]);

  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [contractForm, setContractForm] = useState({
    bankAccount: '9100238491823',
    ifsc: 'ICIC0000102',
    signature: 'Rajesh Tukaram Patil',
    agreedTerms: false
  });

  const [errors, setErrors] = useState({});

  const handleOpenContractModal = (buyer) => {
    setSelectedBuyer(buyer);
    setShowModal(true);
    setErrors({});
  };

  const handleExecuteContract = (e) => {
    e.preventDefault();
    const errs = {};
    if (!contractForm.bankAccount || contractForm.bankAccount.length < 8) {
      errs.bankAccount = 'Valid bank account number required.';
    }
    if (!contractForm.signature.trim()) {
      errs.signature = 'Digital signature text is required.';
    }
    if (!contractForm.agreedTerms) {
      errs.agreedTerms = 'You must accept the ICICI Escrow terms.';
    }
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setShowModal(false);
    navigate('/transactions');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#0f172a]">Verified Buyer Offers & Direct Contracts</h1>
        <p className="text-xs text-slate-600 mt-1">Direct institutional procurement offers backed by ICICI escrow payment protection.</p>
      </div>

      <div className="space-y-4">
        {buyers.map((b, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-[#0f172a]">{b.name}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] text-[10px] font-extrabold border border-[#bbf7d0]">{b.badge}</span>
              </div>
              <div className="text-xs text-slate-600 flex items-center gap-3">
                <span>📍 {b.location}</span>
                <span>•</span>
                <span>🔒 {b.terms}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <div className="text-xl font-black text-[#0f172a] font-data-tabular">₹{b.price} / Qtl</div>
                <div className="text-[11px] text-[#047857] font-bold">Requirement: {b.qty}</div>
              </div>
              <button 
                onClick={() => handleOpenContractModal(b)}
                className="px-4 py-2 bg-[#047857] text-white rounded-xl text-xs font-extrabold hover:bg-[#065f46] shadow-xs transition-colors cursor-pointer active:scale-98"
              >
                Accept Contract & Execute
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Contract Execution Form Modal */}
      {showModal && selectedBuyer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#047857] uppercase">Official Sauda Escrow Contract</span>
                <h2 className="text-lg font-black text-[#0f172a]">{selectedBuyer.name}</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 text-xl font-bold">✕</button>
            </div>

            <form onSubmit={handleExecuteContract} className="space-y-4 text-xs">
              <div className="p-3.5 bg-[#f0fdf4] rounded-xl border border-[#dcfce7] space-y-1">
                <div className="flex justify-between font-bold text-[#0f172a]">
                  <span>Offered Modal Price:</span>
                  <span className="text-[#047857]">₹{selectedBuyer.price} / Qtl</span>
                </div>
                <div className="flex justify-between font-bold text-[#0f172a]">
                  <span>Lot Volume:</span>
                  <span>24.0 MT (240 Quintals)</span>
                </div>
                <div className="flex justify-between font-black text-sm text-[#0f172a] border-t border-[#bbf7d0] pt-1 mt-1">
                  <span>Total Escrow Lock Value:</span>
                  <span className="text-[#047857]">₹{(selectedBuyer.unitPrice * 240).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">DBT Escrow Bank Account Number *</label>
                <input 
                  type="text"
                  value={contractForm.bankAccount}
                  onChange={(e) => setContractForm({...contractForm, bankAccount: e.target.value})}
                  className="w-full px-3.5 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-bold text-[#0f172a] outline-none focus:border-[#047857]"
                />
                {errors.bankAccount && <span className="text-red-600 text-[10px] font-bold mt-0.5 block">{errors.bankAccount}</span>}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">IFSC Code *</label>
                <input 
                  type="text"
                  value={contractForm.ifsc}
                  onChange={(e) => setContractForm({...contractForm, ifsc: e.target.value})}
                  className="w-full px-3.5 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-bold text-[#0f172a] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Digital Authorized Signature *</label>
                <input 
                  type="text"
                  placeholder="Type Full Name to Sign"
                  value={contractForm.signature}
                  onChange={(e) => setContractForm({...contractForm, signature: e.target.value})}
                  className="w-full px-3.5 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-bold text-[#0f172a] outline-none focus:border-[#047857]"
                />
                {errors.signature && <span className="text-red-600 text-[10px] font-bold mt-0.5 block">{errors.signature}</span>}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input 
                    type="checkbox" 
                    checked={contractForm.agreedTerms} 
                    onChange={(e) => setContractForm({...contractForm, agreedTerms: e.target.checked})}
                    className="accent-[#047857]"
                  />
                  <span>I accept ICICI Bank escrow protection terms & zero commission mandate.</span>
                </label>
                {errors.agreedTerms && <span className="text-red-600 text-[10px] font-bold mt-0.5 block">{errors.agreedTerms}</span>}
              </div>

              <div className="pt-2 flex justify-end gap-2">
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
                  ✓ Sign & Lock Escrow Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerMatches;
