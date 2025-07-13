import React from "react";

const loaderStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)", // Subtle blur effect for background
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100%", // Ensure the container takes full height
  },
  spinner: {
    width: "60px",
    height: "60px",
    border: "6px solid transparent",
    borderTop: "6px solid #8C956B",
    borderRight: "6px solid #A8B5A2",
    borderBottom: "6px solid #8C956B",
    borderLeft: "6px solid #A8B5A2",
    borderRadius: "50%",
    animation: "spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
    boxShadow: "0 0 15px rgba(140, 149, 107, 0.3)", // Subtle glow effect
  },
  text: {
    color: "#fff",
    fontSize: "20px",
    fontWeight: "600",
    marginTop: "16px",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)", // Depth for text
    animation: "pulse 2s ease-in-out infinite", // Pulse animation for text
    textAlign: "center", // Ensure text is centered
  },
};

const Loader = ({ text = "Loading..." }) => {
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-[1000]"
      style={loaderStyles.overlay}
    >
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
          }
        `}
      </style>
      <div style={loaderStyles.container}>
        <div
          className="w-12 h-12 rounded-full animate-spin"
          style={loaderStyles.spinner}
        ></div>
        <p style={loaderStyles.text}>{text}</p>
      </div>
    </div>
  );
};

export default Loader;