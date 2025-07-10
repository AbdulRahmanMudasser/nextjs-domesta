import React from "react";
import PropTypes from "prop-types";

const Modal = ({ isOpen, onClose, children, isWide = false }) => {
  if (!isOpen) return null;

  const modalStyle = {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: "#fff",
    borderRadius: "0.5rem",
    padding: "1rem",
    position: "relative",
    maxWidth: isWide ? "90vw" : "600px",
    width: "100%",
    maxHeight: "90vh",
    overflow: "auto",
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#ff4d4f",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "18px",
  };

  return (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        <button onClick={onClose} style={closeButtonStyle} title="Close">
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  isWide: PropTypes.bool,
};

export default Modal;