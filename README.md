# AgriSync — Post-Harvest Market Intelligence Platform

AgriSync is a comprehensive post-harvest agricultural intelligence and advisory platform built to maximize farmer realization through real-time government mandi price tracking, rule-based sale-window advisory, institutional buyer/FPO matching, and storage facility logistics recommendations.

---

## 🚀 Key Modules & Capabilities

### 1. 📈 Mandi Market Prices & Inter-Mandi Arbitrage
- **Live Government AGMARKNET Integration**: Aggregates daily commodity prices across all reporting APMC mandis via `data.gov.in` (Catalog ID: `9ef84268-d588-465a-a308-a864a43d0070`).
- **Inter-Mandi Arbitrage Finder**: Compares cross-market rates across India to identify high-spread mandis and calculate gross profit upside per quintal.
- **Price Threshold Watcher**: Allows farmers to set target prices and monitor live fulfillment status.
- **Fail-Safe Caching & Fallback**: Automatically serves labeled historical mock data (`source: "mock"`) if the government API experiences network downtime or rate limits.

### 2. ⏱️ Sale-Window & Spoilage Advisory
- **Rule-Based Decision Engine**: Scores price trend momentum ($W=45\%$), perishability shelf-life urgency ($W=35\%$), and price volatility ($W=20\%$) to recommend **"Sell Now"** vs **"Hold N Days"**.
- **Interactive Day-by-Day Simulator**: Simulates custom lot volume, storage conditions (Ambient, Ventilated, Cold Storage), and weather factors (Hot/Monsoon Humid, Cool Dry) to calculate projected net revenue versus estimated physical spoilage loss (kg).

### 3. 👥 Smart Buyer & FPO Matching
- **Institutional Procurement Demand**: Buyers register procurement needs (crop type, min quantity kg, target grade, location).
- **Multi-Factor Weighted Matching**: Evaluates produce lots against buyer profiles (40% Crop Match, 25% Quantity Fit, 20% Grade Compatibility, 15% Location Proximity).
- **Direct WhatsApp Trade Slip Generator**: Formats matched lot specifications into an instant trade inquiry for fast messaging.

### 4. 🚚 Logistics & Storage Advisory
- **Multi-Attribute Facility Scoring**: Recommends temperature-controlled cold storages for perishable crops and economical high-capacity warehouses for bulk grains.
- **Storage Financial ROI Calculator**: Computes whether paying for cold storage rental over $N$ days yields a net profit after expected mandi appreciation.

---

## 🛠️ Tech Stack & Architecture

- **Backend**: Node.js, Express, Supabase (PostgreSQL), native `fetch` client with AGMARKNET API.
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Router v7.
- **Database**: PostgreSQL / Supabase with migrations (`backend/migrations/004_market_buyer_logistics.sql`).

---

## 🏃 Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
node server.js
```
*Backend runs on `http://localhost:5000` (Health check: `http://localhost:5000/health`)*

### 2. Frontend Setup
```bash
cd web
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

### 3. Run Automated Tests
```bash
cd backend
node test/marketIntelligence.test.js
```

---

## 📜 API Contract Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/prices?crop=<crop>&state=<state>` | Mandi commodity prices with `source: 'real'/'mock'` |
| `GET` | `/api/prices/trend?crop=<crop>&market=<market>` | Chronological price trajectory array |
| `GET` | `/api/prices/arbitrage?crop=<crop>` | Inter-mandi price spread & top paying markets |
| `GET` | `/api/lots/:id/sale-window` | Rule-based "Sell Now" / "Hold N Days" decision |
| `POST` | `/api/sale-window/simulate` | Day-by-day revenue vs spoilage loss simulation |
| `POST` | `/api/buyer-profile` | Register buyer procurement demand |
| `GET` | `/api/lots/:id/matches` | Ranked buyer matches for a produce lot |
| `GET` | `/api/buyers/:id/matches` | Ranked lots for a buyer profile |
| `PATCH` | `/api/matches/:id` | Update match status (`interested`, `accepted`, `rejected`) |
| `GET` | `/api/lots/:id/logistics-suggestion` | Top storage facility & ranked alternatives |
| `POST` | `/api/logistics/calculate-roi` | Cold storage financial net ROI calculator |
