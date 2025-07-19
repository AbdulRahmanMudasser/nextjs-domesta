import { networkService } from "./network.service";
import { notificationService } from "./notification.service";

class UserService {
  constructor() {}

  async isLoggedIn() {
    let token = localStorage.getItem("token");
    if (token) {
      let user = JSON.parse(localStorage.getItem("user"));
      if (!user) return false;

      try {
        const res = await networkService.get("/user");
        return true;
      } catch (error) {
        return false;
      }
    }
    return false;
  }

  async registerUser(data) {
    if (!data || !data.first_name || !data.last_name || !data.email || !data.password || !data.role_id) {
      await notificationService.showToast("Registration Failed: Missing required fields.", "error");
      return null;
    }
  
    try {
      const response = await networkService.registerUser(data);
      if (response && response.token && response.role_id) {
        localStorage.setItem("user", JSON.stringify({
          id: response.id,
          email: response.email,
          first_name: response.first_name,
          last_name: response.last_name,
          role_id: response.role_id,
        }));
        localStorage.setItem("token", response.token);
        await notificationService.showToast("Registration Successful!", "success");
        return response;
      } else {
        await notificationService.showToast("Registration Failed: Invalid response from server.", "error");
        return null;
      }
    } catch (error) {
      await notificationService.showToast(`Registration Failed: ${error.message || "Server error."}`, "error");
      return null;
    }
  }
  
  async loginUser(data) {
    if (!data || !data.email || !data.password) {
      await notificationService.showToast("Please provide email and password", "error");
      return null;
    }
  
    try {
      const response = await networkService.loginUser(data);
      if (response && response.token && response.role_id) {
        localStorage.setItem("user", JSON.stringify({
          id: response.id,
          email: response.email,
          first_name: response.first_name,
          last_name: response.last_name,
          role_id: response.role_id,
        }));
        localStorage.setItem("token", response.token);
        return response;
      }
      await notificationService.showToast(`Login Failed: ${response?.error || "Invalid response from server."}`, "error");
      return null;
    } catch (error) {
      await notificationService.showToast(`Login Failed: ${error.message || "Server error."}`, "error");
      return null;
    }
  }

