import api from './api';

export const notifications = {
  list: () => api.get('/api/notifications'),
  markRead: (id) => api.post(`/api/notifications/${id}/read`),
  markAllRead: () => api.post('/api/notifications/read-all'),
  settings: () => api.get('/api/notifications/settings'),
  updateSettings: (payload) => api.put('/api/notifications/settings', payload)
};
