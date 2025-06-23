import axios from "axios";

// Define base URLs
const defaultBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.zoexp.com/";
const rolesBaseURL = "https://darmaid.gadgetreviewzone.com/api";

const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add token to headers if present
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Optional response logging/interception
  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );

  return instance;
};

// Create separate Axios instances
const defaultAxiosInstance = createAxiosInstance(defaultBaseURL);
const rolesAxiosInstance = createAxiosInstance(rolesBaseURL);

// 🚀 Export all methods with base URL selection
export const apiService = {
  get: (url, config = {}, useRolesBase = false) =>
    (useRolesBase ? rolesAxiosInstance : defaultAxiosInstance).get(url, config),
  post: (url, data, config = {}, useRolesBase = false) =>
    (useRolesBase ? rolesAxiosInstance : defaultAxiosInstance).post(url, data, config),
  put: (url, data, config = {}, useRolesBase = false) =>
    (useRolesBase ? rolesAxiosInstance : defaultAxiosInstance).put(url, data, config),
  patch: (url, data, config = {}, useRolesBase = false) =>
    (useRolesBase ? rolesAxiosInstance : defaultAxiosInstance).patch(url, data, config),
  delete: (url, config = {}, useRolesBase = false) =>
    (useRolesBase ? rolesAxiosInstance : defaultAxiosInstance).delete(url, config),
};

export default defaultAxiosInstance;