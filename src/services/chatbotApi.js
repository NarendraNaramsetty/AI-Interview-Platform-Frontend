import api from './api';

export const chatbotApi = {
  sendMessage: (payload) => api.post('/api/chat/', payload),
  getHistory: (sessionId) => api.get(`/api/chat/history/?session_id=${sessionId}`),
  getSessions: () => api.get('/api/chat/sessions/'),
  createSession: (payload) => api.post('/api/chat/session/', payload),
  deleteSession: (id) => api.delete(`/api/chat/session/${id}/`),
  submitFeedback: (payload) => api.post('/api/chat/feedback/', payload),
  getCategories: () => api.get('/api/chat/categories/'),
  getAnalytics: () => api.get('/api/chat/analytics/'),
  
  // Admin CRUD APIs
  getKnowledge: () => api.get('/api/chat/knowledge'),
  createKnowledge: (payload) => api.post('/api/chat/knowledge', payload),
  updateKnowledge: (id, payload) => api.put(`/api/chat/knowledge/${id}`, payload),
  deleteKnowledge: (id) => api.delete(`/api/chat/knowledge/${id}`)
};
