import React, { useState } from 'react'
import { RefreshCw, Filter, CheckCircle2, AlertCircle, Plus, Video, Radio, Volume2 } from 'lucide-react'
import { playSirenSound } from '../../lib/soundEffects'

const DEFAULT_CAMERAS = [
  { id: 'cam_01', name: 'North Field Perimeter Cam', zone: 'North Boundary', status: 'online', fps: 24, resolution: '1080p', last_ping: 'Just now', preview: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600' },
  { id: 'cam_02', name: 'East Storage Barn Cam', zone: 'East Barn', status: 'online', fps: 24, resolution: '1080p', last_ping: 'Just now', preview: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=600' },
  { id: 'cam_03', name: 'South Gate Intrusion Cam', zone: 'South Fence', status: 'online', fps: 22, resolution: '1080p', last_ping: '1 min ago', preview: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600' },
  { id: 'cam_04', name: 'West Orchard Solar Node', zone: 'West Orchard', status: 'offline', fps: 0, resolution: '720p', last_ping: 'Offline', preview: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=600' }
]

export default function Cameras() {
  const [cameras, setCameras] = useState(DEFAULT_CAMERAS)
  const [selectedZone, setSelectedZone] = useState('All')

  const zones = ['All', 'North Boundary', 'East Barn', 'South Fence', 'West Orchard']
  const filteredCameras = selectedZone === 'All' ? cameras : cameras.filter(c => c.zone === selectedZone)

  const toggleCamera = (id) => {
    setCameras(prev => prev.map(c => {
      if (c.id === id) {
        const isOnline = c.status === 'online'
        return {
          ...c,
          status: isOnline ? 'offline' : 'online',
          fps: isOnline ? 0 : 24,
          last_ping: isOnline ? 'Offline' : 'Just now'
        }
      }
      return c
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">Perimeter Camera Management</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {cameras.length} Nodes
            </span>
          </div>
          <p className="text-xs text-secondary mt-1 font-medium">Live RTSP/IP camera streams and telemetry health status across farm fields.</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => playSirenSound(3)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-sm hover:bg-primary-hover transition-all"
          >
            <Volume2 size={15} />
            <span>Test Sound Siren</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs text-secondary font-semibold flex items-center gap-1 shrink-0">
          <Filter size={14} /> Filter Zone:
        </span>
        {zones.map((zone) => (
          <button
            key={zone}
            onClick={() => setSelectedZone(zone)}
            className={`px-3 py-1 text-xs rounded-full font-bold transition-colors whitespace-nowrap cursor-pointer ${
              selectedZone === zone
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white border border-slate-200 text-secondary hover:bg-slate-50'
            }`}
          >
            {zone}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCameras.map((cam) => {
          const isOnline = cam.status === 'online'
          return (
            <div key={cam.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
              <div className="relative h-44 bg-slate-900 overflow-hidden">
                <img
                  src={cam.preview}
                  alt={cam.name}
                  className={`w-full h-full object-cover transition-opacity ${isOnline ? 'opacity-85' : 'opacity-40 grayscale'}`}
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <Video size={12} className={isOnline ? 'text-emerald-400' : 'text-slate-400'} />
                  {cam.resolution}
                </div>
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => toggleCamera(cam.id)}
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      isOnline
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-700 border border-slate-300'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-600' : 'bg-slate-400'}`}></span>
                    {isOnline ? 'ONLINE' : 'OFFLINE'}
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-on-surface text-sm truncate">{cam.name}</h3>
                  <p className="text-xs text-secondary font-medium mt-0.5">{cam.zone}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-secondary font-medium">
                  <span className="flex items-center gap-1">
                    {isOnline ? <CheckCircle2 size={13} className="text-emerald-600" /> : <AlertCircle size={13} className="text-red-500" />}
                    {isOnline ? `${cam.fps} FPS` : 'No Signal'}
                  </span>
                  <span className="text-[11px] text-slate-400">Ping: {cam.last_ping}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
