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

import CreateLot from './pages/produce/CreateLot'
import LotDetail from './pages/produce/LotDetail'
import ProcurementCentres from './pages/produce/ProcurementCentres'
import SlotBooking from './pages/produce/SlotBooking'
import QueueStatus from './pages/produce/QueueStatus'
import Transactions from './pages/produce/Transactions'
import MandiPrices from './pages/produce/MandiPrices'
import BuyerMatches from './pages/produce/BuyerMatches'
import SaleWindow from './pages/produce/SaleWindow'
import Incidents from './pages/produce/Incidents'
import ReportIncident from './pages/produce/ReportIncident'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* public authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* protected dashboard routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cameras" element={<Cameras />} />
              <Route path="/detections" element={<Detections />} />
              <Route path="/detections/:id" element={<DetectionDetail />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/produce/create" element={<CreateLot />} />
              <Route path="/produce/:id" element={<LotDetail />} />
              <Route path="/produce/:id/sale-window" element={<SaleWindow />} />
              <Route path="/produce/:id/incidents" element={<Incidents />} />
              <Route path="/produce/:id/incidents/report" element={<ReportIncident />} />
              <Route path="/mandi" element={<MandiPrices />} />
              <Route path="/matches/:lotId" element={<BuyerMatches />} />
              <Route path="/procurement" element={<ProcurementCentres />} />
              <Route path="/procurement/:centreId/slots" element={<SlotBooking />} />
              <Route path="/procurement/:centreId/queue" element={<QueueStatus />} />
              <Route path="/transactions/:lotId" element={<Transactions />} />
            </Route>
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
