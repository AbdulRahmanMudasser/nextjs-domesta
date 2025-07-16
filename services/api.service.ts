import axios from "axios";

// Define base URL
const defaultBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.zoexp.com/";

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

// Create Axios instance
const defaultAxiosInstance = createAxiosInstance(defaultBaseURL);

// Export API methods
export const apiService = {
  get: (url, config = {}) => defaultAxiosInstance.get(url, config),
  post: (url, data, config = {}) => defaultAxiosInstance.post(url, data, config),
  put: (url, data, config = {}) => defaultAxiosInstance.put(url, data, config),
  patch: (url, data, config = {}) => defaultAxiosInstance.patch(url, data, config),
  delete: (url, config = {}) => defaultAxiosInstance.delete(url, config),
};

export default defaultAxiosInstance;  