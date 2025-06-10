// services/networkService.ts

import { apiService } from "./api.service";
import { utilityService } from "./utility.service";

const serialize = (obj: Record<string, any>): string =>
  Object.keys(obj)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join("&");

const handleResponse = async (
  request: Promise<any>,
  showError = true
): Promise<any> => {
  try {
    const response = await request;
    return response.data.data || response.data || response;
  } catch (error: any) {
    const err = error.response?.data;

    if (showError && err?.message) {
      utilityService.showToast(
        err.message || "An error occurred. Please try again.",
        "error",        
      );
    }

    if (error.response?.code === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user_role");
      window.location.href = "/";
    }

    throw err;
  }
};

// 🔄 Export higher-level API
export const networkService = {
  registerUser: (data: any) =>
    handleResponse(apiService.post("/auth/register", data), false),
  loginUser: (data: any) =>
    handleResponse(apiService.post("/auth/login", data), true),
  getRoles: () =>
    handleResponse(apiService.get("/roles"), false),

  get: (endpoint: string, id: any = null, showError = true) =>
    handleResponse(
      apiService.get(`${endpoint}${id ? "/" + id : ""}`),
      showError
    ),

  post: (endpoint: string, data: any, id: any = null, showError = true) =>
    handleResponse(
      apiService.post(`${endpoint}${id ? "/" + id : ""}`, data),
      showError
    ),

  put: (endpoint: string, data: any, id: any = null, showError = true) =>
    handleResponse(
      apiService.put(`${endpoint}${id ? "/" + id : ""}`, data),
      showError
    ),

  patch: (endpoint: string, data: any, showError = true) =>
    handleResponse(apiService.patch(endpoint, data), showError),

  delete: (endpoint: string, id: any = null, showError = true) =>
    handleResponse(
      apiService.delete(`${endpoint}${id ? "/" + id : ""}`),
      showError
    ),

  serialize,
};
