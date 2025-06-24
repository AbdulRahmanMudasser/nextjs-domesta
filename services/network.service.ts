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
    const data = response.data.data || response.data || response;
    return data;
  } catch (error: any) {
    const err = error.response?.data || error;

    if (showError && err?.message) {
      utilityService.showToast(
        err.message || "An error occurred. Please try again.",
        "error"
      );
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user_role");
      window.location.href = "/";
    }

    throw err;
  }
};

export const networkService = {
  registerUser: (data: any) =>
    handleResponse(apiService.post("/user/register", data, {}, false), false)
      .then((response) => response),
  loginUser: (data: any) =>
    handleResponse(apiService.put("/user/login", data, {}, false), true),
  logoutUser: () =>
    handleResponse(apiService.get("/user/logout", {}, false), true),
  getRoles: () =>
    handleResponse(apiService.get("/roles", {}, true), false),

  get: (endpoint: string, id: any = null, showError = true) =>
    handleResponse(
      apiService.get(`${endpoint}${id ? "/" + id : ""}`, {}, false),
      showError
    ),

  post: (endpoint: string, data: any, id: any = null, showError = true) =>
    handleResponse(
      apiService.post(`${endpoint}${id ? "/" + id : ""}`, data, {}, false),
      showError
    ),

  put: (endpoint: string, data: any, id: any = null, showError = true) =>
    handleResponse(
      apiService.put(`${endpoint}${id ? "/" + id : ""}`, data, {}, false),
      showError
    ),

  patch: (endpoint: string, data: any, showError = true) =>
    handleResponse(apiService.patch(endpoint, data, {}, false), showError),

  delete: (endpoint: string, id: any = null, showError = true) =>
    handleResponse(
      apiService.delete(`${endpoint}${id ? "/" + id : ""}`, {}, false),
      showError
    ),

  serialize,
};