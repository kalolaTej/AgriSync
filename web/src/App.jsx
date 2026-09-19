import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/DashboardLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Cameras from './pages/Cameras'
import Detections from './pages/Detections'
import DetectionDetail from './pages/DetectionDetail'
import Alerts from './pages/Alerts'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

// Pre-Harvest Pages
import PreharvestIncidentReport from './pages/preharvest/IncidentReport'
import PreharvestIncidentAnalytics from './pages/preharvest/IncidentAnalytics'

// Post-Harvest Pages (Krushn)
import CreateLot from './pages/produce/CreateLot'
import LotDetail from './pages/produce/LotDetail'
import ProcurementCentres from './pages/produce/ProcurementCentres'
import SlotBooking from './pages/produce/SlotBooking'
import QueueStatus from './pages/produce/QueueStatus'
import Transactions from './pages/produce/Transactions'
import MandiPrices from './pages/produce/MandiPrices'
import BuyerMatches from './pages/produce/BuyerMatches'
import ProduceSaleWindow from './pages/produce/SaleWindow'
import ProduceIncidents from './pages/produce/Incidents'
import ProduceReportIncident from './pages/produce/ReportIncident'
import ProduceAnalytics from './pages/produce/Analytics'

// Market Intelligence & Logistics Pages (Tej)
import MarketPrices from './pages/market/MarketPrices'
import MarketSaleWindow from './pages/market/SaleWindow'
import BuyerProfile from './pages/market/BuyerProfile'
import MarketBuyerMatches from './pages/market/BuyerMatches'
import LogisticsSuggestion from './pages/market/LogisticsSuggestion'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected dashboard routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Pre-Harvest Intrusion & Camera Routes */}
              <Route path="/cameras" element={<Cameras />} />
              <Route path="/detections" element={<Detections />} />
              <Route path="/detections/:id" element={<DetectionDetail />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/preharvest/incidents/report" element={<PreharvestIncidentReport />} />
              <Route path="/preharvest/incidents/analytics" element={<PreharvestIncidentAnalytics />} />

              {/* Post-Harvest Core & Quality Routes */}
              <Route path="/produce/create" element={<CreateLot />} />
              <Route path="/produce/:id" element={<LotDetail />} />
              <Route path="/produce/:id/sale-window" element={<ProduceSaleWindow />} />
              <Route path="/produce/:id/incidents" element={<ProduceIncidents />} />
              <Route path="/produce/:id/incidents/report" element={<ProduceReportIncident />} />
              <Route path="/analytics" element={<ProduceAnalytics />} />
              <Route path="/mandi" element={<MandiPrices />} />
              <Route path="/matches/:lotId" element={<BuyerMatches />} />
              <Route path="/procurement" element={<ProcurementCentres />} />
              <Route path="/procurement/:centreId/slots" element={<SlotBooking />} />
              <Route path="/procurement/:centreId/queue" element={<QueueStatus />} />
              <Route path="/transactions/:lotId" element={<Transactions />} />

              {/* Market Intelligence & Logistics Routes */}
              <Route path="/market/prices" element={<MarketPrices />} />
              <Route path="/market/sale-window" element={<MarketSaleWindow />} />
              <Route path="/market/buyer-profile" element={<BuyerProfile />} />
              <Route path="/market/buyer-matches" element={<MarketBuyerMatches />} />
              <Route path="/market/logistics" element={<LogisticsSuggestion />} />
            </Route>
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
