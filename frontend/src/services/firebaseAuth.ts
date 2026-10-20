import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Standard Google Provider (Profile + Email - UNRESTRICTED, works for ALL Google users)
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// In-memory cache for OAuth access token
let cachedAccessToken: string | null = null;
let currentGoogleUser: User | null = null;

// Initialize Auth Listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      currentGoogleUser = user;
      if (cachedAccessToken && onAuthSuccess) {
        onAuthSuccess(user, cachedAccessToken);
      }
    } else {
      currentGoogleUser = null;
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Trigger Real Google Sign-In Popup
 * Fully unrestricted: any Google account (personal or university) can sign in with 0 warnings or blocks!
 */
export const signInWithRealGoogle = async (): Promise<{
  user: User;
  accessToken: string;
  email: string;
  displayName: string;
  photoURL?: string;
} | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken || '';
    
    cachedAccessToken = token;
    currentGoogleUser = result.user;

    return {
      user: result.user,
      accessToken: token,
      email: result.user.email || '',
      displayName: result.user.displayName || 'Google User',
      photoURL: result.user.photoURL || undefined
    };
  } catch (error: any) {
    console.error('Google Sign-In Popup error:', error);
    throw error;
  }
};

export const getCachedAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const getCurrentGoogleUser = (): User | null => {
  return currentGoogleUser;
};

export const signOutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  currentGoogleUser = null;
};

function utf8ToBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Encode message into RFC 2822 base64url for Gmail API
 */
function createBase64UrlEmail(to: string, subject: string, htmlBody: string): string {
  const messageParts = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    htmlBody
  ];
  const message = messageParts.join('\r\n');
  return utf8ToBase64Url(message);
}

/**
 * Send real email to recipient via Gmail API using authorized OAuth token
 */
export const sendRealVerificationEmail = async (
  recipientEmail: string,
  verificationCode: string,
  recipientName: string,
  tokenOverride?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  const token = tokenOverride || cachedAccessToken;
  
  if (!token) {
    return {
      success: false,
      error: 'Google OAuth token not available. Please authenticate with Google to dispatch verification emails directly to Gmail.'
    };
  }

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #0284c7; font-size: 24px; margin: 0 0 4px 0; font-weight: 800;">EduPulse Academic Portal</h1>
        <p style="color: #64748b; font-size: 13px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Metropolitan University, Sylhet</p>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <h2 style="font-size: 16px; margin: 0 0 8px 0; color: #0f172a;">Account Registration Verification</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 16px 0;">
          Hello <strong>${recipientName || 'Student / Faculty'}</strong>,
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 16px 0;">
          Please use the following 6-digit security code to verify your email address (<strong>${recipientEmail}</strong>) and complete your EduPulse portal registration:
        </p>
        
        <div style="text-align: center; margin: 24px 0;">
          <div style="display: inline-block; background-color: #0284c7; color: #ffffff; font-size: 32px; font-weight: 900; letter-spacing: 8px; padding: 14px 28px; border-radius: 12px; font-family: monospace;">
            ${verificationCode}
          </div>
        </div>

        <p style="font-size: 12px; color: #64748b; margin: 0; text-align: center;">
          This code is valid for 15 minutes. If you did not initiate this registration request, please disregard this email.
        </p>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; font-size: 11px; color: #94a3b8;">
        Office of the Registrar • Metropolitan University Sylhet • Security Governance Desk
      </div>
    </div>
  `;

  try {
    const raw = createBase64UrlEmail(
      recipientEmail,
      `EduPulse Security Verification Code: ${verificationCode}`,
      htmlContent
    );

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ raw })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error('Gmail API send error:', errData);
      const isScopeError =
        errData.error?.message?.toLowerCase().includes('insufficient') ||
        response.status === 403;
      return {
        success: false,
        error: isScopeError
          ? 'Google Workspace authorization required to dispatch email. Click "Authorize & Send Email" below.'
          : (errData.error?.message || `Failed to send via Gmail API (HTTP ${response.status})`)
      };
    }

    const data = await response.json();
    return {
      success: true,
      messageId: data.id
    };
  } catch (err: any) {
    console.error('Gmail send exception:', err);
    return {
      success: false,
      error: err.message || 'Network error while calling Gmail API'
    };
  }
};
