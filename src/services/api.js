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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

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
    const isExpectedBusinessStatus = error.response?.status === 404 || error.response?.status === 400;

    if (!isExpectedBusinessStatus) {
      console.error(`[API Response Error]:
        URL: ${error.config?.url}
        Status: ${error.response?.status || 'Network/Timeout'}
        Body:`, error.response?.data, `
        Message: ${error.message}`);
      if (error.stack) {
        console.error('[API Response Stack Trace]:', error.stack);
      }
    } else {
      console.log(`[API Response Info] Expected status ${error.response?.status} for URL: ${error.config?.url}. Info:`, error.response?.data);
    }

    const originalRequest = error.config;

    // Handle SimpleJWT token refresh on 401 Unauthorized
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const refreshResponse = await axios.post(
            `${baseURL}/api/auth/token/refresh`,
            { refresh: refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );

          const nextAccessToken = refreshResponse.data?.access || refreshResponse.data?.data?.access;
          const nextRefreshToken = refreshResponse.data?.refresh || refreshResponse.data?.data?.refresh;

          if (nextAccessToken) {
            localStorage.setItem('access_token', nextAccessToken);
            if (nextRefreshToken) {
              localStorage.setItem('refresh_token', nextRefreshToken);
            }
            originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
            processQueue(null, nextAccessToken);
            isRefreshing = false;
            return api(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          isRefreshing = false;
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
