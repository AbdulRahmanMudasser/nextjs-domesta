// services/apiService.ts
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://darmaid.gadgetreviewzone.com/api";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to headers if present
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, Promise.reject);

// Optional response logging/interception
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

// 🚀 Export all methods
export const apiService = {
  get: (url: string, config = {}) => axiosInstance.get(url, config),
  post: (url: string, data: any, config = {}) => axiosInstance.post(url, data, config),
  put: (url: string, data: any, config = {}) => axiosInstance.put(url, data, config),
  patch: (url: string, data: any, config = {}) => axiosInstance.patch(url, data, config),
  delete: (url: string, config = {}) => axiosInstance.delete(url, config),
};

export default axiosInstance;
