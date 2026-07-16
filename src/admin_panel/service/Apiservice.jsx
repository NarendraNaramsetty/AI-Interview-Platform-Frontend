import axios from "axios";
import { getApiUrl } from "../../utils/envConfig";

const _BACKEND_URL = getApiUrl();

const BASE_URL = `${_BACKEND_URL}/api/admin/`;
const api = axios.create({ baseURL: BASE_URL, headers: { "Content-Type": "application/json" } });

let isAdminRefreshing = false;
let adminFailedQueue = [];

const processAdminQueue = (error, token = null) => {
  adminFailedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  adminFailedQueue = [];
};

// Add request interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiry / invalid token globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      if (isAdminRefreshing) {
        return new Promise((resolve, reject) => {
          adminFailedQueue.push({ resolve, reject });
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
      isAdminRefreshing = true;

      const refreshToken = localStorage.getItem("admin_refresh_token");
      if (refreshToken) {
        try {
          const refreshRes = await axios.post(`${_BACKEND_URL}/api/admin/token/refresh/`, { refresh: refreshToken });
          const newAccess = refreshRes.data?.access;
          const newRefresh = refreshRes.data?.refresh;
          if (newAccess) {
            localStorage.setItem("admin_access_token", newAccess);
            if (newRefresh) {
              localStorage.setItem("admin_refresh_token", newRefresh);
            }
            originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            processAdminQueue(null, newAccess);
            isAdminRefreshing = false;
            return api(originalRequest);
          }
        } catch (refreshErr) {
          processAdminQueue(refreshErr, null);
          isAdminRefreshing = false;
          localStorage.removeItem("admin_access_token");
          localStorage.removeItem("admin_refresh_token");
          localStorage.removeItem("admin_user");
          window.location.href = '/adminlogin';
          return Promise.reject(refreshErr);
        }
      } else {
        window.location.href = '/adminlogin';
      }
    }
    return Promise.reject(error);
  }
);

const ApiService = {
  // Authentication
  accountlogin: (data) => api.post(`login/`, data),
  getsidebarmenu: (data) => api.post(`sidebar-menu/`, data),

  // Dashboard
  getDashboardData: () => api.get(`dashboard/`),

  // User Management
  getUsers: (params) => api.get(`users/`, { params }),
  getUserDetail: (id) => api.get(`users/${id}/`),
  updateUser: (id, data) => api.put(`users/${id}/`, data),
  deleteUser: (id) => api.delete(`users/${id}/`),

  // Payments / Plans
  getPayments: () => api.get(`payments/`),
  createPlan: (data) => api.post(`payments/`, data),
  updatePlan: (data) => api.put(`payments/`, data),
  deletePlan: (data) => api.delete(`payments/`, { data }),

  // Interviews & Categories
  getInterviews: () => api.get(`interviews/`),
  createCategory: (data) => api.post(`interviews/`, data),
  updateCategory: (data) => api.put(`interviews/`, data),
  deleteCategory: (data) => api.delete(`interviews/`, { data }),

  // Questions Bank
  getQuestions: (params) => api.get(`questions/`, { params }),
  createQuestion: (data) => api.post(`questions/`, data),
  updateQuestion: (data) => api.put(`questions/`, data),
  deleteQuestion: (data) => api.delete(`questions/`, { data }),
  uploadQuestionsCSV: (formData) => api.post(`questions/upload/`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),

  // Notifications
  getNotifications: () => api.get(`notification/`),
  createNotification: (data) => api.post(`notification/`, data),

  // Support Messages & Bugs
  getSupport: () => api.get(`support/`),
  replySupportMessage: (data) => api.post(`support/`, data),
  resolveBugReport: (data) => api.put(`support/`, data),

  // Logs Auditing
  getLogs: (params) => api.get(`logs/`, { params }),

  // Settings Configuration
  getSettings: () => api.get(`settings/`),
  updateSettings: (data) => api.put(`settings/`, data),

  // System Health
  getSystemStatus: () => api.get(`system/`),

  // Database Controls
  runDatabaseAction: (data) => api.post(`database/`, data)
};

export default ApiService;
export { api };
