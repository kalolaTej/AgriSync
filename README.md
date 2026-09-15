# 🌾 AgriSync — Pre-Harvest ("Protect") Module

> **Real-Time Animal Intrusion Detection, Deterrent Triggering, Crop-Loss Incident Reporting & Intrusion Analytics**  
> **Author / Lead Developer**: Aayush  
> **Branch**: `feature/aayush-preharvest-ai`  
> **Repository**: [https://github.com/kalolaTej/SIH26193.git](https://github.com/kalolaTej/SIH26193.git)

---

## 📌 Project Overview

**AgriSync** is an end-to-end smart farm protection platform. The **Pre-Harvest ("Protect")** module focuses on crop protection against wild animal intrusions (cows, wild boars, dogs, goats, etc.) using computer vision, automated deterrent hardware, incident reporting, and historical frequency analytics.

### Key Capabilities
- **Real-Time Animal Intrusion Detection**: Powered by YOLO11 object detection running on live camera feeds or Android IP Webcam streams.
- **Automated Deterrent Controller**: Triggers ESP32 hardware strobes and sirens over Wi-Fi (HTTP), with seamless fallback to high-decibel PC speaker sirens (`winsound`).
- **Crop-Loss Incident Reporting**: Enables farmers to confirm and quantify crop damage linked to intrusion events or manual field observations.
- **Intrusion Frequency Analytics**: Aggregates historical intrusion events by perimeter zone and daily time buckets for data-driven farm management.

---

## 🏗️ Repository Architecture

```
AnimalIntrusionSystem/
│
├── ai/                                  # AI Detection & Deterrent Controller Engine
│   ├── detect.py                        # Core YOLO11 detection pipeline & Socket.io upload client
│   ├── config.py                        # Configuration parser (.env & camera sources)
│   ├── esp32_controller.py              # Thread-safe ESP32 HTTP trigger & PC sound fallback
│   ├── esp32_firmware.ino               # ESP32 C++ firmware (Wokwi simulation support)
│   ├── yolo11n.pt / yolo11s.pt          # Pretrained YOLO model weights
│   └── test_video/cows.mp4              # Controlled demo video fallback source
│
├── esp32/                               # Hardware Firmware Files
│   └── esp32_deterrent.ino              # Production ESP32 firmware (Strobe GPIO 4, Buzzer GPIO 18)
│
├── backend/                             # Node.js + Express REST API & Socket.io Service
│   ├── controllers/
│   │   ├── incidentController.js        # Crop-loss incident reporting & analytics APIs (NEW)
│   │   ├── detectionController.js       # Ingestion & history of animal detections
│   │   ├── cameraController.js          # Camera heartbeat & zone management
│   │   └── farmController.js            # Farm node configuration
│   ├── migrations/
│   │   └── 003_crop_loss_incidents.sql  # Database table schema migration (NEW)
│   ├── routes/
│   │   ├── incidents.js                 # Incident & Analytics routes (NEW)
│   │   └── detections.js / cameras.js   # Existing backend API routes
│   └── server.js                        # Express server entry point & Socket.io hub
│
└── web/                                 # React + Vite + Tailwind Web Dashboard
    └── src/pages/preharvest/
        ├── IncidentReport.jsx           # Farmer crop-loss incident reporting UI (NEW)
        └── IncidentAnalytics.jsx        # Intrusion frequency analytics dashboard UI (NEW)
```

---

## ⚡ Key Features & API Contracts

### 1. Crop-Loss Incident Reporting (`/api/incidents`)

#### `POST /api/incidents`
Log a crop-loss incident (optionally linked to a detection event).
- **Auth**: Authenticated Farmer (JWT)
- **Request Body**:
  ```json
  {
    "farm_id": "29b9b72f-0d43-4a23-9b04-dc9e14180f2a",
    "detection_id": "uuid-or-null",
    "crop_type": "Wheat",
    "affected_area_estimate": "0.5 acres",
    "notes": "Damage observed near north boundary fence"
  }
  ```
- **Response (`201 Created`)**:
  ```json
  {
    "id": "ed47bbab-d8c9-4786-a9c5-d6c9d251600e",
    "farm_id": "29b9b72f-0d43-4a23-9b04-dc9e14180f2a",
    "detection_id": null,
    "crop_type": "Wheat",
    "affected_area_estimate": "0.5 acres",
    "notes": "Damage observed near north boundary fence",
    "reported_at": "2026-09-13T17:18:29.393Z",
    "confirmed_by_farmer": true
  }
  ```

#### `GET /api/incidents?farm_id=<uuid>`
List reported crop-loss incidents for a specific farm.
- **Response (`200 OK`)**: Array of incident objects.

---

### 2. Intrusion Frequency Analytics (`/api/incidents/analytics`)

#### `GET /api/incidents/analytics?farm_id=<uuid>`
Aggregates historical detection counts grouped by farm zone and daily period.
- **Response (`200 OK`)**:
  ```json
  {
    "by_zone": [
      { "zone": "North Field", "count": 12 },
      { "zone": "East Barn", "count": 7 }
    ],
    "by_period": [
      { "period": "2026-09-12", "count": 3 },
      { "period": "2026-09-13", "count": 5 }
    ]
  }
  ```

---

## 🚀 Getting Started & Local Setup

### 1. Prerequisites
- **Node.js**: v18+
- **Python**: v3.9+ with `opencv-python`, `ultralytics`, `requests`, `python-dotenv`
- **Database**: Supabase / PostgreSQL instance

---

### 2. Backend API Setup
```bash
cd backend
npm install
npm run dev
```
*Backend runs on `http://localhost:5000`.*

---

### 3. Web Dashboard Setup
```bash
cd web
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

### 4. AI Detection Engine Setup
```bash
cd ai
pip install -r requirements.txt
python detect.py
```

---

## 📱 Demo Setup Guide (Demo Day Instructions)

### Option A: Live Android Camera Feed (IP Webcam App)
1. Install **IP Webcam** on an Android device and tap **Start Server**.
2. Note the stream URL displayed on phone screen (e.g., `http://192.168.1.50:8080/video`).
3. Point phone camera at a video screen displaying farm animals.
4. Set `CAMERA_SOURCE=http://192.168.1.50:8080/video` in `ai/.env` or run:
   ```bash
   python detect.py --source http://192.168.1.50:8080/video
   ```

### Option B: Controlled Demo Video Fallback
If live camera access is limited on demo day, use the included controlled demo video source:
```bash
python detect.py --source test_video/cows.mp4
```
> *Note: `cows.mp4` is a real sample video included for reproducible testing.*

---

## ⚡ ESP32 Deterrent & Wokwi Simulation Setup

### Hardware Pinout Configuration
- **Strobe LED Pin**: `GPIO 4`
- **Siren Buzzer Pin**: `GPIO 18`
- **Status LED Pin**: `GPIO 2`
- **DFPlayer RX / TX**: `GPIO 16 / GPIO 17`
- **WiFi SSID**: `Wokwi-GUEST`

### Wokwi Simulator Execution
1. Open [Wokwi ESP32 Simulator](https://wokwi.com/).
2. Load firmware from `esp32/esp32_deterrent.ino`.
3. Set `ESP32_IP=<wokwi_ip>` in `ai/.env`.
4. When YOLO detects an animal, `detect.py` sends an HTTP GET trigger to `http://<wokwi_ip>/trigger?animal=cow`, activating the flashing LED and buzzer siren frequency. If ESP32 is offline, local PC speaker sirens auto-trigger as fallback.

---

## 📜 Commit Standards

Follow conventional commits format:
- `fix(detect): resolve stride warning and stabilize detection pipeline`
- `feat(incidents): implement crop-loss incident reporting endpoint and migration`
- `feat(analytics): add intrusion frequency aggregation endpoint and preharvest pages`
- `chore(esp32): update firmware with Wokwi hardware simulation pinout and frequencies`
