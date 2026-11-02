/**
 * EduPulse JWT & Token Security Service
 * Week 7 Milestone: Department of CSE, Metropolitan University
 */

export interface TokenPayload {
  userId: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  authProvider: 'GOOGLE' | 'EMAIL';
  studentId?: string;
  employeeId?: string;
  department?: string;
  issuedAt: number;
  expiresAt: number;
}

const JWT_SECRET = 'edupulse_academic_secret_key_2026_cse_metrouni';

/**
 * Base64URL encoder
 */
function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Base64URL decoder
 */
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Generate HMAC SHA256 Signature approximation for simulation
 */
function signSignature(headerEncoded: string, payloadEncoded: string): string {
  const combined = `${headerEncoded}.${payloadEncoded}.${JWT_SECRET}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return base64UrlEncode(`sig_${Math.abs(hash)}_${combined.length}`);
}

/**
 * Sign a new JWT access token (24-hour expiration)
 */
export function generateAccessToken(user: {
  userId: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  authProvider: 'GOOGLE' | 'EMAIL';
  studentId?: string;
  employeeId?: string;
  department?: string;
}): string {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const payload: TokenPayload = {
    ...user,
    issuedAt: now,
    expiresAt: now + 86400 // 24 hours
  };

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const signature = signSignature(headerB64, payloadB64);

  return `${headerB64}.${payloadB64}.${signature}`;
}

/**
 * Verify and decode JWT token
 */
export function verifyAccessToken(token: string): {
  valid: boolean;
  payload?: TokenPayload;
  error?: string;
} {
  try {
    if (!token || !token.includes('.')) {
      return { valid: false, error: 'Malformed JWT token format' };
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'Invalid JWT segments count' };
    }

    const [headerB64, payloadB64, signature] = parts;
    const expectedSig = signSignature(headerB64, payloadB64);

    if (signature !== expectedSig) {
      return { valid: false, error: 'Invalid token signature' };
    }

    const payloadJson = base64UrlDecode(payloadB64);
    const payload: TokenPayload = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);
    if (payload.expiresAt && now > payload.expiresAt) {
      return { valid: false, error: 'Token has expired' };
    }

    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, error: err.message || 'Token verification failed' };
  }
}
