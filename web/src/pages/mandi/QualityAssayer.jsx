import React, { useState } from 'react';
import { generateSlipPDF } from '../../utils/pdfGenerator';

export const QualityAssayer = () => {
  const [moisture] = useState('11.2%');
  const [defects] = useState('0.8%');
  const [grade, setGrade] = useState('Grade A1 (Export Spec)');
  const [tested, setTested] = useState(false);

  const handleIssueCertificate = () => {
    setTested(true);
    generateSlipPDF({
      organization: 'NATIONAL AGRI QUALITY ASSAY NETWORK',
      title: 'NIR SPECTROMETER ASSAY QUALITY CERTIFICATE',
      subtitle: 'Digital Quality Inspection Report',
      referenceNo: 'LOT-2024-098',
      dateTime: new Date().toLocaleString('en-IN'),
      fields: [
        { label: 'Lot Reference', value: '#LOT-2024-098' },
        { label: 'Commodity Variety', value: 'Red Onion (Garwa)' },
        { label: 'Assay Spectrometer', value: 'NIR Device #NIR-9082' },
        { label: 'Moisture Content', value: moisture },
        { label: 'Defect Ratio', value: defects },
        { label: 'Assayer Officer', value: 'Krushn Patil (#QA-4412)' }
      ],
      highlightResult: {
        label: 'CERTIFIED QUALITY GRADE',
        value: grade,
        subtext: 'Passed Mandatory APMC FAQ Export Specification'
      },
      footer: {
        operator: 'Krushn Patil (#QA-4412)',
        terminal: 'NIR Device #NIR-9082',
        location: 'Pimpalgaon APMC Inspection Lab',
        disclaimer: 'Spectrometric Quality Grade Certified'
      }
    }, 'NIR_Quality_Certificate_LOT_2024_098.pdf');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <span className="text-xs font-bold text-[#047857] uppercase tracking-wider">APMC Inspector Mobile Tool</span>
        <h1 className="text-2xl font-black text-[#0f172a]">NIR Quality Assayer Mobile Inspection</h1>
      </div>

      <div id="quality-assay-card" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#047857] text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">science</span>
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-[#0f172a]">NIR Spectrometer Device #NIR-9082</h3>
            <p className="text-xs text-slate-500 font-medium">Testing Batch: Red Onion #LOT-2024-098</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Moisture Content</span>
            <div className="text-2xl font-black text-[#0f172a] font-data-tabular mt-1">{moisture}</div>
            <div className="text-[10px] text-[#047857] font-bold mt-1">Optimal Storage Range</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Defect Percentage</span>
            <div className="text-2xl font-black text-[#0f172a] font-data-tabular mt-1">{defects}</div>
            <div className="text-[10px] text-slate-600 font-bold mt-1">Below 2% Threshold</div>
          </div>
          <div className="p-4 bg-[#dcfce7] border border-[#bbf7d0] rounded-xl">
            <span className="text-[10px] text-[#15803d] font-bold uppercase">Assigned Quality Grade</span>
            <div className="text-lg font-black text-[#047857] mt-1">{grade}</div>
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center">
          <span className="text-xs text-slate-600 font-semibold">Assayer Officer: Krushn Patil (#QA-4412)</span>
          <button 
            onClick={handleIssueCertificate}
            className="px-5 py-2.5 bg-[#047857] text-white font-extrabold text-xs rounded-xl hover:bg-[#065f46] shadow-xs transition-all cursor-pointer"
          >
            {tested ? '✓ Download PDF Certificate' : 'Issue & Download PDF Certificate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QualityAssayer;
