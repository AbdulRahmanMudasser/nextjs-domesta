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
    console.log("API Response:", response);
    const data = response.data.data || response.data || response;
    console.log("Extracted Data:", data);
    return data;
  } catch (error: any) {
    console.error("API Error:", error.response || error);
    const err = error.response?.data || error;

    if (showError && err?.message) {
      utilityService.showToast(
        err.message || "An error occurred. Please try again.",
        "error"
      );
    }

    if (error.response?.status === 401) {
      console.log("Unauthorized: Clearing token and redirecting to login");
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
  getServices: () => {
    console.log("Sending GET request to https://api.zoexp.com/service/list-with-filter");
    return handleResponse(apiService.get("https://api.zoexp.com/service/list-with-filter", {}, true), false);
  },
  getIntellisenseServices: () => {
    console.log("Sending GET request to https://api.zoexp.com/service/intellisense-search");
    return handleResponse(apiService.get("https://api.zoexp.com/service/intellisense-search", {}, true), false);
  },
  deleteService: (id: number) => {
    console.log("Sending DELETE request to https://api.zoexp.com/service/delete with IDs:", [id]);
    return handleResponse(apiService.delete("https://api.zoexp.com/service/delete", { data: { ids: [id] } }, true), true);
  },
  getSingleService: (id: number) => {
    console.log(`Sending GET request to https://api.zoexp.com/service/single/${id}`);
    return handleResponse(apiService.get(`https://api.zoexp.com/service/single/${id}`, {}, true), false);
  },
  addService: (data: any) => {
    console.log("Sending POST request to https://api.zoexp.com/service/add with data:", data);
    return handleResponse(apiService.post("https://api.zoexp.com/service/add", data, {}, true), true);
  },
  editService: (data: any) => {
    console.log("Sending POST request to https://api.zoexp.com/service/edit with data:", data);
    return handleResponse(apiService.post("https://api.zoexp.com/service/edit", data, {}, true), true);
  },
  forgotPassword: (data: any) => {
    console.log("Sending POST request to https://api.zoexp.com/user/forgot-password with data:", data);
    return handleResponse(apiService.post("https://api.zoexp.com/user/forgot-password", data, {}, false), true);
  },
  uploadMedia: (file: File) => {
    console.log("Sending POST request to https://api.zoexp.com/media/add with file:", file.name);
    const formData = new FormData();
    formData.append("media", file);
    return handleResponse(
      apiService.post("/media/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }, false),
      true
    );
  },
  getDropdowns: (types: string) => {
    console.log(`Sending GET request to https://api.zoexp.com/dropdowns?types=${types}`);
    return handleResponse(apiService.get(`/dropdowns?types=${types}`, {}, false), false);
  },
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