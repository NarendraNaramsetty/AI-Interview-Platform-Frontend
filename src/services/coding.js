import api from './api';

export const coding = {
  categories: () => api.get('/api/coding/categories'),
  problems: (params) => api.get('/api/coding/problems', { params }),
  problem: (id) => api.get(`/api/coding/problems/${id}`),
  randomProblem: (params) => api.get('/api/coding/problems/random', { params }),
  start: (payload) => api.post('/api/coding/start', payload),
  save: (payload) => api.post('/api/coding/save', payload),
  submit: (payload) => api.post('/api/coding/submit', payload),
  history: () => api.get('/api/coding/history'),
  submission: (id) => api.get(`/api/coding/submissions/${id}`),
  statistics: () => api.get('/api/coding/statistics'),
  leaderboard: () => api.get('/api/coding/leaderboard'),
  favorites: () => api.get('/api/coding/favorites'),
  favoriteDetail: (problemId) => api.get(`/api/coding/favorites/${problemId}`)
};
