import api from './api';

export const roadmap = {
  careers: () => api.get('/api/roadmap/careers'),
  list: () => api.get('/api/roadmap'),
  detail: (id) => api.get(`/api/roadmap/${id}`),
  start: (payload) => api.post('/api/roadmap/start', payload),
  progress: (payload) => api.put('/api/roadmap/progress', payload),
  current: () => api.get('/api/roadmap/current'),
  completed: () => api.get('/api/roadmap/completed'),
  pause: (payload) => api.post('/api/roadmap/pause', payload),
  resume: (payload) => api.post('/api/roadmap/resume', payload),
  resources: () => api.get('/api/roadmap/resources'),
  statistics: () => api.get('/api/roadmap/statistics'),
  generateAI: (payload) => api.post('/api/roadmap/generate-ai', payload),
  mentor: (payload) => api.post('/api/roadmap/mentor', payload)
};
