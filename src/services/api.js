import axios from 'axios';
import { getApiUrl } from '../utils/envConfig';

const baseURL = getApiUrl();

const api = axios.create({
  baseURL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  console.log(`[API Request] Initiating request:
    URL: ${config.baseURL || ''}${config.url}
    Method: ${config.method?.toUpperCase()}
    Headers:`, config.headers, `
    Data:`, config.data);

  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}, (error) => {
  console.error('[API Request Error]', error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] Success:
      URL: ${response.config.url}
      Status: ${response.status}
      Data:`, response.data);
    return response.data || response;
  },
  async (error) => {
    console.error(`[API Response Error]:
      URL: ${error.config?.url}
      Status: ${error.response?.status || 'Network/Timeout'}
      Body:`, error.response?.data, `
      Message: ${error.message}`);
    if (error.stack) {
      console.error('[API Response Stack Trace]:', error.stack);
    }

    const originalRequest = error.config;

    // Handle SimpleJWT token refresh on 401 Unauthorized
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const refreshResponse = await axios.post(
            `${baseURL}/api/auth/token/refresh`,
            { refresh: refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );

          const nextAccessToken = refreshResponse.data?.access || refreshResponse.data?.data?.access;
          if (nextAccessToken) {
            localStorage.setItem('access_token', nextAccessToken);
            originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('auth_user');
          window.dispatchEvent(new CustomEvent('auth:expired'));
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
