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
    handleResponse(apiService.post("/user/register", data, {}), false)
      .then((response) => response),
  loginUser: (data: any) =>
    handleResponse(apiService.put("/user/login", data, {}), true),
  logoutUser: () =>
    handleResponse(apiService.get("/user/logout", {}), true),
  getRoles: () => {
    console.log("Sending GET request to /user/role/list-with-filters");
    return handleResponse(apiService.get("/user/role/list-with-filters", {}), false);
  },
  getServices: () => {
    console.log("Sending GET request to /service/list-with-filter");
    return handleResponse(apiService.get("/service/list-with-filter", {}), false);
  },
  getIntellisenseServices: () => {
    console.log("Sending GET request to /service/intellisense-search");
    return handleResponse(apiService.get("/service/intellisense-search", {}), false);
  },
  deleteService: (id: number) => {
    console.log("Sending DELETE request to /service/delete with IDs:", [id]);
    return handleResponse(apiService.delete("/service/delete", { data: { ids: [id] } }), true);
  },
  getSingleService: (id: number) => {
    console.log(`Sending GET request to /service/single/${id}`);
    return handleResponse(apiService.get(`/service/single/${id}`, {}), false);
  },
  addService: (data: any) => {
    console.log("Sending POST request to /service/add with data:", data);
    return handleResponse(apiService.post("/service/add", data, {}), true);
  },
  editService: (data: any) => {
    console.log("Sending POST request to /service/edit with data:", data);
    return handleResponse(apiService.post("/service/edit", data, {}), true);
  },
  forgotPassword: (data: any) => {
    console.log("Sending POST request to /user/forgot-password with data:", data);
    return handleResponse(apiService.post("/user/forgot-password", data, {}), true);
  },
  uploadMedia: (file: File) => {
    console.log("Sending POST request to /media/add with file:", file.name);
    const formData = new FormData();
    formData.append("media", file);
    return handleResponse(
      apiService.post("/media/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
      true
    );
  },
  getDropdowns: (types: string) => {
    console.log(`Sending GET request to /dropdowns?types=${types}`);
    return handleResponse(apiService.get(`/dropdowns?types=${types}`, {}), false);
  },
  get: (endpoint: string, id: any = null, showError = true) =>
    handleResponse(
      apiService.get(`${endpoint}${id ? "/" + id : ""}`, {}),
      showError
    ),
  post: (endpoint: string, data: any, id: any = null, showError = true) =>
    handleResponse(
      apiService.post(`${endpoint}${id ? "/" + id : ""}`, data, {}),
      showError
    ),
  put: (endpoint: string, data: any, id: any = null, showError = true) =>
    handleResponse(
      apiService.put(`${endpoint}${id ? "/" + id : ""}`, data, {}),
      showError
    ),
  patch: (endpoint: string, data: any, showError = true) =>
    handleResponse(apiService.patch(endpoint, data, {}), showError),
  delete: (endpoint: string, id: any = null, showError = true) =>
    handleResponse(
      apiService.delete(`${endpoint}${id ? "/" + id : ""}`, {}),
      showError
    ),
  serialize,
};