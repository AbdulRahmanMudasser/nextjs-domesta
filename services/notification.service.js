import { toast } from "react-toastify";

class NotificationService {
  constructor() {}

  async showToast(message, type = "info") {
    const backgroundColor = type === "success" ? "#8C956B" : type === "error" ? "#dc3545" : "#FF6666";

    toast(message, {
      type,
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      style: {
        background: backgroundColor,
        color: "#ffffff",
        fontFamily: "'Jost', sans-serif",
      },
    });
  }
}

export const notificationService = new NotificationService();