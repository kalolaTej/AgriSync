import React from 'react';

export const Cameras = () => {
  const nodes = [
    { name: 'North Perimeter Node #1', status: 'Online • 30 FPS', zone: 'Onion Plot (North Boundary)', battery: '98% (Solar)', animal: 'No Intrusion' },
    { name: 'East Boundary Node #2', status: 'Online • 30 FPS', zone: 'Soybean Plot (East)', battery: '92% (Solar)', animal: 'Wild Boar Detected (03:14 AM)' },
    { name: 'South Canal Node #3', status: 'Online • 30 FPS', zone: 'Canal Perimeter', battery: '100% (Grid)', animal: 'No Intrusion' },
    { name: 'West Gate ANPR Node #4', status: 'Online • 30 FPS', zone: 'Farm Entry Gate', battery: '95% (Solar)', animal: 'No Intrusion' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0f172a]">Perimeter Camera Nodes & IoT Sensors</h1>
          <p className="text-xs text-slate-600 mt-1">Live YOLOv8 AI perimeter monitoring and automated siren deterrent nodes.</p>
        </div>
        <span className="px-3.5 py-1.5 rounded-xl bg-[#047857] text-white text-xs font-extrabold shadow-xs w-fit">
          4 / 4 Nodes Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nodes.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <span className="font-extrabold text-sm text-[#0f172a]">{c.name}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] text-[10px] font-bold border border-[#bbf7d0]">{c.status}</span>
              </div>
              <div className="h-40 bg-[#0f172a] rounded-xl flex items-center justify-center text-white text-xs font-bold relative overflow-hidden">
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#047857] text-white text-[10px] rounded font-bold">REC ● LIVE</div>
                <div className="text-center">
                  <span className="material-symbols-outlined text-4xl block mb-1 text-[#a7f3d0]">videocam</span>
                  <span>{c.zone}</span>
                </div>
              </div>
              <div className="mt-3 flex justify-between text-xs text-slate-600">
                <span>Battery Status: <strong className="text-[#0f172a]">{c.battery}</strong></span>
                <span>Detection: <strong className="text-[#047857]">{c.animal}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cameras;
