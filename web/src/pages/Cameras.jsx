import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, Filter, CheckCircle2, AlertCircle, Plus, Video, Radio, Layers, ShieldAlert, Sliders, Activity } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ANIMAL_IMAGES } from '../lib/animalImages'
import AddCameraModal from '../components/AddCameraModal'

const STORAGE_KEY = 'agrisync_cameras_v2'

const DEFAULT_SEEDED_CAMERAS = [
  {
    id: 'CAM-NORTH-01',
    name: 'North Perimeter Node #1',
    farm_name: 'Rajesh Farm (Niphad)',
    zone: 'North Field - Onion Plot',
    status: 'online',
    detection_enabled: true,
    resolution: '1080p',
    fps: 30,
    last_ping: 'Live now (Heartbeat: 4s ago)',
    last_detection: 'Wild Boar (03:14 AM Today)',
    source_url: 'rtsp://192.168.1.101:554/live/north_field',
    preview: ANIMAL_IMAGES.pig
  },
  {
    id: 'CAM-EAST-02',
    name: 'East Boundary Node #2',
    farm_name: 'Rajesh Farm (Niphad)',
    zone: 'East Boundary - Sugarcane',
    status: 'online',
    detection_enabled: true,
    resolution: '1080p',
    fps: 30,
    last_ping: 'Live now (Heartbeat: 8s ago)',
    last_detection: 'Cow / Cattle (Yesterday 11:45 PM)',
    source_url: 'rtsp://192.168.1.102:554/live/east_sugarcane',
    preview: ANIMAL_IMAGES.cow
  },
  {
    id: 'CAM-SOUTH-03',
    name: 'South Canal Node #3',
    farm_name: 'Rajesh Farm (Niphad)',
    zone: 'South Canal Perimeter',
    status: 'online',
    detection_enabled: true,
    resolution: '1080p',
    fps: 30,
    last_ping: 'Live now (Heartbeat: 12s ago)',
    last_detection: 'Nilgai (2 days ago)',
    source_url: 'rtsp://192.168.1.103:554/live/south_canal',
    preview: ANIMAL_IMAGES.horse
  },
  {
    id: 'CAM-GATE-04',
    name: 'West Gate Terminal Node #4',
    farm_name: 'Rajesh Farm (Niphad)',
    zone: 'Farm Entry Gate',
    status: 'offline',
    detection_enabled: false,
    resolution: '720p',
    fps: 0,
    last_ping: 'Offline (No heartbeat)',
    last_detection: 'No intrusion logged',
    source_url: 'rtsp://192.168.1.104:554/live/west_gate',
    preview: ANIMAL_IMAGES.dog
  }
]

const loadCustomCameras = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) return JSON.parse(data)
  } catch {}
  return DEFAULT_SEEDED_CAMERAS
}

const saveCustomCameras = (cameras) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cameras))
  } catch {}
}

