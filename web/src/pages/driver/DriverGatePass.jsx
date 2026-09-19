import React from 'react';
import { generateSlipPDF } from '../../utils/pdfGenerator';

export const DriverGatePass = () => {
  const handleDownloadPDF = () => {
    generateSlipPDF({
      organization: 'APMC DRAYAGE FAST-TRACK KIOSK',
      title: 'FAST-TRACK DRAYAGE GATE PASS',
      subtitle: 'ANPR Automatic Barrier Security Access',
      referenceNo: 'PASS-MH15-88412',
      dateTime: new Date().toLocaleString('en-IN'),
      fields: [
        { label: 'Gate Pass ID', value: 'PASS-MH15-88412' },
        { label: 'Assigned Token Ref', value: 'Token #B-14' },
        { label: 'APMC Mandi Yard', value: 'Pimpalgaon Baswant APMC Yard #2' },
        { label: 'Driver & Vehicle', value: 'Dattatray Shinde (MH-15-EG-4412)' },
        { label: 'Produce Cargo Batch', value: '24.0 MT Red Onion Garwa' },
        { label: 'Arrival Window', value: 'Tomorrow 08:30 AM' }
      ],
      highlightResult: {
        label: 'BARRIER SECURITY ACCESS STATUS',
        value: 'ANPR FAST-TRACK AUTHORIZED',
        subtext: 'Present Scannable Pass at ANPR Barrier #2 for Instant Entry'
      },
      footer: {
        operator: 'ANPR Security Gate Terminal',
        terminal: 'Gate Barrier Kiosk #2',
        location: 'Pimpalgaon APMC Yard',
        disclaimer: 'Validated via APMC Drayage Access Control'
      }
    }, 'Gate_Pass_PASS_MH15_88412.pdf');
  };
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <span className="text-xs font-bold text-[#047857] uppercase tracking-wider">Fast-Track Gate Pass Kiosk</span>
        <h1 className="text-2xl font-black text-[#0f172a]">APMC Drayage Fast-Track Pass</h1>
      </div>

      <div id="driver-gate-pass-card" className="bg-white rounded-2xl p-6 border-2 border-[#047857] shadow-xl text-center space-y-5">
        <div className="inline-block p-4 bg-white border-2 border-[#0f172a] rounded-2xl shadow-inner">
          <img 
            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PASS-MH15-88412-PIMPALGAON-APMC-TOKEN-B14" 
            alt="Scannable Gate Pass QR Code" 
            className="w-48 h-48 mx-auto rounded-xl shadow-xs border border-slate-200"
          />
          <span className="font-black text-sm text-[#0f172a] mt-3 block font-data-tabular">PASS-MH15-88412</span>
        </div>

        <div className="space-y-2 text-xs text-[#0f172a]">
          <div className="text-lg font-black text-[#047857]">Token #B-14 • Pimpalgaon APMC</div>
          <div>Driver: <strong>Dattatray Shinde (MH-15-EG-4412)</strong></div>
          <div>Produce: <strong>24.0 MT Red Onion Garwa</strong></div>
          <div>Scheduled Yard Arrival: <strong>Tomorrow 08:30 AM</strong></div>
        </div>

        <div className="p-3 bg-[#dcfce7] rounded-xl border border-[#bbf7d0] text-xs font-bold text-[#15803d]">
          Show this QR code at ANPR Barrier #2 for automatic gate opening.
        </div>

        <div className="pt-2">
          <button
            onClick={handleDownloadPDF}
            className="px-6 py-2.5 bg-[#0f172a] text-white rounded-xl text-xs font-extrabold hover:bg-[#1e293b] shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">download</span> Download Gate Pass PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverGatePass;
