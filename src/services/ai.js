import api from './api';

export const ai = {
  health: () => api.get('/api/ai/health'),
  config: () => api.get('/api/ai/config'),
  statistics: () => api.get('/api/ai/statistics'),
  logs: () => api.get('/api/ai/logs'),
  providers: () => api.get('/api/ai/providers'),
  models: () => api.get('/api/ai/models'),
  analyze: (payload) => api.post('/api/ai', payload)
};
