import api from './api';

export const dashboard = {
  stats: () => api.get('/api/dashboard/stats'),
  activity: () => api.get('/api/dashboard/activity'),
  adminAnalytics: () => api.get('/api/admin/analytics')
};
