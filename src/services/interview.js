import api from './api';

export const interview = {
  start: (payload) => api.post('/api/interviews/start', payload),
  current: () => api.get('/api/interviews/current'),
  history: () => api.get('/api/interviews/history'),
  detail: (id) => api.get(`/api/interviews/${id}`),
  pause: (id) => api.post(`/api/interviews/${id}/pause`),
  resume: (id) => api.post(`/api/interviews/${id}/resume`),
  end: (id) => api.post(`/api/interviews/${id}/end`),
  answer: (id, payload) => api.post(`/api/interviews/${id}/answer`, payload),
  next: (id) => api.post(`/api/interviews/${id}/next`),
  previous: (id) => api.post(`/api/interviews/${id}/previous`),
  skip: (id) => api.post(`/api/interviews/${id}/skip`),
  progress: (id) => api.get(`/api/interviews/${id}/progress`),
  duplicate: (id) => api.post(`/api/interviews/${id}/duplicate`),
  timeline: (id) => api.get(`/api/interviews/${id}/timeline`)
};
