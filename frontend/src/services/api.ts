/**
 * EduPulse Frontend REST API Client
 * Connects React Frontend to Express + MongoDB Backend
 * Department of Computer Science & Engineering, Metropolitan University
 */

const API_BASE = '/api';

export function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('edupulse_jwt_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Universal authenticated fetch with credentials support
 */
export async function apiFetch(url: string, init?: RequestInit): Promise<Response> {
  const headers = {
    ...getAuthHeader(),
    ...(init?.headers || {})
  };

  return fetch(url, {
    credentials: 'include',
    ...init,
    headers
  });
}

// ---------------------------------------------------------------------
// Auth & Verification API
// ---------------------------------------------------------------------
export const authApi = {
  login: async (email: string, password?: string, role?: string) => {
    const res = await apiFetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    return res.json();
  },

  register: async (payload: {
    name: string;
    email: string;
    role: string;
    password?: string;
    studentId?: string;
    batch?: string;
    section?: string;
    employeeId?: string;
    department?: string;
    authProvider?: string;
  }) => {
    const res = await apiFetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  sendOtp: async (email: string, name?: string) => {
    const res = await apiFetch(`${API_BASE}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name })
    });
    return res.json();
  },

  verifyOtp: async (email: string, code: string) => {
    const res = await apiFetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
    return res.json();
  },

  forgotPassword: async (email: string) => {
    const res = await apiFetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return res.json();
  },

  resetPassword: async (payload: { email: string; code: string; newPassword: string }) => {
    const res = await apiFetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  getCurrentUser: async () => {
    const res = await apiFetch(`${API_BASE}/auth/me`);
    return res.json();
  },

  logout: async () => {
    try {
      const res = await apiFetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return res.json();
    } catch {
      return { success: true };
    }
  }
};

// ---------------------------------------------------------------------
// Academic System API
// ---------------------------------------------------------------------
export const academicApi = {
  getDepartments: async () => {
    const res = await apiFetch(`${API_BASE}/academic/departments`);
    return res.json();
  },

  getSemesters: async () => {
    const res = await apiFetch(`${API_BASE}/academic/semesters`);
    return res.json();
  },

  getCourses: async () => {
    const res = await apiFetch(`${API_BASE}/academic/courses`);
    return res.json();
  },

  getStudents: async (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    const res = await apiFetch(`${API_BASE}/academic/students${query}`);
    return res.json();
  },

  getTeachers: async () => {
    const res = await apiFetch(`${API_BASE}/academic/teachers`);
    return res.json();
  },

  getAttendanceHistory: async (enrollmentId?: string) => {
    const query = enrollmentId ? `?enrollmentId=${enrollmentId}` : '';
    const res = await apiFetch(`${API_BASE}/academic/attendance/history${query}`);
    return res.json();
  },

  startQrSession: async (allocationId: string, durationSeconds?: number) => {
    const res = await apiFetch(`${API_BASE}/academic/attendance/session/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ allocationId, durationSeconds })
    });
    return res.json();
  },

  verifyQrAttendance: async (enrollmentId: string, sessionId: string, tokenUsed: string) => {
    const res = await apiFetch(`${API_BASE}/academic/attendance/verify-qr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enrollmentId, sessionId, tokenUsed })
    });
    return res.json();
  },

  getEvaluations: async (enrollmentId?: string) => {
    const query = enrollmentId ? `?enrollmentId=${enrollmentId}` : '';
    const res = await apiFetch(`${API_BASE}/academic/evaluations${query}`);
    return res.json();
  },

  submitGrade: async (data: {
    enrollmentId: string;
    quiz1?: number;
    quiz2?: number;
    midterm?: number;
    assignment?: number;
    finalExam?: number;
  }) => {
    const res = await apiFetch(`${API_BASE}/academic/evaluations/grade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getPreviousResults: async (studentId?: string) => {
    const query = studentId ? `?studentId=${studentId}` : '';
    const res = await apiFetch(`${API_BASE}/academic/previous-results${query}`);
    return res.json();
  },

  verifyPreviousResult: async (id: string, status: string, remarks?: string) => {
    const res = await apiFetch(`${API_BASE}/academic/previous-results/${id}/verify`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, remarks })
    });
    return res.json();
  },

  getNotices: async () => {
    const res = await apiFetch(`${API_BASE}/academic/notices`);
    return res.json();
  },

  getAssignments: async (allocationId?: string) => {
    const query = allocationId ? `?allocationId=${allocationId}` : '';
    const res = await apiFetch(`${API_BASE}/academic/assignments${query}`);
    return res.json();
  },

  submitAssignment: async (data: {
    assignmentId: string;
    studentId: string;
    submittedFileName: string;
    fileUrl?: string;
  }) => {
    const res = await apiFetch(`${API_BASE}/academic/assignments/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getMaterials: async (allocationId?: string) => {
    const query = allocationId ? `?allocationId=${allocationId}` : '';
    const res = await apiFetch(`${API_BASE}/academic/materials${query}`);
    return res.json();
  },

  getStudentDashboard: async () => {
    const res = await apiFetch(`${API_BASE}/academic/student/dashboard`);
    return res.json();
  }
};

// ---------------------------------------------------------------------
// Admin Management API
// ---------------------------------------------------------------------
export const adminApi = {
  getPendingUsers: async () => {
    const res = await apiFetch(`${API_BASE}/admin/users/pending`);
    return res.json();
  },

  approveUser: async (userId: string) => {
    const res = await apiFetch(`${API_BASE}/admin/users/${userId}/approve`, {
      method: 'PATCH'
    });
    return res.json();
  },

  rejectUser: async (userId: string, reason?: string) => {
    const res = await apiFetch(`${API_BASE}/admin/users/${userId}/reject`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    return res.json();
  },

  deleteUser: async (userId: string) => {
    const res = await apiFetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  getSystemHealth: async () => {
    const res = await apiFetch(`${API_BASE}/admin/system/health`);
    return res.json();
  },

  getRbacMatrix: async () => {
    const res = await apiFetch(`${API_BASE}/admin/rbac/matrix`);
    return res.json();
  }
};
