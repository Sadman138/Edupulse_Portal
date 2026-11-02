/**
 * EduPulse Express API Server Engine
 * Week 7 Milestone: Backend — Express API, Authentication & RBAC
 * Department of Computer Science & Engineering, Metropolitan University
 */

import express, { Request, Response, NextFunction } from 'express';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import academicRoutes from './routes/academic.routes';
import { auditLogger } from './middleware/rbac.middleware';

const app = express();
const PORT = process.env.PORT || 3001;

// Global Middlewares
app.use(express.json());
app.use(auditLogger);

// CORS headers for Vite dev server and production clients
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Root API Discovery Endpoint
app.get('/api', (req: Request, res: Response) => {
  res.status(200).json({
    service: 'EduPulse Academic REST API Engine',
    milestone: 'Week 7 (Express API, JWT Authentication & RBAC)',
    institution: 'Department of CSE, Metropolitan University, Sylhet',
    endpoints: {
      auth: ['/api/auth/login', '/api/auth/register', '/api/auth/send-otp', '/api/auth/verify-otp', '/api/auth/me'],
      admin: ['/api/admin/users/pending', '/api/admin/users/:id/approve', '/api/admin/users/:id/reject', '/api/admin/rbac/matrix', '/api/admin/system/health'],
      academic: ['/api/academic/departments', '/api/academic/semesters', '/api/academic/courses', '/api/academic/teacher/roster', '/api/academic/student/grades']
    },
    version: '1.7.0'
  });
});

// Mount Route Modules
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/academic', academicRoutes);

// 404 Not Found Catch-All
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: [${req.method} ${req.originalUrl}]. Check API Documentation.`,
    code: 'ROUTE_NOT_FOUND'
  });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[API ERROR]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Academic API Server Error',
    code: 'INTERNAL_SERVER_ERROR'
  });
});

export default app;

if (process.env.NODE_ENV !== 'test' && require.main === module) {
  app.listen(PORT, () => {
    console.log(`[EduPulse] Week 7 Express API Server running on port ${PORT}`);
  });
}
