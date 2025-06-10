import users from "@/data/users";

class DataService {
  returnUser(username, password) {
    return users.find(
      (user) => user.email === username && user.password === password
    );
  }
}

// Export a single instance (Singleton pattern)
export const dataService = new DataService();