export default function Cameras() {
  const { session } = useAuth()
  const [cameras, setCameras] = useState(() => loadCustomCameras())
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedZone, setSelectedZone] = useState('All')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const fetchFarms = useCallback(async () => {
    try {
      const headers = {}
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }
      const res = await fetch(`${backendUrl}/api/farms`, { headers })
      if (res.ok) {
        const data = await res.json()
        const items = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []
        setFarms(items)
      }
    } catch {}
  }, [backendUrl, session])

  const fetchCameras = useCallback(async () => {
    try {
      const headers = {}
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }
      const res = await fetch(`${backendUrl}/api/cameras`, { headers })
      if (res.ok) {
        const data = await res.json()
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.cameras)
          ? data.cameras
          : null

        if (items && items.length > 0) {
          const apiFormatted = items.map((c, i) => {
            let isCamOnline = false
            if (typeof c.status === 'boolean') {
              isCamOnline = c.status
            } else if (typeof c.status === 'string') {
              isCamOnline = c.status.toLowerCase() === 'online' || c.status.toLowerCase() === 'true'
            } else if (typeof c.status === 'number') {
              isCamOnline = c.status === 1
            }

            return {
              ...c,
              id: c.id || `CAM-${i+1}`,
              farm_name: c.farm_name || 'Rajesh Farm (Niphad)',
              status: isCamOnline ? 'online' : 'offline',
              detection_enabled: c.detection_enabled !== false,
              fps: isCamOnline ? (c.fps || 30) : 0,
              resolution: c.resolution || '1080p',
              last_ping: c.last_ping || (isCamOnline ? 'Live now (Heartbeat: 5s ago)' : 'No heartbeat signal'),
              last_detection: c.last_detection || 'Monitoring...',
              preview: c.preview || Object.values(ANIMAL_IMAGES)[i % Object.values(ANIMAL_IMAGES).length],
            }
          })

          setCameras((prev) => {
            const currentList = prev.length > 0 ? prev : DEFAULT_SEEDED_CAMERAS
            const seenIds = new Set()
            const unique = []
            for (const c of [...apiFormatted, ...currentList]) {
              if (c && c.id && !seenIds.has(c.id)) {
                seenIds.add(c.id)
                unique.push(c)
              }
            }
            saveCustomCameras(unique)
            return unique
          })
        }
      }
    } catch {
      // keep local state
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [backendUrl, session])

  useEffect(() => {
    fetchCameras()
    fetchFarms()
  }, [fetchCameras, fetchFarms])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchCameras()
  }

  const handleCameraAdded = (newCam) => {
    const isCamOnline = newCam.status === true || newCam.status === 'online'
    const formatted = {
      ...newCam,
      id: newCam.id || `CAM-${Date.now().toString().slice(-4)}`,
      farm_name: newCam.farm_name || 'Rajesh Farm (Niphad)',
      status: isCamOnline ? 'online' : 'offline',
      detection_enabled: true,
      fps: isCamOnline ? 30 : 0,
      resolution: '1080p',
      last_ping: isCamOnline ? 'Live now' : 'Connecting...',
      last_detection: 'Monitoring...',
      preview: ANIMAL_IMAGES.cow,
    }

    setCameras((prev) => {
      const updated = [formatted, ...prev.filter((c) => c.id !== formatted.id)]
      saveCustomCameras(updated)
      return updated
    })
    setSelectedZone('All')
  }

  const toggleCameraStatus = async (camId, currentStatus) => {
    const isCurrentlyOnline = currentStatus === 'online' || currentStatus === true
    const newStatusStr = isCurrentlyOnline ? 'offline' : 'online'
    const newStatusBool = !isCurrentlyOnline

    setCameras((prev) => {
      const updated = prev.map((c) => {
        if (c.id === camId) {
          return {
            ...c,
            status: newStatusStr,
            fps: newStatusBool ? 30 : 0,
            last_ping: newStatusBool ? 'Live now (Heartbeat: 2s ago)' : 'Offline (Disconnected)',
          }
        }
        return c
      })
      saveCustomCameras(updated)
      return updated
    })

    try {
      const headers = { 'Content-Type': 'application/json' }
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }
      await fetch(`${backendUrl}/api/cameras/${camId}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: newStatusBool }),
      })
    } catch {}
  }

  const toggleDetectionStatus = (camId) => {
    setCameras((prev) => {
      const updated = prev.map((c) => {
        if (c.id === camId) {
          return {
            ...c,
            detection_enabled: !c.detection_enabled
          }
        }
        return c
      })
      saveCustomCameras(updated)
      return updated
    })
  }

  const cameraList = Array.isArray(cameras) && cameras.length > 0 ? cameras : DEFAULT_SEEDED_CAMERAS
  const zones = ['All', ...new Set(cameraList.map((c) => c?.zone).filter(Boolean))]
  const filteredCameras = selectedZone === 'All'
    ? cameraList
    : cameraList.filter((c) => c?.zone === selectedZone)

  const activeCount = cameraList.filter((c) => c.status === 'online' || c.status === true).length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">Perimeter Camera Nodes & IoT Sensors</h1>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]">
              {activeCount} / {cameraList.length} Active Nodes
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Live edge camera telemetry, detection zone routing, and RTSP stream status connected to YOLO11n AI inference.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#047857] hover:bg-[#065f46] text-white text-xs font-extrabold transition-all shadow-md cursor-pointer active:scale-95"
          >
            <Plus size={15} />
            <span>+ Add Camera Node</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[#0f172a] text-xs font-bold transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin text-[#047857]' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Zone Filter Pills */}
      {zones.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-slate-500 font-bold flex items-center gap-1 mr-1 shrink-0">
            <Filter size={14} /> Filter Zone:
          </span>
          {zones.map((zone) => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`px-3 py-1 text-xs rounded-full font-bold transition-colors whitespace-nowrap cursor-pointer ${
                selectedZone === zone
                  ? 'bg-[#047857] text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {zone}
            </button>
          ))}
        </div>
      )}

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCameras.map((cam, idx) => {
          const isOnline = cam?.status === 'online' || cam?.status === true
          const isDetectionOn = cam?.detection_enabled !== false

          return (
            <div
              key={cam?.id || idx}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Stream Preview Header */}
                <div className="relative h-48 bg-slate-950 flex items-center justify-center overflow-hidden">
                  <img
                    src={cam?.preview || ANIMAL_IMAGES.cow}
                    alt={cam?.name || 'Camera Stream'}
                    className={`w-full h-full object-cover transition-opacity ${
                      isOnline ? 'opacity-85 hover:opacity-100' : 'opacity-30 grayscale'
                    }`}
                  />

                  {/* Overlay Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="bg-black/70 backdrop-blur-xs text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded flex items-center gap-1 border border-white/20">
                      <Video size={12} className={isOnline ? 'text-[#34d399]' : 'text-slate-400'} />
                      {cam?.resolution || '1080p'} • {cam?.fps || 0} FPS
                    </span>
                    <span className="bg-[#047857]/90 text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                      CAMERA SIMULATION
                    </span>
                  </div>

                  {/* Online/Offline Toggle Button */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => toggleCameraStatus(cam.id, cam.status)}
                      title="Toggle Camera Node Online/Offline"
                      className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1 rounded-full transition-transform active:scale-95 cursor-pointer shadow-md ${
                        isOnline
                          ? 'bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#15803d] animate-pulse' : 'bg-slate-400'}`}></span>
                      {isOnline ? 'ONLINE' : 'OFFLINE'}
                    </button>
                  </div>

                  {/* Stream URL footer overlay */}
                  {cam?.source_url && (
                    <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-mono text-slate-300 truncate flex items-center gap-1.5">
                      <Radio size={11} className={isOnline ? 'text-[#34d399]' : 'text-slate-500'} />
                      <span className="truncate">{cam.source_url}</span>
                    </div>
                  )}
                </div>

                {/* Camera Information Details */}
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-black text-base text-[#0f172a]">{cam?.name || 'Perimeter Camera Node'}</h3>
                      <p className="text-xs text-[#047857] font-bold mt-0.5">
                        Zone: {cam?.zone || 'North Field - Onion Plot'}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Farm: {cam?.farm_name || 'Rajesh Farm (Niphad)'} • Node ID: <span className="font-mono">{cam?.id}</span>
                      </p>
                    </div>

                    {/* Detection Switch */}
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 font-bold block mb-1">AI Detection</span>
                      <button
                        onClick={() => toggleDetectionStatus(cam.id)}
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          isDetectionOn
                            ? 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {isDetectionOn ? '✓ ENABLED' : '✕ MUTED'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Telemetry Heartbeat</span>
                      <span className="font-bold text-[#0f172a] text-[11px] flex items-center gap-1 mt-0.5">
                        <Activity size={12} className={isOnline ? 'text-[#047857]' : 'text-slate-400'} />
                        {cam?.last_ping || 'Active'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Last Incident</span>
                      <span className="font-semibold text-slate-700 text-[11px] truncate block mt-0.5">
                        {cam?.last_detection || 'Monitoring...'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Footer */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1.5 font-bold">
                  {isOnline ? (
                    <CheckCircle2 size={14} className="text-[#15803d]" />
                  ) : (
                    <AlertCircle size={14} className="text-red-500" />
                  )}
                  {isOnline ? 'RTSP Signal Synchronized' : 'Stream Standby (Click Online to Connect)'}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{cam?.resolution} 30FPS</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Camera Modal */}
      <AddCameraModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCameraAdded={handleCameraAdded}
        farms={farms}
      />
    </div>
  )
}
