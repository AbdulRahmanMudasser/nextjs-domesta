import { networkService } from "./network.service";
import { utilityService } from "./utility.service";

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
      await utilityService.showAlert("Error", "Registration Failed: Missing required fields.", "error");
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
        await utilityService.showAlert("Success", "Registration Successful!", "success");
        return response;
      } else {
        await utilityService.showAlert("Error", "Registration Failed: Invalid response from server.", "error");
        return null;
      }
    } catch (error) {
      await utilityService.showAlert("Error", `Registration Failed: ${error.message || "Server error."}`, "error");
      return null;
    }
  }
  
  async loginUser(data) {
    if (!data || !data.email || !data.password) {
      await utilityService.showAlert("Error", "Please provide email and password", "error");
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
      await utilityService.showAlert("Error", `Login Failed: ${response?.error || "Invalid response from server."}`, "error");
      return null;
    } catch (error) {
      await utilityService.showAlert("Error", `Login Failed: ${error.message || "Server error."}`, "error");
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
        await utilityService.showAlert("Success", "Logout Successful!", "success");
        return response;
      } else {
        await utilityService.showAlert("Error", "Logout Failed: Invalid response from server.", "error");
        return null;
      }
    } catch (error) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("user_role");
      await utilityService.showAlert("Error", `Logout Failed: ${error.message || "Server error."}`, "error");
      return null;
    }
  }
  
  async getRoles() {
    try {
      const response = await networkService.getRoles();
      if (response) {
        return response;
      }
      await utilityService.showAlert("Error", "Failed to fetch roles.", "error");
      return null;
    } catch (error) {
      await utilityService.showAlert("Error", "Failed to fetch roles. Please try again.", "error");
      return null;
    }
  }

  async getServices() {
    try {
      console.log("Calling networkService.getServices");
      const response = await networkService.getServices();
      console.log("getServices response:", response);
      if (response) {
        return response;
      }
      console.warn("No services returned from networkService.getServices");
      await utilityService.showAlert("Error", "Failed to fetch services.", "error");
      return null;
    } catch (error) {
      console.error("getServices error:", error);
      await utilityService.showAlert("Error", "Failed to fetch services. Please try again.", "error");
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
      await utilityService.showAlert("Error", "Failed to delete service.", "error");
      return null;
    } catch (error) {
      console.error("deleteService error:", error);
      await utilityService.showAlert("Error", `Failed to delete service: ${error.message || "Server error."}`, "error");
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
      await utilityService.showAlert("Error", "Failed to fetch service details.", "error");
      return null;
    } catch (error) {
      console.error("getSingleService error:", error);
      await utilityService.showAlert("Error", "Failed to fetch service details. Please try again.", "error");
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
      await utilityService.showAlert("Error", "Failed to add service.", "error");
      return null;
    } catch (error) {
      console.error("addService error:", error);
      await utilityService.showAlert("Error", `Failed to add service: ${error.message || "Server error."}`, "error");
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
      await utilityService.showAlert("Error", "Failed to edit service.", "error");
      return null;
    } catch (error) {
      console.error("editService error:", error);
      await utilityService.showAlert("Error", `Failed to edit service: ${error.message || "Server error."}`, "error");
      return null;
    }
  }
}

export const userService = new UserService();