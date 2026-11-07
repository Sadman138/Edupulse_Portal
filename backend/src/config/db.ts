/**
 * EduPulse Centralized MongoDB Connection Manager
 * Department of Computer Science & Engineering, Metropolitan University
 * MERN Stack Architecture (MongoDB / Mongoose ODM)
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables reliably once
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env'), override: true });
dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });

// Disable query buffering when disconnected to prevent 10s request stalls
mongoose.set('bufferCommands', false);

let connectionPromise: Promise<boolean> | null = null;
let connectionDiagnostic: string = 'Pending configuration';

/**
 * Connect to MongoDB Atlas (Shared Singleton Connection)
 * Ensures only one connection attempt is executed per process.
 */
export const connectDB = async (): Promise<boolean> => {
  // 1. If already connected, reuse existing connection
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  // 2. If a connection attempt is currently in-flight, return the existing promise
  if (connectionPromise) {
    return connectionPromise;
  }

  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || '';

  // 3. Validate URI
  if (!uri || uri.includes('<username>') || uri.includes('db_password')) {
    connectionDiagnostic = 'MongoDB Atlas URI not set or placeholder detected in environment';
    console.warn(
      '[EduPulse MongoDB] Live MongoDB Atlas connection string is pending configuration.\n' +
      'Set MONGODB_URI in backend/.env or environment variables to enable persistent storage.'
    );
    return false;
  }

  // 4. Initiate shared connection promise
  connectionPromise = (async () => {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 30000,
      });

      // Safely extract database name and host
      const host =
        mongoose.connection.host ||
        (mongoose.connection as any).client?.options?.hosts?.[0] ||
        'ac-izgj7ub-shard-00-00.np6bppt.mongodb.net';
      const dbName =
        mongoose.connection.name ||
        (mongoose.connection as any).db?.databaseName ||
        'edupulse_db';

      connectionDiagnostic = `Connected to ${host}/${dbName}`;
      console.log(`[EduPulse MongoDB] Connected successfully to Atlas (${host}/${dbName})`);
      return true;
    } catch (error: any) {
      connectionPromise = null;
      const isWhitelistIssue =
        error.message?.includes('whitelisted') ||
        error.message?.includes('IP') ||
        error.message?.includes('Could not connect to any servers');

      if (isWhitelistIssue) {
        connectionDiagnostic = 'MongoDB Atlas connection blocked: Network Access requires 0.0.0.0/0 in Atlas';
        console.warn(
          '[EduPulse MongoDB Whitelist Note] Could not connect to MongoDB Atlas cluster.\n' +
          '-> Fix: In MongoDB Atlas Dashboard > Network Access > Add IP Address > "Allow Access from Anywhere" (0.0.0.0/0).\n' +
          `-> Details: ${error.message}`
        );
      } else {
        connectionDiagnostic = `MongoDB connection failed: ${error.message}`;
        console.warn('[EduPulse MongoDB Warning]', error.message);
      }

      return false;
    }
  })();

  return connectionPromise;
};

/**
 * Check if MongoDB connection is active and ready
 */
export const isDbConnected = (): boolean => mongoose.connection.readyState === 1;

/**
 * Get human-readable database status
 */
export const getDbDiagnostic = (): string => {
  if (mongoose.connection.readyState === 1) {
    const host =
      mongoose.connection.host ||
      (mongoose.connection as any).client?.options?.hosts?.[0] ||
      'Atlas';
    const dbName =
      mongoose.connection.name ||
      (mongoose.connection as any).db?.databaseName ||
      'edupulse_db';
    return `Connected to MongoDB Atlas (${host}/${dbName})`;
  }
  return connectionDiagnostic;
};

/**
 * Safely close MongoDB connection (used by seed runner or graceful shutdown)
 */
export const disconnectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    connectionPromise = null;
    connectionDiagnostic = 'Disconnected';
    console.log('[EduPulse MongoDB] Disconnected from database.');
  }
};

export default connectDB;
