import api from './api';

export const aiCoding = {
  generateQuestion: (payload) => api.post('/api/ai/generate-question/', payload),
  reviewCode: (payload) => api.post('/api/ai/review-code/', payload),
  codingDashboard: () => api.get('/api/ai/coding-dashboard/')
};
