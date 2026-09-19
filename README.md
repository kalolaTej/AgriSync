# 🌾 AgriSync — "Guard the Harvest. Grow the Value."

> **SIH 2026 Problem Statement**: SIH26193  
> **Repository**: [https://github.com/kalolaTej/SIH26193.git](https://github.com/kalolaTej/SIH26193.git)  
> **Unified Architecture**: Pre-Harvest Crop Protection + Post-Harvest Quality & Procurement + Market Intelligence & Logistics

---

## 📌 Platform Overview

**AgriSync** is an end-to-end agricultural protection, post-harvest quality assurance, procurement, and market intelligence platform.

### Core Modules:
1. **🛡️ Pre-Harvest Protection ("Protect")**:
   - Real-time animal intrusion detection powered by **YOLO11n** edge computer vision.
   - Automated hardware deterrent controller triggering **ESP32** strobes, sirens, and Wokwi simulation over Wi-Fi with local fallback.
   - Crop-loss damage incident reporting and zone/period intrusion frequency analytics.

2. **📦 Post-Harvest Quality & Procurement ("Grow")**:
   - Automated produce grading microservice using **Classical OpenCV Computer Vision** (HSV color analysis, adaptive blemish thresholding, contour shape metrics).
   - Produce lot lifecycle management (listed, booked, matched, sold).
   - Procurement centre discovery, time-slot reservation, and live FIFO queue tracking powered by **Socket.IO**.
   - Procurement transaction tracking and post-harvest incident reporting & analytics.

3. **📈 Market Intelligence & Logistics ("Value")**:
   - Live APMC mandi price tracking via Government **AGMARKNET / data.gov.in** API with fail-safe mock fallback.
   - Rule-based **Sale-Window & Spoilage Advisory** calculating price trend momentum, shelf-life urgency, and revenue vs. spoilage.
   - Rule-based **Buyer & FPO Matching** connecting farmers with verified institutional purchasers.
   - Cold storage & warehouse logistics suggestion engine with financial ROI calculator.

---

## 🏗️ Repository Architecture

```
SIH26193/
├── ai/                                  # Pre-Harvest AI Detection Engine
│   ├── detect.py                        # YOLO11n detection pipeline
│   ├── config.py                        # Configuration parser (.env & camera streams)
│   ├── esp32_controller.py              # ESP32 HTTP trigger & speaker fallback
│   └── esp32_firmware.ino               # ESP32 C++ firmware (Wokwi simulation)
│
├── esp32/                               # Hardware Deterrent Firmware
│   └── esp32_deterrent.ino              # Production ESP32 firmware (Strobe & Siren)
│
├── grading-service/                     # Post-Harvest OpenCV Produce Grading Microservice
│   ├── main.py                          # FastAPI application (POST /grade)
│   ├── grading.py                       # Classical OpenCV rule-based grading pipeline
│   └── requirements.txt                 # Python dependencies (OpenCV, FastAPI, Uvicorn)
│
├── backend/                             # Unified Express REST API & Socket.io Hub
│   ├── controllers/                     # Pre-Harvest, Post-Harvest & Market Controllers
│   ├── migrations/                      # Database Schema Migrations (001-004)
│   ├── routes/                          # REST API Endpoints with RBAC
│   ├── services/                        # Supabase client, AGMARKNET service, Matching engine
│   └── server.js                        # Express server entry point & Socket.io hub
│
└── web/                                 # React + Vite + Tailwind CSS Web Dashboard
    └── src/
        ├── components/                  # Navigation, Layout & Dashboard components
        ├── context/AuthContext.jsx      # Authentication & RBAC context
        └── pages/
            ├── preharvest/              # Pre-Harvest Incident reporting & analytics
            ├── produce/                 # Produce lots, OpenCV grading, Procurement, Queue
            └── market/                  # Mandi prices, Sale-Window, Buyer Matching, Logistics
```

---

## 🚀 Getting Started & Local Setup

### 1. Backend API Setup
```bash
cd backend
npm install
npm run dev
```
*Backend runs on `http://localhost:5000` (Health: `http://localhost:5000/health`)*

### 2. Classical OpenCV Grading Microservice Setup
```bash
cd grading-service
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```
*Grading microservice runs on `http://127.0.0.1:8001` (Docs: `http://127.0.0.1:8001/docs`)*

### 3. Web Dashboard Setup
```bash
cd web
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

### 4. Pre-Harvest AI Detection Engine
```bash
cd ai
pip install -r requirements.txt
python detect.py
```

---

## 📜 Key API Endpoints Summary

### Pre-Harvest & Deterrent Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/detections` | Ingest animal intrusion event |
| `GET` | `/api/detections` | Retrieve detection feed & logs |
| `POST` | `/api/incidents` | Report pre-harvest crop loss incident |
| `GET` | `/api/incidents/analytics` | Intrusion frequency by zone & period |

### Post-Harvest Quality & Procurement Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/lots` | Register produce lot & trigger OpenCV grading |
| `GET` | `/api/lots` | List farmer produce lots |
| `GET` | `/api/procurement` | Discover procurement centres |
| `POST` | `/api/procurement/book-slot` | Reserve procurement time-slot |
| `GET` | `/api/procurement/queue/:centre_id` | Live FIFO queue status |
| `GET` | `/api/transactions/:lot_id` | Procurement settlement status |
| `GET` | `/api/analytics` | Post-harvest KPI metrics |

### Market Intelligence & Logistics Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/prices?crop=<crop>&state=<state>` | Mandi commodity prices (`real`/`mock`) |
| `GET` | `/api/prices/arbitrage?crop=<crop>` | Inter-mandi price spread & arbitrage |
| `GET` | `/api/lots/:id/sale-window` | Rule-based "Sell Now" / "Hold N Days" decision |
| `POST` | `/api/sale-window/simulate` | Day-by-day revenue vs spoilage simulation |
| `GET` | `/api/lots/:id/matches` | Ranked buyer & FPO matches |
| `GET` | `/api/lots/:id/logistics-suggestion` | Storage facility recommendation & ROI |
