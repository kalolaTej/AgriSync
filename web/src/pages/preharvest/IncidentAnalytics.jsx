import { useState, useEffect, useCallback } from 'react'
import { BarChart3, Calendar, Layers, MapPin, RefreshCw, ShieldAlert, TrendingUp, Activity } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function IncidentAnalytics() {
  const { session } = useAuth()
  const [farms, setFarms] = useState([])
  const [selectedFarmId, setSelectedFarmId] = useState('')
  const [analytics, setAnalytics] = useState({ by_zone: [], by_period: [] })
  const [loading, setLoading] = useState(true)

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
    } catch {
      // ignore
    }
  }, [backendUrl, session])

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    try {
      const headers = {}
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }
      const queryStr = selectedFarmId ? `?farm_id=${selectedFarmId}` : ''
      const res = await fetch(`${backendUrl}/api/incidents/analytics${queryStr}`, { headers })
      if (res.ok) {
        const data = await res.json()
        setAnalytics({
          by_zone: Array.isArray(data?.by_zone) ? data.by_zone : [],
          by_period: Array.isArray(data?.by_period) ? data.by_period : [],
        })
      }
    } catch {
      // keep fallback empty
    } finally {
      setLoading(false)
    }
  }, [backendUrl, session, selectedFarmId])

  useEffect(() => {
    fetchFarms()
  }, [fetchFarms])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const totalIntrusions = analytics.by_zone.reduce((acc, curr) => acc + (curr.count || 0), 0)
  const maxZone = analytics.by_zone.reduce(
    (max, curr) => (curr.count > (max?.count || 0) ? curr : max),
    null
  )
  const avgPerPeriod = analytics.by_period.length > 0
    ? (totalIntrusions / analytics.by_period.length).toFixed(1)
    : '0'

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#2F2F2F] tracking-tight">Intrusion Frequency Analytics</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#8FAF5A]/15 text-[#8FAF5A] border border-[#8FAF5A]/30">
              Historical Aggregation
            </span>
          </div>
          <p className="text-xs text-[#666666] mt-1 font-medium">
            Aggregated intrusion counts grouped by farm perimeter zone and daily time buckets.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {farms.length > 0 && (
            <select
              value={selectedFarmId}
              onChange={(e) => setSelectedFarmId(e.target.value)}
              className="text-xs font-semibold bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-[#2F2F2F] focus:outline-none focus:border-[#8FAF5A]"
            >
              <option value="">All Farm Zones</option>
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => fetchAnalytics()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#FAFBF8] text-[#2F2F2F] text-xs font-bold transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-[#8FAF5A]' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-base p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8FAF5A]/15 text-[#8FAF5A] flex items-center justify-center shrink-0">
            <ShieldAlert size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#666666]">Total Intrusions</p>
            <h3 className="text-xl font-extrabold text-[#2F2F2F]">{loading ? '...' : totalIntrusions}</h3>
          </div>
        </div>

        <div className="card-base p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
            <Layers size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#666666]">Active Zones</p>
            <h3 className="text-xl font-extrabold text-[#2F2F2F]">{loading ? '...' : analytics.by_zone.length}</h3>
          </div>
        </div>

        <div className="card-base p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
            <MapPin size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#666666]">High Activity Zone</p>
            <h3 className="text-sm font-extrabold text-[#2F2F2F] truncate max-w-[130px]">
              {loading ? '...' : maxZone?.zone || 'N/A'}
            </h3>
          </div>
        </div>

        <div className="card-base p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
            <Activity size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#666666]">Daily Avg Intrusions</p>
            <h3 className="text-xl font-extrabold text-[#2F2F2F]">{loading ? '...' : avgPerPeriod}</h3>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* By Zone Distribution Card */}
        <div className="lg:col-span-6 card-base p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-[#8FAF5A]" />
              <h2 className="text-base font-extrabold text-[#2F2F2F]">Intrusion Count by Zone</h2>
            </div>
            <span className="text-xs text-[#666666] font-medium">Zone Distribution</span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-stone-200/70 rounded-xl animate-shimmer"></div>
              ))}
            </div>
          ) : analytics.by_zone.length === 0 ? (
            <p className="text-xs text-[#666666] py-6 text-center">No zone telemetry data available.</p>
          ) : (
            <div className="space-y-4">
              {analytics.by_zone.map((z) => {
                const pct = totalIntrusions > 0 ? Math.round((z.count / totalIntrusions) * 100) : 0
                return (
                  <div key={z.zone} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-[#2F2F2F]">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-[#8FAF5A]" /> {z.zone}
                      </span>
                      <span>
                        {z.count} events ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#8FAF5A] rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(pct, 5)}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* By Period Timeline Card */}
        <div className="lg:col-span-6 card-base p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-[#8FAF5A]" />
              <h2 className="text-base font-extrabold text-[#2F2F2F]">Daily Intrusion Frequency</h2>
            </div>
            <span className="text-xs text-[#666666] font-medium">Timeline Log</span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-stone-200/70 rounded-xl animate-shimmer"></div>
              ))}
            </div>
          ) : analytics.by_period.length === 0 ? (
            <p className="text-xs text-[#666666] py-6 text-center">No daily frequency data available.</p>
          ) : (
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {analytics.by_period.map((p) => (
                <div
                  key={p.period}
                  className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#FAFBF8] transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-[#2F2F2F]">
                    <Calendar size={14} className="text-[#8A8A8A]" />
                    <span>{p.period}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#2F2F2F] bg-stone-100 px-2.5 py-0.5 rounded-md">
                      {p.count} intrusion{p.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
