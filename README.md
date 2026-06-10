# AffordMed Assessment Suite

A high-performance, responsive microservice aggregation platform built as a professional recruitment assessment suite. It consolidates four critical enterprise engineering solutions requested for the AffordMed evaluations.

---
🚀 Live Demo Link
The application has been compiled, validated, and is running live under fully secure server-side container orchestration:

Live Deployment Platform URL:http://localhost:3000

---

## 🎓 Scholar & Candidate Information
- **Name:** Ritik Varshney
- **Email:** [ritik.varshney_cs23@gla.ac.in](mailto:ritik.varshney_cs23@gla.ac.in) / [rvarshney926@gmail.com](mailto:rvarshney926@gmail.com)
- **Institution:** GLA University, Mathura
- **Target Repository:** [https://github.com/RITIK926/2315001858---Afford-medical-technologies-assessment-](https://github.com/RITIK926/2315001858---Afford-medical-technologies-assessment-)

---

## 🛠️ Folder & Repository Structure
All required folders are organized meticulously to fulfill the core frontend/backend assessment mandates:
* `/logging_middleware/` : Deep response interception middleware with response-time tracing, payload logging, and status metrics.
* `/notification_system_design.md` : Distributed scaling architecture design covering Kafka decoupled routing, Redis caching, and circuit-breaking.
* `/notification_app_be/` : Microservice controller with preference filter gates, mock devices register, and latency simulators.
* `/notification_app_fe/` : Interactive premium control board for dispatch, filters, dynamic channel priority matching, and trace logging.
* `/src/components/` : Feature-complete layouts for:
  - `AverageCalculator.tsx` : Sliding-window average generator with interactive state monitoring.
  - `ProductsAggregator.tsx` : E-commerce dynamic directory engine handling sorting, pagination, and categorizations.
  - `TrainScheduler.tsx` : Railways scheduling departures board with live timetable modification, sorting, and reservations.

---

## 🍱 Consolidating 4 Enterprise Microservices

### 1. Sliding Window Number Generator & Calculator
* **Frontend Component:** `/src/components/AverageCalculator.tsx`
* **Server Logic:** `/server.ts`
* **Features:**
  - Evaluates primes (`p`), fibonacci (`f`), even (`e`), and random (`r`) incoming lists.
  - Strictly guarantees state validation with a configurable maximum window size (`WINDOW_SIZE = 10`).
  - Displays dynamic analytics including raw window state, pre-states, post-states, and real-time average delta changes via responsive Recharts graphs.

### 2. Multi-Store E-Commerce Top Products Aggregator
* **Frontend Component:** `/src/components/ProductsAggregator.tsx`
* **Server Logic:** `/server.ts` (API mock & pagination routing)
* **Features:**
  - Aggregates catalogs across multiple virtual storefronts (AMZ, FLIP, SNP, MYN, AZO).
  - Handles dynamic client-side sorting (by Rating, Price, Discount), infinite filtering, pagination, and product detail drawer models.
  - Built with responsive grids and interactive Lucide visual iconography.

### 3. Railways Scheduler Departures Board
* **Frontend Component:** `/src/components/TrainScheduler.tsx`
* **Features:**
  - Shows comprehensive schedules sorted in real-time by dynamic parameters (Delay offset, Price, Seats Availability).
  - Implements an interactive ticket-booking simulator with detailed invoice calculations, including automated tax breakdowns and dynamic seat updates.
  - Clear alerts for delayed departures and seat quotas.

### 4. Distributed Multi-Channel Notification Engine
* **Frontend Component:** `/notification_app_fe/NotificationDashboard.tsx`
* **Backend Microservice:** `/notification_app_be/index.ts`
* **Features:**
  - Handles standard and high-priority delivery tracing across **Email, SMS, Push, and Slack** channels.
  - Honoring user preferences (DND dynamic switches) to block/allow dispatches conditionally.
  - Simulates dynamic response times (ranging from 40ms to 200ms) with detailed trace logging.

---

## ⚡ Setup, Installation & Launch

### Prerequisites
* Fully written in **TypeScript** using **React (Vite)** on the frontend and **Express** on the backend.
* Powered by **Tailwind CSS v4** styling and **Motion** animations.

### Installation
```bash
# 1. Install all dependencies
npm install

# 2. Boot dev server (Express Node server + Vite middleware)
npm run dev
```

### Production Build
```bash
# Compile and build both client-side bundles and standalone server outputs
npm run build

# Start production server
npm run start
```

---

## 📤 Professional GitHub Push Guide
To push this complete evaluated code to your designated GitHub repository:

1. **Option A: Export via AI Studio Menu (Recommended)**
   - Click the **Settings/Export** button at the top-right of your workspace in AI Studio.
   - Choose **Export to GitHub** or sync with your account representation.

2. **Option B: Manual Git Push**
   - Click **Export as ZIP** from the top-right menu to download the repository bundle.
   - Unzip the files on your local machine.
   - Run the following terminal actions:
     ```bash
     cd your-unzipped-folder
     git init
     git add .
     git commit -m "feat: complete AffordMed assessment suite with folders"
     git remote add origin https://github.com/RITIK926/2315001858---Afford-medical-technologies-assessment-
     git branch -M main
     git push -u origin main
     ```
