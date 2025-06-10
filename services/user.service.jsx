import { dataService } from "./data.service";
import { networkService } from "./network.service";

class UserService {
  constructor() {}

  // Check if user is logged in
  async isLoggedIn() {
    // Check if token exists in local storage
    let token = localStorage.getItem("token");
    if (token) {
      // Check if user exists in local storage
      let user = JSON.parse(localStorage.getItem("user"));
      if (!user) return false;

      // Check if token is valid
      const res = await networkService.getUser("/user");
      console.log("isLoggedIn response:", res);

      return true;
    } else {
      return false;
    }
  }



  async registerUser(data) {
    if (!data || !data.name || !data.email || !data.password) {
      console.error("Invalid registration data:", data);
      alert("Registration Failed: Missing required fields.");
      return null;
    }
  
    try {
      const d = await networkService.registerUser(data);
      console.log("registerUser response:", d);
  
      if (d && d.token && d.user) {
        localStorage.setItem("user", JSON.stringify(d.user));
        localStorage.setItem("token", d.token);
  
        alert("Registration Successful!");
        return d;
      } else {
        console.error("Registration failed. Response missing token or user.");
        alert("Registration Failed: Invalid response from server.");
        return null;
      }
    } catch (error) {
      console.error("Error during user registration:", error);
      alert("Registration Failed: There was an error during registration.");
      return null;
    }
  }
  
  // Login user  ---previous code
  // async loginUser(data) {
  //   if (!data || !data.email || !data.password) {
  //     console.error("Invalid login data:", data);
  //     return null;
  //   }

  //   try {
  //     // Call loginUser from networkService instead of dataService
  //     let d = await networkService.loginUser(data);
  //     console.log("loginUser response:", d);

  //     if (d && d.token) {
  //       // Set user to storage
  //       localStorage.setItem("user", JSON.stringify(d));

  //       // Set token to storage
  //       localStorage.setItem("token", d.token);

  //       return d;
  //     }
  //     return null;
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     return null;
  //   }
  // }
  
  async loginUser(data) {
    if (!data || !data.email || !data.password) {
      console.error("Invalid login data:", data);
      return null;
    }
  
    try {
      // Assuming networkService is properly set up to handle requests
      let response = await networkService.loginUser(data);
      console.log("loginUser response:", response);
  
      if (response && response.token) {
        // Set user to storage
        localStorage.setItem("user", JSON.stringify(response));
  
        // Set token to storage
        localStorage.setItem("token", response.token);
  
        return response;
      }
      return null;
    } catch (error) {
      console.error("Error during login:", error);
      return null;
    }
  }
  
  // Fetch roles
  async getRoles() {
    try {
      // Call getRoles from networkService with correct endpoint
      let d = await networkService.getRoles();
      console.log("getRoles response:", d);

      if (d) {
        return d;
      }
      return null;
    } catch (error) {
      console.error("Get roles error:", error);
      return null;
    }
  }
}

// Export a single instance (Singleton pattern)
export const userService = new UserService();