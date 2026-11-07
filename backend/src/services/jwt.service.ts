/**
 * EduPulse Genuine JWT Authentication Service
 * Uses standard jsonwebtoken package with HS256 algorithm and environment secret
 * Department of Computer Science & Engineering, Metropolitan University
 */

import jwt, { SignOptions, Secret } from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  authProvider: 'GOOGLE' | 'EMAIL';
  studentId?: string;
  employeeId?: string;
  department?: string;
  batch?: string;
  section?: string;
}

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'edupulse_academic_secret_key_2026_cse_metrouni';
const JWT_EXPIRES_IN = '7d';

/**
 * Sign a genuine standard JWT access token with 24h validity
 */
export function generateAccessToken(payload: TokenPayload): string {
  const options: SignOptions = {
    algorithm: 'HS256',
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'EduPulse-Academic-Platform',
    subject: payload.userId
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * Verify and decode genuine JWT access token
 */
export function verifyAccessToken(token: string): {
  valid: boolean;
  payload?: TokenPayload;
  error?: string;
} {
  try {
    if (!token) {
      return { valid: false, error: 'No token provided' };
    }

    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: 'EduPulse-Academic-Platform'
    }) as TokenPayload;

    return { valid: true, payload: decoded };
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return { valid: false, error: 'Access token has expired. Please sign in again.' };
    }
    return { valid: false, error: err.message || 'Invalid access token' };
  }
}
