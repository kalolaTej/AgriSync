import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { generateSlipPDF } from '../../utils/pdfGenerator';

export const TransactionDetail = () => {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = () => {
    setDownloading(true);
    generateSlipPDF({
      organization: 'AGRISYNC ESCROW & DBT SETTLEMENT NETWORK',
      title: 'ELECTRONIC SAUDA SLIP & ESCROW RECEIPT',
      subtitle: 'ICICI Bank Mandi Escrow Settlement Node',
      referenceNo: 'SAUDA-2024-8842',
      dateTime: new Date().toLocaleString('en-IN'),
      fields: [
        { label: 'Transaction ID', value: '#SAUDA-2024-8842' },
        { label: 'Seller Farmer', value: 'Rajesh Tukaram Patil (FPO)' },
        { label: 'Buyer Institution', value: 'Maharshi Agro Exports Ltd.' },
        { label: 'Produce Batch', value: 'Red Onion Garwa (24.0 MT / 240 Qtl)' },
        { label: 'Contract Rate', value: '₹2,420.00 / Qtl' },
        { label: 'Bank Escrow UTR', value: 'UTR981240182 (ICICI Bank)' },
        { label: 'Settlement Status', value: 'DBT CLEARED & CONFIRMED' }
      ],
      highlightResult: {
        label: 'NET DBT DIRECT TRANSFER AMOUNT',
        value: '₹5,80,800.00',
        subtext: 'Direct Benefit Transfer Deposited to Farmer Bank A/c ****91823'
      },
      footer: {
        operator: 'AgriSync Automated Escrow Node',
        terminal: 'ICICI Bank Escrow Gateway',
        location: 'National APMC Network',
        disclaimer: 'Authenticated via Aadhaar e-KYC & Escrow Smart Contract'
      }
    }, 'Invoice_SAUDA_2024_8842.pdf');

    setTimeout(() => {
      setDownloading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <span className="text-xs font-extrabold text-[#047857] uppercase tracking-wider">Certified Electronic Sauda Slip</span>
          <h1 className="text-2xl font-black text-[#0f172a]">Transaction #SAUDA-2024-8842</h1>
        </div>
        <Link to="/transactions" className="px-3.5 py-1.5 bg-slate-100 text-[#0f172a] border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200">
          ← Back
        </Link>
      </div>

      <div id="sauda-slip-card" className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl space-y-6 print:shadow-none print:border-none">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#047857] text-white flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-2xl">verified</span>
            </div>
            <div>
              <div className="font-black text-sm text-[#0f172a]">AgriSync Escrow DBT Receipt</div>
              <div className="text-xs text-[#047857] font-bold">ICICI Bank Escrow Ref: UTR981240182</div>
            </div>
          </div>
          <span className="px-3 py-1 bg-[#dcfce7] text-[#15803d] rounded-full text-xs font-bold border border-[#bbf7d0]">DBT Cleared</span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs text-slate-700">
          <div>
            <span className="text-slate-500 block font-semibold">Seller Farmer:</span>
            <strong className="text-[#0f172a] text-sm">Rajesh Tukaram Patil (FPO)</strong>
            <p className="mt-0.5">Aadhaar e-KYC Verified • Bank A/c: ****91823</p>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold">Buyer Institution:</span>
            <strong className="text-[#0f172a] text-sm">Maharshi Agro Exports Ltd.</strong>
            <p className="mt-0.5">APMC License #EXP-88412 • Escrow Account Active</p>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2 text-xs">
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span>Red Onion Garwa (24.0 MT / 240 Qtl) @ ₹2,420/Qtl</span>
            <strong className="font-data-tabular">₹5,80,800.00</strong>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Mandi User Cess & APMC Fee (Waived)</span>
            <strong className="font-data-tabular">₹0.00</strong>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Digital Assay Inspection Fee</span>
            <strong className="font-data-tabular">₹0.00</strong>
          </div>
          <div className="flex justify-between pt-2 text-base font-black text-[#0f172a]">
            <span>Net DBT Direct Transfer Amount</span>
            <span className="text-[#047857] font-data-tabular">₹5,80,800.00</span>
          </div>
        </div>

        <div className="pt-2 text-center print:hidden">
          <button 
            onClick={handleDownloadPDF}
            className="px-6 py-2.5 bg-[#0f172a] text-white rounded-xl text-xs font-bold hover:bg-[#1e293b] shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">download</span> 
            {downloading ? 'Preparing Official PDF...' : 'Download PDF Official Invoice'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
