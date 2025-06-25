"use client";

import { useState } from "react";
import Link from "next/link";

const FormContent = ({ onSubmit, onSwitchRegister, onSwitchForgotPassword }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { email, password, rememberMe };
    console.log("Submitting login form:", formData);
    onSubmit(formData);
  };

  const handleSignup = () => {
    console.log("Clicked Signup link");
    onSwitchRegister();
  };

  const handleForgotPassword = () => {
    console.log("Clicked Forgot Password link");
    onSwitchForgotPassword();
  };

  return (
    <div className="form-inner">
      <h3 style={{ margin: "0 0 1.5rem 0" }}>Login to Domesta</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label style={{ marginBottom: "0.5rem" }}>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label style={{ marginBottom: "0.5rem" }}>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <div className="field-outer">
            <div className="input-group checkboxes square">
              <input
                type="checkbox"
                name="remember-me"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            </div>
          </div>
        </div>
        <div className="form-group" style={{ textAlign: "right" }}>
          <span
            className="call-modal"
            onClick={handleForgotPassword}
            style={{ cursor: "pointer", textDecoration: "underline", display: "block", margin: "0 0 1rem 0" }}
          >
            Forgot Password?
          </span>
        </div>
        <div className="form-group">
          <button
            className="theme-btn btn-style-one"
            type="submit"
            name="log-in"
          >
            Log In
          </button>
        </div>
      </form>
      <div className="bottom-box">
        <div className="text">
          Don't have an account?{" "}
          <span
            className="call-modal signup"
            onClick={handleSignup}
            style={{ cursor: "pointer", textDecoration: "underline" }}
          >
            Signup
          </span>
        </div>
      </div>
    </div>
  );
};

export default FormContent;