const API_URL = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

// Auth
export const api = {
  auth: {
    login: (email, password) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (name, email, password, locale) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, locale }) }),
    logout: () =>
      request('/auth/logout', { method: 'POST' }),
    me: () =>
      request('/auth/me'),
    verifyEmail: (token) =>
      request('/auth/verify-email', { method: 'POST', body: JSON.stringify({ token }) }),
    resendVerification: (email) =>
      request('/auth/resend-verification', { method: 'POST', body: JSON.stringify({ email }) }),
    forgotPassword: (email) =>
      request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
    resetPassword: (token, password) =>
      request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }),
    getOAuthUrl: (provider) =>
      request(`/auth/${provider}`),
    oauthCallback: (provider, code, state) =>
      request(`/auth/${provider}/callback`, { method: 'POST', body: JSON.stringify({ code, state }) }),
  },
  users: {
    getProfile: () => request('/users/me'),
    updateProfile: (data) =>
      request('/users/me', { method: 'PUT', body: JSON.stringify(data) }),
    updateLocale: (locale) =>
      request('/users/me/locale', { method: 'PUT', body: JSON.stringify({ locale }) }),
  },
  trips: {
    list: () => request('/trips'),
    get: (id) => request(`/trips/${id}`),
    create: (data) =>
      request('/trips', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) =>
      request(`/trips/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) =>
      request(`/trips/${id}`, { method: 'DELETE' }),
    sendMessage: (tripId, message) =>
      request(`/trips/${tripId}/messages`, { method: 'POST', body: JSON.stringify({ message }) }),
  },
};
