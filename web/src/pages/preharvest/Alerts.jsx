import React, { useState, useEffect, useCallback } from 'react'
import { AlertTriangle, CheckCircle2, Volume2, Filter, ShieldCheck, VolumeX } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { playSirenSound } from '../../lib/soundEffects'

const DEFAULT_ALERTS = [
  { id: 'alert_01', animal: 'Wild Boar / Pig', camera: 'North Field Cam', zone: 'North Field', severity: 'High', time: '2 mins ago', status: 'Active' },
  { id: 'alert_02', animal: 'Stray Cattle / Cow', camera: 'East Barn Cam', zone: 'East Barn', severity: 'Medium', time: '14 mins ago', status: 'Active' },
  { id: 'alert_03', animal: 'Feral Dog', camera: 'South Gate Cam', zone: 'South Gate', severity: 'Low', time: '1 hour ago', status: 'Active' },
]

export default function Alerts() {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState(DEFAULT_ALERTS)
  const [loading, setLoading] = useState(false)
  const [filterSeverity, setFilterSeverity] = useState('All')
  const [sirenActiveToast, setSirenActiveToast] = useState(null)

  const handleResolve = (id) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'Resolved' } : a)))
  }

  const handleSirenClick = (animalName) => {
    playSirenSound(3.5)
    setSirenActiveToast(`🚨 High-Decibel Alert Siren Activated for ${animalName || 'Wild Animal'}! Dispatching sound...`)
    setTimeout(() => {
      setSirenActiveToast(null)
    }, 3500)
  }

  const alertList = Array.isArray(alerts) ? alerts : DEFAULT_ALERTS
  const filteredAlerts = alertList.filter(
    (a) => filterSeverity === 'All' || a.severity === filterSeverity
  )

  return (
    <div className="space-y-6">
      {sirenActiveToast && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-red-600 text-white font-extrabold text-xs shadow-2xl flex items-center gap-3 border border-red-400 animate-bounce">
          <Volume2 size={20} className="animate-spin text-yellow-300" />
          <span>{sirenActiveToast}</span>
          <button onClick={() => setSirenActiveToast(null)} className="ml-2 hover:opacity-80">
            <VolumeX size={16} />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">Active Animal Intrusion Alerts</h1>
          <p className="text-xs text-secondary mt-1 font-medium">Real-time perimeter intrusion log dispatched from edge camera detection events.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-secondary font-medium flex items-center gap-1">
            <Filter size={14} /> Filter Severity:
          </span>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-on-surface focus:outline-none"
          >
            <option value="All">All Severities</option>
            <option value="High">High Severity</option>
            <option value="Medium">Medium Severity</option>
            <option value="Low">Low Severity</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAlerts.map((alert, idx) => {
          const isHigh = alert.severity === 'High'
          const isMedium = alert.severity === 'Medium'
          const isResolved = alert.status === 'Resolved'

          return (
            <div key={alert.id || idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isHigh
                      ? 'bg-red-100 text-red-600'
                      : isMedium
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  <AlertTriangle size={20} />
                </div>

                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-bold text-on-surface">{alert.animal || 'Wild Animal'} Intrusion</h3>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        isHigh
                          ? 'bg-red-100 text-red-800'
                          : isMedium
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {alert.severity || 'Medium'} Severity
                    </span>
                  </div>
                  <p className="text-xs text-secondary font-medium mt-1">
                    {alert.camera} • Zone: {alert.zone} • {alert.time}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {isResolved ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                    <CheckCircle2 size={14} /> Resolved
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-on-surface text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Mark Resolved
                    </button>
                    <button
                      onClick={() => handleSirenClick(alert.animal)}
                      title="Click to trigger high-volume alarm siren"
                      className="px-3.5 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                    >
                      <Volume2 size={14} /> Trigger Siren
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
