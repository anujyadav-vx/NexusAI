// Central API Client with JWT authorization and error handling

const API_BASE = '/api';

export const getAuthToken = () => {
  return localStorage.getItem('saas_token');
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('saas_token', token);
  } else {
    localStorage.removeItem('saas_token');
  }
};

export async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    ...options.headers
  };

  // Only set Content-Type if body is not FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 401 && !endpoint.includes('/auth/login')) {
        // Clear token on authentication failure
        setAuthToken(null);
        window.location.href = '/login?expired=true';
      }
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err);
    throw err;
  }
}

// API Service helper functions
export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getProfile: () => request('/auth/profile'),
  updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // AI Tools
  chat: (payload) => request('/ai/chat', { method: 'POST', body: JSON.stringify(payload) }),
  resumeAnalyze: (formDataOrJson) => {
    const isFormData = formDataOrJson instanceof FormData;
    return request('/ai/resume-analyzer', {
      method: 'POST',
      body: isFormData ? formDataOrJson : JSON.stringify(formDataOrJson)
    });
  },
  codeReview: (payload) => request('/ai/code-reviewer', { method: 'POST', body: JSON.stringify(payload) }),
  blogGenerate: (payload) => request('/ai/blog-generator', { method: 'POST', body: JSON.stringify(payload) }),
  pdfSummarize: (formDataOrJson) => {
    const isFormData = formDataOrJson instanceof FormData;
    return request('/ai/pdf-summarizer', {
      method: 'POST',
      body: isFormData ? formDataOrJson : JSON.stringify(formDataOrJson)
    });
  },
  sqlGenerate: (payload) => request('/ai/sql-generator', { method: 'POST', body: JSON.stringify(payload) }),
  imageGenerate: (payload) => request('/ai/image-generator', { method: 'POST', body: JSON.stringify(payload) }),
  getHistory: () => request('/ai/history'),

  // Billing
  getPlans: () => request('/billing/plans'),
  upgradePlan: (planId) => request('/billing/upgrade', { method: 'POST', body: JSON.stringify({ planId }) }),
  getInvoices: () => request('/billing/invoices'),

  // Analytics
  getAnalytics: () => request('/analytics/usage'),

  // Admin
  getAdminOverview: () => request('/admin/overview'),
  updateUserRole: (userId, data) => request(`/admin/users/${userId}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (userId) => request(`/admin/users/${userId}`, { method: 'DELETE' })
};
