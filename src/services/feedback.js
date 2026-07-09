import api from './api';

export const feedback = {
  list: () => api.get('/api/feedback'),
  generate: (payload) => api.post('/api/feedback/generate', payload),
  detail: (interviewId) => api.get(`/api/feedback/${interviewId}`),
  technical: (interviewId) => api.get(`/api/feedback/${interviewId}/technical`),
  communication: (interviewId) => api.get(`/api/feedback/${interviewId}/communication`),
  hr: (interviewId) => api.get(`/api/feedback/${interviewId}/hr`),
  overall: (interviewId) => api.get(`/api/feedback/${interviewId}/overall`),
  suggestions: (interviewId) => api.get(`/api/feedback/${interviewId}/suggestions`),
  resources: (interviewId) => api.get(`/api/feedback/${interviewId}/resources`),
  history: (interviewId) => api.get(`/api/feedback/${interviewId}/history`),
  export: (interviewId) => api.get(`/api/feedback/${interviewId}/export`)
};
