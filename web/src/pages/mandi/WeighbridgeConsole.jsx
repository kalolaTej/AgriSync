import React, { useState } from 'react';
import { generateSlipPDF, validateAndFormatWeights } from '../../utils/pdfGenerator';

export const WeighbridgeConsole = () => {
  const [grossInput, setGrossInput] = useState('18420');
  const [tareInput, setTareInput] = useState('6020');
  const [isEditing, setIsEditing] = useState(false);
  const [showSlipModal, setShowSlipModal] = useState(false);

  // Dynamically validate and derive net weight
  const weightCalc = validateAndFormatWeights(grossInput, tareInput);
  const isValid = weightCalc && weightCalc.isValid;

  const grossDisplay = weightCalc ? weightCalc.grossDisplay : `${grossInput} kg`;
  const tareDisplay = weightCalc ? weightCalc.tareDisplay : `${tareInput} kg`;
  const netDisplay = isValid ? weightCalc.netDisplay : '—';
  const subtextDisplay = isValid ? weightCalc.subtext : (weightCalc ? weightCalc.subtext : 'Invalid Scale Values');

  const handleGenerateCertifiedSlip = () => {
    if (!isValid) return;
    setShowSlipModal(true);
  };

  const handlePrintSlip = () => {
    if (!isValid) return;
    generateSlipPDF({
      organization: 'PIMPALGAON BASWANT APMC YARD #2',
      title: 'APMC MANDI CERTIFIED WEIGHBRIDGE SLIP',
      subtitle: 'Digital Scale Console Terminal #1',
      referenceNo: 'WB-88412',
      dateTime: new Date().toLocaleString('en-IN'),
      fields: [
        { label: 'Token / Queue Ref', value: 'Token #B-14' },
        { label: 'Vehicle Registration', value: 'MH-15-EG-4412' },
        { label: 'Driver Name', value: 'Dattatray Shinde' },
        { label: 'Farmer / Seller', value: 'Rajesh Tukaram Patil' },
        { label: 'Produce Commodity', value: 'Red Onion (Garwa)' },
        { label: 'Assay Quality Status', value: 'Grade A (Certified FAQ)' }
      ],
      grossWeight: grossInput,
      tareWeight: tareInput,
      highlightResult: {
        label: 'CERTIFIED NET HARVEST PRODUCE WEIGHT',
        value: netDisplay,
        subtext: subtextDisplay
      },
      footer: {
        operator: 'Sanjay Deshmukh (Secretary)',
        terminal: 'Scale Console Terminal #1',
        location: 'Pimpalgaon APMC Yard',
        disclaimer: 'Authenticated via APMC Automated Scale Sensors & Aadhaar e-KYC'
      }
    }, 'Weighbridge_Slip_WB_88412.pdf');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <span className="text-xs font-bold text-[#047857] uppercase tracking-wider">APMC Scale Operator Console</span>
        <h1 className="text-2xl font-black text-[#0f172a]">Digital Weighbridge Operator Terminal</h1>
      </div>

      {/* Scale Validation Error Alert */}
      {!isValid && weightCalc && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs font-extrabold">
            <span className="material-symbols-outlined text-lg text-red-600">error</span>
            <span>{weightCalc.errorMessage}</span>
          </div>
          <button 
            onClick={() => { setGrossInput('18420'); setTareInput('6020'); }}
            className="text-[11px] underline font-bold hover:text-red-900"
          >
            Reset to Standard
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Scale Sensor Readings</div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-extrabold text-[#047857] hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            {isEditing ? 'Done Calibrating' : 'Calibrate / Override Scale'}
          </button>
        </div>

        {isEditing && (
          <div className="p-4 bg-[#f8fafc] border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Gross Scale Input (kg):</label>
              <input
                type="number"
                value={grossInput}
                onChange={(e) => setGrossInput(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-data-tabular font-bold outline-none focus:border-[#047857]"
                placeholder="18420"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Vehicle Tare Input (kg):</label>
              <input
                type="number"
                value={tareInput}
                onChange={(e) => setTareInput(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-data-tabular font-bold outline-none focus:border-[#047857]"
                placeholder="6020"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Scale Gross Weight</span>
            <div className="text-2xl font-black text-[#0f172a] font-data-tabular mt-1">{grossDisplay}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Vehicle Tare Weight</span>
            <div className="text-2xl font-black text-[#0f172a] font-data-tabular mt-1">{tareDisplay}</div>
          </div>
          <div className={`p-4 rounded-xl text-center border transition-all ${
            isValid ? 'bg-[#dcfce7] border-[#bbf7d0]' : 'bg-red-50 border-red-200'
          }`}>
            <span className={`text-[10px] font-bold uppercase ${isValid ? 'text-[#15803d]' : 'text-red-600'}`}>
              Net Harvest Produce Weight
            </span>
            <div className={`text-2xl font-black font-data-tabular mt-1 ${isValid ? 'text-[#047857]' : 'text-red-700'}`}>
              {netDisplay}
            </div>
            <div className={`text-[10px] font-bold mt-1 ${isValid ? 'text-[#15803d]' : 'text-red-500'}`}>
              {subtextDisplay}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={handleGenerateCertifiedSlip}
            disabled={!isValid}
            className={`px-6 py-2.5 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98 ${
              isValid ? 'bg-[#0f172a] text-white hover:bg-[#1e293b]' : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined text-base">print</span> Generate Certified Weighbridge Slip
          </button>
        </div>
      </div>

      {/* Certified Weighbridge Slip Modal */}
      {showSlipModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div id="weighbridge-slip-card" className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5 print:shadow-none print:border-none">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 print:hidden">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#047857] text-2xl">scale</span>
                <h2 className="text-base font-black text-[#0f172a]">Official Weighbridge Slip #WB-88412</h2>
              </div>
              <button onClick={() => setShowSlipModal(false)} className="text-slate-400 hover:text-slate-700 text-xl font-bold">✕</button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs text-slate-800">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span>Queue Token:</span> <strong className="text-[#047857] font-data-tabular">Token #B-14</strong>
              </div>
              <div className="flex justify-between"><span>Vehicle Reg Plate:</span> <strong className="font-data-tabular">MH-15-EG-4412</strong></div>
              <div className="flex justify-between"><span>Driver:</span> <strong>Dattatray Shinde</strong></div>
              <div className="flex justify-between"><span>Produce Variety:</span> <strong>Red Onion (Garwa)</strong></div>
              <div className="border-t border-slate-200 pt-2 flex justify-between"><span>Gross Weight:</span> <strong>{grossDisplay}</strong></div>
              <div className="flex justify-between"><span>Tare Weight:</span> <strong>{tareDisplay}</strong></div>
              <div className="flex justify-between text-sm font-black text-[#047857]"><span>Certified Net Weight:</span> <strong>{netDisplay} ({subtextDisplay})</strong></div>
              <div className="text-[10px] text-slate-500 pt-1">Operator: Scale Terminal #1 • Pimpalgaon APMC Yard</div>
            </div>

            <div className="flex justify-end gap-2 print:hidden pt-2">
              <button 
                onClick={() => setShowSlipModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
              >
                Close
              </button>
              <button 
                onClick={handlePrintSlip}
                className="px-5 py-2 bg-[#047857] text-white font-extrabold rounded-xl hover:bg-[#065f46] shadow-md flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">print</span> Print Official Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeighbridgeConsole;
