/**
 * EduPulse Express API Server Engine (MERN Stack)
 * Department of Computer Science & Engineering, Metropolitan University
 * Database: MongoDB Atlas (Mongoose) | Auth: JWT + bcrypt + Nodemailer | Security: Helmet + RateLimit + RBAC
 */

import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';

import connectDB, { isDbConnected } from './config/db';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import academicRoutes from './routes/academic.routes';
import { auditLogger } from './middleware/rbac.middleware';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env'), override: true });
dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });

const app = express();
const PORT = process.env.PORT || 3001;

// Enable reverse proxy trust for Cloud Run / reverse proxies in containerized environment
app.set('trust proxy', 1);

// 1. Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabled to allow React SPA bundling in dev/preview iFrames
    crossOriginEmbedderPolicy: false
  })
);

// 2. CORS Configuration with Credentials Support for Persistent Auth Cookies
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
  })
);

// 3. Cookie Parser
app.use(cookieParser());

// 4. Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Rate Limiting Protection (configured for reverse proxy compatibility)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // max 300 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    trustProxy: false,
    xForwardedForHeader: false,
    forwardedHeader: false
  },
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again after 15 minutes.',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // max 50 authentication attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    trustProxy: false,
    xForwardedForHeader: false,
    forwardedHeader: false
  },
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again later.',
    code: 'AUTH_RATE_LIMIT_EXCEEDED'
  }
});

app.use('/api', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/send-otp', authLimiter);

// 5. Audit Logging Middleware
app.use(auditLogger);

// 6. Root API Discovery Endpoint
app.get('/api', (req: Request, res: Response) => {
  res.status(200).json({
    service: 'EduPulse Academic REST API Engine (MERN Stack)',
    architecture: 'React 19 + Express.js + MongoDB Atlas + Node.js (Mongoose ODM)',
    institution: 'Department of CSE, Metropolitan University, Sylhet',
    database: {
      type: 'MongoDB (Mongoose ODM)',
      connected: isDbConnected()
    },
    endpoints: {
      auth: ['/api/auth/login', '/api/auth/register', '/api/auth/send-otp', '/api/auth/verify-otp', '/api/auth/me'],
      admin: ['/api/admin/users/pending', '/api/admin/users/:id/approve', '/api/admin/users/:id/reject', '/api/admin/rbac/matrix', '/api/admin/system/health'],
      academic: [
        '/api/academic/departments',
        '/api/academic/semesters',
        '/api/academic/courses',
        '/api/academic/students',
        '/api/academic/teachers',
        '/api/academic/allocations',
        '/api/academic/enrollments',
        '/api/academic/attendance/session/start',
        '/api/academic/attendance/verify-qr',
        '/api/academic/attendance/history',
        '/api/academic/evaluations',
        '/api/academic/evaluations/grade',
        '/api/academic/previous-results',
        '/api/academic/notices',
        '/api/academic/assignments',
        '/api/academic/assignments/submit',
        '/api/academic/materials',
        '/api/academic/student/dashboard'
      ]
    },
    version: '2.0.0-MERN'
  });
});

// 7. Mount Core Route Modules
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/academic', academicRoutes);

// 8. 404 Catch-All for API routes
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `API endpoint not found: [${req.method} ${req.originalUrl}]`,
    code: 'ROUTE_NOT_FOUND'
  });
});

// 9. Global Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[API Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Academic API Server Error',
    code: 'INTERNAL_SERVER_ERROR'
  });
});

export default app;
