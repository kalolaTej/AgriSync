import { useState, useEffect, useCallback } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Search,
  RefreshCw,
  Database,
  Building2,
  Calendar,
  AlertCircle,
  Filter,
  CheckCircle2,
  BarChart3,
  Layers,
  ArrowRight,
  Bell,
  Sparkles,
  MapPin,
  CircleDollarSign,
  ListFilter,
  ChevronDown,
  ChevronUp,
  Globe2,
  Info
} from 'lucide-react'
import { API_BASE_URL } from '../../lib/api'

export default function MarketPrices() {
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCrop, setSelectedCrop] = useState('Tomato')
  const [selectedState, setSelectedState] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [trendData, setTrendData] = useState([])
  const [loadingTrend, setLoadingTrend] = useState(false)
  const [activeTab, setActiveTab] = useState('table') // 'table' | 'arbitrage' | 'trend' | 'alert'
  const [visibleCount, setVisibleCount] = useState(8) // View More APMCs expander
  
  // Arbitrage Data
  const [arbitrageData, setArbitrageData] = useState(null)
  const [loadingArbitrage, setLoadingArbitrage] = useState(false)

  // Price Alert Watcher State
  const [targetPrice, setTargetPrice] = useState('3000')
  const [targetCrop, setTargetCrop] = useState('Tomato')
  const [activeAlerts, setActiveAlerts] = useState([
    { crop: 'Tomato', target: 2800, created: 'Today' },
    { crop: 'Wheat', target: 2600, created: 'Yesterday' }
  ])

  const popularCrops = ['Tomato', 'Wheat', 'Onion', 'Potato', 'Rice', 'Soybean', 'Cotton', 'Cabbage', 'Bitter gourd', 'Bajra(Pearl Millet/Cumbu)']
  const majorStates = ['All States', 'Andhra Pradesh', 'Maharashtra', 'Madhya Pradesh', 'Haryana', 'Uttar Pradesh', 'Gujarat', 'Karnataka', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'West Bengal', 'Delhi', 'Bihar', 'Odisha', 'Chhattisgarh']

  const fetchPrices = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (selectedCrop) params.append('crop', selectedCrop)
      if (selectedState && selectedState !== 'All States') params.append('state', selectedState)
      params.append('limit', '50')

      const res = await fetch(`${API_BASE_URL}/api/prices?${params.toString()}`)
      if (!res.ok) throw new Error(`Server returned ${res.status}`)
      const data = await res.json()
      setPrices(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to fetch prices')
    } finally {
      setLoading(false)
    }
  }, [selectedCrop, selectedState])

  const fetchTrend = useCallback(async () => {
    if (!selectedCrop) return
    setLoadingTrend(true)
    try {
      const params = new URLSearchParams({ crop: selectedCrop })
      const res = await fetch(`${API_BASE_URL}/api/prices/trend?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setTrendData(Array.isArray(data) ? data : [])
      }
    } catch {
      // safe fallback
    } finally {
      setLoadingTrend(false)
    }
  }, [selectedCrop])

  const fetchArbitrage = useCallback(async () => {
    if (!selectedCrop) return
    setLoadingArbitrage(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/prices/arbitrage?crop=${encodeURIComponent(selectedCrop)}`)
      if (res.ok) {
        const data = await res.json()
        setArbitrageData(data)
      }
    } catch {
      // safe fallback
    } finally {
      setLoadingArbitrage(false)
    }
  }, [selectedCrop])

  useEffect(() => {
    fetchPrices()
    fetchTrend()
    fetchArbitrage()
  }, [fetchPrices, fetchTrend, fetchArbitrage])

  const filteredPrices = prices.filter((p) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      (p.market_name && p.market_name.toLowerCase().includes(q)) ||
      (p.state && p.state.toLowerCase().includes(q)) ||
      (p.crop_type && p.crop_type.toLowerCase().includes(q))
    )
  })

  const realCount = prices.filter((p) => p.source === 'real').length
  const mockCount = prices.filter((p) => p.source === 'mock').length
  const avgModal = prices.length > 0
    ? Math.round(prices.reduce((sum, p) => sum + (parseFloat(p.modal_price) || 0), 0) / prices.length)
    : 0

  const minInList = prices.length > 0 ? Math.min(...prices.map((p) => p.min_price || p.modal_price)) : 0
  const maxInList = prices.length > 0 ? Math.max(...prices.map((p) => p.max_price || p.modal_price)) : 0

  const handleAddAlert = (e) => {
    e.preventDefault()
    if (!targetPrice) return
    setActiveAlerts((prev) => [
      { crop: targetCrop, target: parseFloat(targetPrice), created: 'Just now' },
      ...prev
    ])
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-300">
              Government Mandi Feed
            </span>
            <span className="text-xs text-slate-400">AGMARKNET (data.gov.in)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Mandi Market Prices & Arbitrage
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Live commodity rates, cross-mandi profit arbitrage, historical price trajectory, and threshold watcher.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => { fetchPrices(); fetchTrend(); fetchArbitrage(); }}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Latest Mandi Data</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Modal Rate</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            ₹{avgModal.toLocaleString('en-IN')}{' '}
            <span className="text-xs font-normal text-slate-500">/ quintal</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Across {prices.length} reporting centers</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price Range</span>
            <BarChart3 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-xl font-bold text-slate-900">
            ₹{minInList.toLocaleString('en-IN')} - ₹{maxInList.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500 mt-1">Min to Max reported rate</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {realCount > 0 ? 'data.gov.in Live' : 'Data Mode'}
            </span>
            {realCount > 0 ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                Verified Real
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
                Demo Fallback
              </span>
            )}
          </div>
          <div className={`mt-2 text-2xl font-black ${realCount > 0 ? 'text-emerald-700' : 'text-amber-800'}`}>
            {realCount > 0 ? `${realCount} Live` : `${prices.length} APMCs`}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {realCount > 0 ? 'Live AGMARKNET arrivals' : 'Simulated APMC rates across states'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Arbitrage Opportunity</span>
            <CircleDollarSign className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 text-xl font-black text-purple-700">
            +₹{arbitrageData?.arbitrage_spread_per_qtl || 0}/qtl
          </div>
          <p className="text-xs text-slate-500 mt-1">Max price spread across mandis</p>
        </div>
      </div>

      {/* NAVIGATION TABS (Dedicated Segmented Control) */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab('table')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'table'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ListFilter size={16} />
            <span>Mandi Price List ({filteredPrices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('arbitrage')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'arbitrage'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
            }`}
          >
            <CircleDollarSign size={16} />
            <span>Best Mandi Arbitrage</span>
          </button>

          <button
            onClick={() => setActiveTab('trend')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'trend'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <BarChart3 size={16} />
            <span>Historical Price Trend ({trendData.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('alert')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'alert'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50'
            }`}
          >
            <Bell size={16} />
            <span>Price Alerts ({activeAlerts.length})</span>
          </button>
        </div>
      </div>

      {/* FILTER & COMMODITY SELECTION SECTION */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Commodity Chips */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
            Select Commodity
          </label>
          <div className="flex flex-wrap gap-2">
            {popularCrops.map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  selectedCrop.toLowerCase() === crop.toLowerCase()
                    ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-600/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {crop}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input & State Dropdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by mandi name, district, or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-[#FAFBF8] focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Filter State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {majorStates.map((st) => (
                <option key={st} value={st === 'All States' ? '' : st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ERROR & LOADING STATES */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-2" />
          <p className="text-sm font-semibold text-slate-700">Connecting to data.gov.in AGMARKNET Mandi Index...</p>
          <p className="text-xs text-slate-400 mt-1">Retrieving daily commodity arrivals across regional APMC markets</p>
        </div>
      ) : activeTab === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Market Arrivals for {selectedCrop}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-800">
                  {filteredPrices.length} APMCs
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Unit: ₹ per Quintal (100 kg) • Across {new Set(filteredPrices.map((p) => p.state)).size} Indian states
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-xs">
                {selectedState ? `Filtered: ${selectedState}` : 'All States Mandis'}
              </span>
            </div>
          </div>

          {filteredPrices.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Database className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p className="text-sm font-semibold text-slate-700">No mandi records match your current filter.</p>
              <p className="text-xs text-slate-400 mt-1">Try selecting a different commodity or state from the filter bar above.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Commodity</th>
                      <th className="px-6 py-4">Mandi / APMC</th>
                      <th className="px-6 py-4">State</th>
                      <th className="px-6 py-4 text-right">Min Rate</th>
                      <th className="px-6 py-4 text-right">Max Rate</th>
                      <th className="px-6 py-4 text-right font-black text-slate-900">Modal Rate</th>
                      <th className="px-6 py-4">Arrival Date</th>
                      <th className="px-6 py-4">Data Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredPrices.slice(0, visibleCount).map((p, idx) => (
                      <tr key={`${p.market_name}-${p.price_date}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">{p.crop_type}</td>
                        <td className="px-6 py-4 text-slate-800 font-semibold">{p.market_name}</td>
                        <td className="px-6 py-4 text-slate-600">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {p.state}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-slate-600">
                          ₹{parseFloat(p.min_price || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-slate-600">
                          ₹{parseFloat(p.max_price || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 text-right font-black text-emerald-700 text-base">
                          ₹{parseFloat(p.modal_price || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 font-mono">{p.price_date}</td>
                        <td className="px-6 py-4">
                          {p.source === 'real' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              data.gov.in (Live)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Demo Data
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* VIEW MORE APMCS CONTROLS */}
              <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                <div className="font-medium text-slate-700">
                  Showing <span className="font-bold text-slate-900">{Math.min(visibleCount, filteredPrices.length)}</span> of{' '}
                  <span className="font-bold text-slate-900">{filteredPrices.length}</span> APMC mandis across{' '}
                  <span className="font-bold text-slate-900">{new Set(filteredPrices.map((p) => p.state)).size}</span> states
                </div>

                <div className="flex items-center gap-2">
                  {filteredPrices.length > visibleCount && (
                    <>
                      <button
                        onClick={() => setVisibleCount((prev) => Math.min(prev + 8, filteredPrices.length))}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                      >
                        <ChevronDown className="w-4 h-4" />
                        <span>View More APMCs (+{Math.min(8, filteredPrices.length - visibleCount)})</span>
                      </button>
                      <button
                        onClick={() => setVisibleCount(filteredPrices.length)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl font-bold border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 shadow-xs transition-colors"
                      >
                        <span>View All ({filteredPrices.length})</span>
                      </button>
                    </>
                  )}

                  {visibleCount > 8 && (
                    <button
                      onClick={() => setVisibleCount(8)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 shadow-xs transition-colors"
                    >
                      <ChevronUp className="w-4 h-4" />
                      <span>Show Less (Collapse)</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      ) : activeTab === 'arbitrage' ? (
        /* INTER-MANDI ARBITRAGE VIEW */
        <div className="space-y-6">
          {arbitrageData && arbitrageData.best_mandi ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <CircleDollarSign className="w-5 h-5 text-purple-600" />
                    Inter-Mandi Arbitrage Finder for {selectedCrop}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Compares current rates across mandis to identify where you can sell for the highest net margin.
                  </p>
                </div>
                <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-purple-100 text-purple-800 border border-purple-200">
                  Spread: ₹{arbitrageData.arbitrage_spread_per_qtl}/qtl
                </span>
              </div>

              {/* Best vs Lowest Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-emerald-50/80 border-2 border-emerald-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Highest Paying Mandi</span>
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-600 text-white">Top Realization</span>
                  </div>
                  <div className="text-xl font-bold text-emerald-950">{arbitrageData.best_mandi.market_name}</div>
                  <div className="text-xs text-emerald-700 font-medium">{arbitrageData.best_mandi.state}</div>
                  <div className="text-3xl font-black text-emerald-800 pt-2">
                    ₹{arbitrageData.best_mandi.modal_price.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-normal text-emerald-600">/ quintal</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Lowest Mandi Rate</span>
                    <span className="text-xs text-slate-500 font-medium">Local Baseline</span>
                  </div>
                  <div className="text-xl font-bold text-slate-800">{arbitrageData.lowest_mandi.market_name}</div>
                  <div className="text-xs text-slate-500 font-medium">{arbitrageData.lowest_mandi.state}</div>
                  <div className="text-3xl font-black text-slate-700 pt-2">
                    ₹{arbitrageData.lowest_mandi.modal_price.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-normal text-slate-500">/ quintal</span>
                  </div>
                </div>
              </div>

              {/* Gross Profit Calculator for Lot */}
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-950 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                <div>
                  <strong>Potential Arbitrage Gain on a 10-Quintal (1,000 kg) Lot: </strong>
                  <span>Selling at {arbitrageData.best_mandi.market_name} yields up to </span>
                  <strong className="text-purple-700 text-base font-bold">+₹{arbitrageData.profit_potential_on_10qtl.toLocaleString('en-IN')}</strong>
                  <span> more than the lowest mandi.</span>
                </div>
              </div>

              {/* Top Ranked Mandis Table */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3">Top Ranked Mandis by Modal Price</h3>
                <div className="space-y-2">
                  {arbitrageData.top_mandis.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-slate-100 font-bold text-xs flex items-center justify-center text-slate-700">
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900">{m.market_name}</div>
                          <div className="text-xs text-slate-500">{m.state}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-emerald-700 text-base">₹{m.modal_price.toLocaleString('en-IN')}/qtl</div>
                        <div className="text-[11px] text-slate-400 font-mono">Date: {m.price_date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 py-8 text-center bg-white rounded-2xl border border-slate-200">
              Loading arbitrage data...
            </p>
          )}
        </div>
      ) : activeTab === 'trend' ? (
        /* TREND VIEW */
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Historical Price Trend: {selectedCrop}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Chronological modal price movement across reporting sessions</p>
            </div>
          </div>

          {loadingTrend ? (
            <div className="py-12 text-center">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-600 mb-2" />
              <p className="text-xs text-slate-500">Loading trend points...</p>
            </div>
          ) : trendData.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">No trend points available for this crop.</p>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                {trendData.map((item, idx) => {
                  const maxTrendPrice = Math.max(...trendData.map((t) => t.modal_price), 1)
                  const percentage = Math.round((item.modal_price / maxTrendPrice) * 100)
                  return (
                    <div key={`${item.price_date}-${idx}`} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {item.price_date}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 text-sm">₹{item.modal_price.toLocaleString('en-IN')}/qtl</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${item.source === 'real' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {item.source}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ALERTS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600" />
              Set Price Alert
            </h3>
            <form onSubmit={handleAddAlert} className="space-y-3 text-sm">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase">Crop</label>
                <select
                  value={targetCrop}
                  onChange={(e) => setTargetCrop(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300"
                >
                  {popularCrops.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase">Target Minimum Price (₹/qtl)</label>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-xs"
              >
                Create Alert
              </button>
            </form>
          </div>

          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Active Price Threshold Watchers</h3>
            <div className="space-y-3">
              {activeAlerts.map((alt, idx) => {
                const currentMandiPrice = avgModal || 2500
                const isTriggered = currentMandiPrice >= alt.target
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{alt.crop}</div>
                      <div className="text-xs text-slate-500">Target: ₹{alt.target}/qtl · Created: {alt.created}</div>
                    </div>
                    <div>
                      {isTriggered ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          🎯 Target Met (₹{currentMandiPrice}/qtl)
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
                          Watching (Current: ₹{currentMandiPrice}/qtl)
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
