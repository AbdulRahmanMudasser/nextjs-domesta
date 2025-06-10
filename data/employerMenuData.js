module.exports = [
  {
    id: 1,
    name: "Dashboard",
    icon: "la-home",
    routePath: "/panels/employer/dashboard",
    active: "active",
  },
  {
    id: 2,
    name: "Profile",  // Changed from "Company Profile"
    icon: "la-user-circle",
    routePath: "/panels/employer/profile",
    active: "",
  },
  // {
  //   id: 3,
  //   name: "Employee",  // Changed from "Post a New Job"
  //   icon: "la-user-friends",
  //   routePath: "/employer/employees",
  //   active: "",
  // },
  // {
  //   id: 4,
  //   name: "Agency",  // Changed from "Manage Jobs"
  //   icon: "la-building",
  //   routePath: "/employer/agencies",
  //   active: "",
  // },
  {
    id: 3,
    name: "Interviews",  // Changed from "All Applicants"
    icon: "la-comments",
    routePath: "/panels/employer/interview",
    active: "",
  },
  {
    id: 4,
    name: "Hirings",
    icon: "la-users", // Suitable icon for Hirings
    routePath: "/panels/employer/hirings",
    active: "",
  },
  
  // {
  //   id: 5,
  //   name: "Logout",
  //   icon: "la-sign-out",
  //   routePath: "/",
  //   active: "",
  // },
  // ... rest of your original entries
];