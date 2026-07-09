import api from './api';

export const users = {
  profile: () => api.get('/api/users/profile'),
  updateProfile: (payload) => api.put('/api/users/profile', payload),
  avatar: (formData) => api.post('/api/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  statistics: () => api.get('/api/users/statistics'),
  achievements: () => api.get('/api/users/achievements'),
  leaderboard: () => api.get('/api/users/leaderboard'),
  skills: () => api.get('/api/users/skills'),
  preferences: () => api.get('/api/users/preferences'),
  dashboardSummary: () => api.get('/api/users/dashboard-summary')
};
