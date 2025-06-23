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
        console.log("isLoggedIn response:", res);
        return true;
      } catch (error) {
        console.error("isLoggedIn error:", error);
        return false;
      }
    }
    return false;
  }

  async registerUser(data) {
    if (!data || !data.first_name || !data.last_name || !data.email || !data.password || !data.role_id) {
      console.error("Invalid registration data:", data);
      await utilityService.showAlert("Error", "Registration Failed: Missing required fields.", "error");
      return null;
    }
  
    try {
      console.log("user.service: Calling networkService.registerUser with data:", data);
      const response = await networkService.registerUser(data);
      console.log("user.service: registerUser response:", response);
  
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
        console.error("Registration failed. Response missing token or role_id:", response);
        await utilityService.showAlert("Error", "Registration Failed: Invalid response from server.", "error");
        return null;
      }
    } catch (error) {
      console.error("user.service: registerUser error:", error);
      await utilityService.showAlert("Error", `Registration Failed: ${error.message || "Server error."}`, "error");
      return null;
    }
  }
  
  async loginUser(data) {
    if (!data || !data.email || !data.password) {
      console.error("Invalid login data:", data);
      await utilityService.showAlert("Error", "Please provide email and password", "error");
      return null;
    }
  
    try {
      console.log("user.service: Calling networkService.loginUser with data:", data);
      const response = await networkService.loginUser(data);
      console.log("user.service: loginUser response:", response);
  
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
      console.error("Login failed. Response missing token or role_id:", response);
      await utilityService.showAlert("Error", "Login Failed: Invalid response from server.", "error");
      return null;
    } catch (error) {
      console.error("user.service: loginUser error:", error);
      await utilityService.showAlert("Error", `Login Failed: ${error.message || "Server error."}`, "error");
      return null;
    }
  }

  async logoutUser() {
    try {
      console.log("user.service: Calling networkService.logoutUser");
      const response = await networkService.logoutUser();
      console.log("user.service: logoutUser response:", response);
  
      if (response && response.status) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("user_role");
        await utilityService.showAlert("Success", "Logout Successful!", "success");
        return response;
      } else {
        console.error("Logout failed. Invalid response:", response);
        await utilityService.showAlert("Error", "Logout Failed: Invalid response from server.", "error");
        return null;
      }
    } catch (error) {
      console.error("user.service: logoutUser error:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("user_role");
      await utilityService.showAlert("Error", `Logout Failed: ${error.message || "Server error."}`, "error");
      return null;
    }
  }
  
  async getRoles() {
    try {
      console.log("user.service: Calling networkService.getRoles");
      const response = await networkService.getRoles();
      console.log("user.service: getRoles response:", response);
      if (response) {
        return response;
      }
      console.warn("No roles returned from networkService.getRoles");
      await utilityService.showAlert("Error", "Failed to fetch roles.", "error");
      return null;
    } catch (error) {
      console.error("user.service: getRoles error:", error);
      await utilityService.showAlert("Error", "Failed to fetch roles. Please try again.", "error");
      return null;
    }
  }
}

export const userService = new UserService();