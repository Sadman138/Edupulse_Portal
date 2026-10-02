# EduPulse — Academic Performance & Monitoring Platform
### Metropolitan University &bull; Department of Computer Science & Engineering
**Team Delta (CSE 58th Batch):** Raiyan Chowdhury (241-115-210), Fathin Sadman (241-115-211), Md Al Mekdad Ajmol (241-115-223)

---

## 📂 Repository Architecture

This repository is organized into two primary folders:

```
edupulse-portal/
├── frontend/             # Complete React 19 + TypeScript + Vite + Tailwind Client
│   ├── src/              # All Pages, Components, Context, Themes & Types
│   └── README.md         # Frontend Documentation
│
├── backend/              # Node.js + Express API Server
│   ├── server.ts         # Authentication, QR Scanning & Risk Telemetry Endpoints
│   ├── package.json      # Backend Dependencies
│   └── README.md         # Backend Documentation
│
├── package.json          # Root Scripts & Dependencies
├── vite.config.ts        # Vite Bundler Configuration
└── index.html            # Main Web Entry Point
```

---

## 🚀 Quick Start Guide

### 1. Run the Frontend (Client)
```bash
npm install
npm run dev
```
Access the application at `http://localhost:3000`.

### 2. Run the Backend API
```bash
cd backend
npm install
npm run dev
```
API runs on `http://localhost:5000`.

---

## 🎯 Current Milestone: Weeks 1–4 Complete
- ✅ **Week 1:** Problem Definition & Early Warning Academic Rules
- ✅ **Week 2:** Responsive Design System & Metropolitan University Theming
- ✅ **Week 3:** Student Academic Dashboard, SGPA/CGPA Telemetry & Red Alert Status
- ✅ **Week 4:** QR Scanner, Routine Tracker, Assignment & Slide Downloads, Notice Board, Co-Curricular & Skills
- 🔜 **Week 5–8:** Teacher Module (Live QR Generator, Marks Entry) & Admin Console
