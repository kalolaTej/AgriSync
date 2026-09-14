import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

// Core Dashboard & Pre-Harvest Components
import Dashboard from './pages/Dashboard';
import Alerts from './pages/preharvest/Alerts';
import Cameras from './pages/preharvest/Cameras';

// Clean Fullscreen Spec Renderer
const SpecViewer = ({ srcPath, title }) => {
  return (
    <div className="w-full h-screen bg-surface flex flex-col overflow-hidden">
      <iframe 
        src={`/${srcPath}`} 
        title={title}
        className="w-full h-full border-none"
      />
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Portal & Onboarding Routes */}
          <Route path="/" element={<SpecViewer srcPath="layout/layout/agrisync_public_portal/code.html" title="AgriSync Public Portal" />} />
          <Route path="/how-it-works" element={<SpecViewer srcPath="layout/layout/agrisync_how_it_works/code.html" title="How AgriSync Works" />} />
          <Route path="/register" element={<SpecViewer srcPath="layout/layout/farmer_registration_onboarding/code.html" title="Farmer Onboarding & e-KYC" />} />

          {/* Farmer Overview */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['farmer', 'public', 'apmc', 'buyer', 'driver']}>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />

          {/* Risk & Field (Animal Intrusion System) */}
          <Route 
            path="/alerts" 
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <DashboardLayout>
                  <Alerts />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cameras" 
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <DashboardLayout>
                  <Cameras />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route path="/detections" element={<SpecViewer srcPath="layout/layout/crop_protection_field_incidents/code.html" title="Detections Log" />} />
          <Route path="/protect/incidents" element={<SpecViewer srcPath="layout/layout/crop_protection_field_incidents/code.html" title="Crop Protection Incidents" />} />
          <Route path="/protect/analytics" element={<SpecViewer srcPath="layout/layout/crop_protection_incident_analytics/code.html" title="Protection Incident Analytics" />} />

          {/* Commerce & Mandi */}
          <Route path="/produce" element={<SpecViewer srcPath="layout/layout/my_produce_harvest_batches/code.html" title="My Produce & Harvest Batches" />} />
          <Route path="/sell/advisory" element={<SpecViewer srcPath="layout/layout/selling_window_advisory/code.html" title="Selling Window Advisory" />} />
          <Route path="/sell/buyers" element={<SpecViewer srcPath="layout/layout/verified_buyer_matches_contracts/code.html" title="Verified Buyer Matches" />} />
          <Route path="/market" element={<SpecViewer srcPath="layout/layout/market_prices/code.html" title="Agmarknet Mandi Market Prices" />} />
          <Route path="/market/:id" element={<SpecViewer srcPath="layout/layout/market_detail_pimpalgaon_apmc/code.html" title="Pimpalgaon APMC Market Profile" />} />

          {/* Fulfillment & Finance */}
          <Route path="/storage" element={<SpecViewer srcPath="layout/layout/storage_discovery_warehousing/code.html" title="Storage & Warehousing" />} />
          <Route path="/transport" element={<SpecViewer srcPath="layout/layout/transport_options_rural_drayage/code.html" title="Rural Transport & Drayage" />} />
          <Route path="/transactions" element={<SpecViewer srcPath="layout/layout/my_transactions_settlements/code.html" title="My Transactions & Settlements" />} />
          <Route path="/transactions/:id" element={<SpecViewer srcPath="layout/layout/transaction_detail_sauda_2024_8842/code.html" title="Transaction Detail #SAUDA-2024-8842" />} />
          <Route path="/settings" element={<SpecViewer srcPath="layout/layout/settings_farm_profile/code.html" title="Settings & Farm Profile" />} />

          {/* APMC Mandi Operator Routes */}
          <Route path="/mandi/queue" element={<SpecViewer srcPath="layout/layout/mandi_procurement_live_queue/code.html" title="Live Mandi Queue" />} />
          <Route path="/mandi/gate" element={<SpecViewer srcPath="layout/layout/apmc_gate_security_anpr_barrier_terminal/code.html" title="APMC Gate Security ANPR Kiosk" />} />
          <Route path="/mandi/weighbridge" element={<SpecViewer srcPath="layout/layout/apmc_mandi_yard_weighbridge_operator_console/code.html" title="Weighbridge Operator Console" />} />
          <Route path="/mandi/quality" element={<SpecViewer srcPath="layout/layout/apmc_quality_assayer_nir_mobile_inspection/code.html" title="NIR Quality Assayer Mobile Tool" />} />

          {/* Buyer Routes */}
          <Route path="/buyer/bids" element={<SpecViewer srcPath="layout/layout/institutional_buyer_procurement_bids/code.html" title="Procurement Bids & Purchase Orders" />} />

          {/* Driver Route */}
          <Route path="/driver/gate-pass" element={<SpecViewer srcPath="layout/layout/agrisync_driver_gate_pass_apmc_fast_track/code.html" title="Driver Fast-Track Gate Pass" />} />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
