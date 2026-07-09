import api from './api';

export const questions = {
  list: (params) => api.get('/api/questions', { params }),
  categories: () => api.get('/api/questions/categories'),
  companies: () => api.get('/api/questions/companies'),
  roles: () => api.get('/api/questions/roles'),
  topics: () => api.get('/api/questions/topics'),
  create: (payload) => api.post('/api/questions', payload),
  detail: (id) => api.get(`/api/questions/${id}`),
  update: (id, payload) => api.put(`/api/questions/${id}`, payload),
  remove: (id) => api.delete(`/api/questions/${id}`),
  search: (params) => api.get('/api/questions/search', { params }),
  random: (params) => api.get('/api/questions/random', { params }),
  import: (payload) => api.post('/api/questions/import', payload),
  export: (params) => api.get('/api/questions/export', { params })
};
