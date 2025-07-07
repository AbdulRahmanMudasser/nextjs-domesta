"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notification = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      toastStyle={{
        backgroundColor: "#FF9999",
        color: "#ffffff",
        fontFamily: "'Jost', sans-serif",
      }}
      className="z-50"
    />
  );
};

export default Notification;