/**
 * EduPulse Full-Stack MERN Server Entry Point
 * Port 3000 (Express API + Vite Dev Server Middlewares)
 * Department of Computer Science & Engineering, Metropolitan University
 */

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env'), override: true });
dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });

import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import app from './backend/src/server';
import connectDB from './backend/src/config/db';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function startServer() {
  console.log('[EduPulse MERN] Starting full-stack server on port', PORT);

  // 1. Establish and await MongoDB Atlas connection before serving requests
  try {
    const connected = await connectDB();
    if (connected) {
      console.log('[EduPulse MERN] Database connection ready');
    } else {
      console.warn('[EduPulse MERN] Database connection pending.');
    }
  } catch (err: any) {
    console.warn('[EduPulse MERN] MongoDB Atlas connection status:', err.message);
  }

  // 2. Mount Vite development middlewares for React SPA
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  // 3. Start HTTP server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[EduPulse MERN Stack] Application running live at http://localhost:${PORT}`);
  });
}

startServer();
