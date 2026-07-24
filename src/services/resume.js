import api from './api';

export const resume = {
  list: () => api.get('/api/resume'),
  upload: (formData) => api.post('/api/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  detail: (id) => api.get(`/api/resume/${id}`),
  update: (id, payload) => api.post(`/api/resume/${id}`, payload),
  remove: (id) => api.delete(`/api/resume/${id}`),
  download: (id) => api.get(`/api/resume/${id}/download`, { responseType: 'blob' }),
  setDefault: (id) => api.post(`/api/resume/${id}/default`),
  text: (id) => api.get(`/api/resume/${id}/text`),
  versions: (id) => api.get(`/api/resume/${id}/versions`),
  activity: (id) => api.get(`/api/resume/${id}/activity`),
  analysis: () => api.get('/api/resume/analysis'),
  match: (formData) => api.post('/api/resume/match', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};
