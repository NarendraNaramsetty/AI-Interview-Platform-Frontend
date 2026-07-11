import api from './api';

export const aiCoding = {
  generateQuestion: (payload) => api.post('/api/nlp/sandbox/generate', payload),
  reviewCode: (resultId, payload) => api.post(`/api/nlp/sandbox/${resultId}/submit`, payload),
  codingDashboard: () => api.get('/api/ai/coding-dashboard/')
};
