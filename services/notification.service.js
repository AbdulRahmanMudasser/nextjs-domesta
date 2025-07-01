import { toast } from "react-toastify";

class NotificationService {
  constructor() {}

  async showToast(message, type = "info") {
    toast(message, {
      type,
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      style: {
        background: "#6e7b49",
        color: "#ffffff",
        fontFamily: "'Jost', sans-serif",
      },
    });
  }
}

export const notificationService = new NotificationService();