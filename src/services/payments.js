import api from './api';

export const payments = {
  plans: () => api.get('/api/payments/plans'),
  subscription: () => api.get('/api/payments/subscription'),
  checkout: (payload) => api.post('/api/payments/checkout', payload),
  cancel: () => api.post('/api/payments/subscription/cancel'),
  webhook: (payload) => api.post('/api/payments/webhook', payload)
};
