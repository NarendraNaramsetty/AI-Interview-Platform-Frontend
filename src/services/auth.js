import api from './api';

export const auth = {
  login: (payload) => api.post('/api/auth/login', payload),
  register: (payload) => api.post('/api/auth/register', payload),
  logout: (refresh) => api.post('/api/auth/logout', { refresh }),
  refreshToken: (refresh) => api.post('/api/auth/token/refresh', { refresh }),
  me: () => api.get('/api/auth/me'),
  changePassword: (payload) => api.post('/api/auth/change-password', payload),
  forgotPassword: (payload) => api.post('/api/auth/forgot-password', payload),
  verifyOtp: (payload) => api.post('/api/auth/verify-otp', payload),
  resetPassword: (payload) => api.post('/api/auth/reset-password', payload),
  verifyEmail: (payload) => api.post('/api/auth/verify-email', payload),
  resendVerification: (payload) => api.post('/api/auth/resend-verification', payload),
  updateProfile: (payload) => api.put('/api/auth/profile', payload)
};
