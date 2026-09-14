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
import MarketPrices from './pages/market/MarketPrices'
import SaleWindow from './pages/market/SaleWindow'
import BuyerProfile from './pages/market/BuyerProfile'
import BuyerMatches from './pages/market/BuyerMatches'
import LogisticsSuggestion from './pages/market/LogisticsSuggestion'

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
              <Route path="/market/prices" element={<MarketPrices />} />
              <Route path="/market/sale-window" element={<SaleWindow />} />
              <Route path="/market/buyer-profile" element={<BuyerProfile />} />
              <Route path="/market/buyer-matches" element={<BuyerMatches />} />
              <Route path="/market/logistics" element={<LogisticsSuggestion />} />
              <Route path="/cameras" element={<Cameras />} />
              <Route path="/detections" element={<Detections />} />
              <Route path="/detections/:id" element={<DetectionDetail />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
