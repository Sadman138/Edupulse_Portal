# EduPulse — Frontend Client

This directory contains the complete client-side Single Page Application (SPA) for **EduPulse (Metropolitan University)** built with React 19, TypeScript, Vite, and Tailwind CSS.

## 📁 Directory Structure
```
frontend/
└── src/
    ├── App.tsx                   # Core Application Container & Routing
    ├── main.tsx                  # React DOM Entry Point
    ├── index.css                 # Global CSS & Tailwind Theme Directives
    ├── types.ts                  # Domain TypeScript Types & Interfaces
    ├── theme/
    │   └── epTheme.ts            # University Palette & Custom Theme Tokens
    ├── data/
    │   └── mockData.ts           # Academic Data, Demo Students & Profiles
    ├── context/
    │   └── AppContext.tsx        # React Context & State Management
    ├── components/
    │   ├── auth/                 # Login, Registration & Account Switcher
    │   ├── common/               # Routine Tracker, Badges, Modals
    │   └── layout/               # Header, Sidebar & Institutional Footer
    └── pages/
        └── student/              # Weeks 1–4 Student Academic Modules
```

## 🚀 Running the Frontend
```bash
npm install
npm run dev
```
Port: `http://localhost:3000`