  async logoutUser() {
    try {
      const response = await networkService.logoutUser();
      if (response && response.status) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("user_role");
        await notificationService.showToast("Logout Successful!", "success");
        return response;
      } else {
        await notificationService.showToast("Logout Failed: Invalid response from server.", "error");
        return null;
      }
    } catch (error) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("user_role");
      await notificationService.showToast(`Logout Failed: ${error.message || "Server error."}`, "error");
      return null;
    }
  }
  
  async getRolesWithFilters() {
    try {
      console.log("Calling networkService.getRoles for /user/role/list-with-filters");
      const response = await networkService.getRoles();
      console.log("Raw getRolesWithFilters response:", response);
      if (response && Array.isArray(response)) {
        const filteredRoles = response.filter((role) => role.slug !== "user");
        console.log("Processed roles (filtered):", filteredRoles);
        return filteredRoles;
      }
      console.warn("Invalid roles response:", response);
      await notificationService.showToast("Failed to fetch roles.", "error");
      return null;
    } catch (error) {
      console.error("getRolesWithFilters error:", error);
      await notificationService.showToast("Failed to fetch roles. Please try again.", "error");
      return null;
    }
  }

  async getServices() {
    try {
      console.log("Calling networkService.getServices for /service/list-with-filter");
      const response = await networkService.getServices();
      console.log("getServices response:", response);
      if (response) {
        return response;
      }
      console.warn("No services returned from networkService.getServices");
      await notificationService.showToast("Failed to fetch services.", "error");
      return null;
    } catch (error) {
      console.error("getServices error:", error);
      await notificationService.showToast("Failed to fetch services. Please try again.", "error");
      return null;
    }
  }

  async deleteService(id) {
    try {
      console.log("Calling networkService.deleteService with ID:", id);
      const response = await networkService.deleteService(id);
      console.log("deleteService response:", response);
      if (response) {
        return response;
      }
      console.warn("Failed to delete service with ID:", id);
      await notificationService.showToast("Failed to delete service.", "error");
      return null;
    } catch (error) {
      console.error("deleteService error:", error);
      await notificationService.showToast(`Failed to delete service: ${error.message || "Server error."}`, "error");
      return null;
    }
  }

  async getSingleService(id) {
    try {
      console.log("Calling networkService.getSingleService with ID:", id);
      const response = await networkService.getSingleService(id);
      console.log("getSingleService response:", response);
      if (response) {
        return response;
      }
      console.warn("No service details returned for ID:", id);
      await notificationService.showToast("Failed to fetch service details.", "error");
      return null;
    } catch (error) {
      console.error("getSingleService error:", error);
      await notificationService.showToast("Failed to fetch service details. Please try again.", "error");
      return null;
    }
  }

  async addService(data) {
    try {
      console.log("Calling networkService.addService with data:", data);
      const response = await networkService.addService(data);
      console.log("addService response:", response);
      if (response) {
        return response;
      }
      console.warn("Failed to add service");
      await notificationService.showToast("Failed to add service.", "error");
      return null;
    } catch (error) {
      console.error("addService error:", error);
      await notificationService.showToast(`Failed to add service: ${error.message || "Server error."}`, "error");
      return null;
    }
  }

  async editService(data) {
    try {
      console.log("Calling networkService.editService with data:", data);
      const response = await networkService.editService(data);
      console.log("editService response:", response);
      if (response) {
        return response;
      }
      console.warn("Failed to edit service");
      await notificationService.showToast("Failed to edit service.", "error");
      return null;
    } catch (error) {
      console.error("editService error:", error);
      if (error.errors) {
        const errorMessages = Object.values(error.errors).flat().join("; ");
        throw new Error(errorMessages || "Invalid service data.");
      }
      await notificationService.showToast(`Failed to edit service: ${error.message || "Server error."}`, "error");
      throw error;
    }
  }

  async forgotPassword(data) {
    try {
      console.log("Calling networkService.forgotPassword with data:", data);
      const response = await networkService.forgotPassword(data);
      console.log("forgotPassword response:", response);
      if (response && response.status) {
        return response;
      }
      console.warn("Failed to send forgot password request");
      await notificationService.showToast("Failed to send reset password request.", "error");
      return null;
    } catch (error) {
      console.error("forgotPassword error:", error);
      await notificationService.showToast(`Failed to send reset password request: ${error.message || "Server error."}`, "error");
      throw error;
    }
  }

  // Employment Details Methods
  async getEmploymentDetails(userId) {
    try {
      console.log("Calling networkService.getEmploymentDetails with userId:", userId);
      const response = await networkService.getEmploymentDetails(userId);
      console.log("getEmploymentDetails response:", response);
      if (response) {
        return response;
      }
      console.warn("No employment details returned for userId:", userId);
      return null;
    } catch (error) {
      console.error("getEmploymentDetails error:", error);
      await notificationService.showToast("Failed to fetch employment details. Please try again.", "error");
      return null;
    }
  }

  async saveEmploymentDetails(data) {
    try {
      console.log("Calling networkService.saveEmploymentDetails with data:", data);
      const response = await networkService.saveEmploymentDetails(data);
      console.log("saveEmploymentDetails response:", response);
      if (response) {
        await notificationService.showToast("Employment details saved successfully!", "success");
        return response;
      }
      console.warn("Failed to save employment details");
      await notificationService.showToast("Failed to save employment details.", "error");
      return null;
    } catch (error) {
      console.error("saveEmploymentDetails error:", error);
      if (error.errors) {
        const errorMessages = Object.values(error.errors).flat().join("; ");
        await notificationService.showToast(`Failed to save employment details: ${errorMessages}`, "error");
        throw new Error(errorMessages || "Invalid employment data.");
      }
      await notificationService.showToast(`Failed to save employment details: ${error.message || "Server error."}`, "error");
      throw error;
    }
  }

  async addDocument(data) {
    try {
      console.log("Calling networkService.post for /employee/document/add with data:", data);
      const response = await networkService.post("/employee/document/add", data);
      console.log("addDocument response:", response);
      if (response) {
        await notificationService.showToast("Document added successfully!", "success");
        return response;
      }
      console.warn("Failed to add document");
      await notificationService.showToast("Failed to add document.", "error");
      return null;
    } catch (error) {
      console.error("addDocument error:", error);
      if (error.errors) {
        const errorMessages = Object.values(error.errors).flat().join("; ");
        await notificationService.showToast(`Failed to add document: ${errorMessages}`, "error");
        throw new Error(errorMessages || "Invalid document data.");
      }
      await notificationService.showToast(`Failed to add document: ${error.message || "Server error."}`, "error");
      throw error;
    }
  }

  async getDocuments(employeeId) {
    try {
      console.log(`Calling networkService.get for /employee/document/${employeeId}`);
      const response = await networkService.get(`/employee/document/${employeeId}`);
      console.log("getDocuments response:", response);
      if (Array.isArray(response)) {
        return response;
      }
      console.warn(`No documents returned for employeeId: ${employeeId}`);
      await notificationService.showToast("No documents found.", "info");
      return [];
    } catch (error) {
      console.error("getDocuments error:", error);
      await notificationService.showToast(`Failed to fetch documents: ${error.message || "Server error."}`, "error");
      return [];
    }
  }

  // DELETE DOCUMENTS METHOD
  async deleteDocuments(ids) {
    try {
      console.log("Calling networkService.deleteDocuments with IDs:", ids);
      const response = await networkService.deleteDocuments(ids);
      console.log("deleteDocuments response:", response);
      
      if (response && response.status === true) {
        const deletedCount = typeof response.data === 'number' ? response.data : ids.length;
        await notificationService.showToast(
          `Successfully deleted ${deletedCount} document(s)!`, 
          "success"
        );
        return response;
      }
      
      console.warn("Failed to delete documents with IDs:", ids);
      await notificationService.showToast("Failed to delete document(s).", "error");
      return null;
    } catch (error) {
      console.error("deleteDocuments error:", error);
      await notificationService.showToast(`Failed to delete document(s): ${error.message || "Server error."}`, "error");
      return null;
    }
  }

  // EDIT DOCUMENT METHOD
  async editDocument(data) {
    try {
      console.log("Calling networkService.editDocument with data:", data);
      const response = await networkService.editDocument(data);
      console.log("editDocument response:", response);
      
      if (response) {
        await notificationService.showToast("Document updated successfully!", "success");
        return response;
      }
      
      console.warn("Failed to edit document");
      await notificationService.showToast("Failed to edit document.", "error");
      return null;
    } catch (error) {
      console.error("editDocument error:", error);
      if (error.errors) {
        const errorMessages = Object.values(error.errors).flat().join("; ");
        await notificationService.showToast(`Failed to edit document: ${errorMessages}`, "error");
        throw new Error(errorMessages || "Invalid document data.");
      }
      await notificationService.showToast(`Failed to edit document: ${error.message || "Server error."}`, "error");
      throw error;
    }
  }
}

export const userService = new UserService();