import api from './api';

export const chatbot = {
  startSession: (payload) => api.post('/api/chatbot/session/start', payload),
  currentSession: () => api.get('/api/chatbot/session/current'),
  sessions: () => api.get('/api/chatbot/sessions'),
  sendMessage: (payload) => api.post('/api/chatbot/message', payload),
  messages: (sessionId) => api.get(`/api/chatbot/messages/${sessionId}`),
  feedback: (payload) => api.post('/api/chatbot/feedback', payload),
  history: (sessionId) => api.get(`/api/chatbot/history/${sessionId}`),
  prompts: () => api.get('/api/chatbot/prompts'),
  bookmarks: () => api.get('/api/chatbot/bookmarks')
};
