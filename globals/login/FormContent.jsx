"use client";

import { useState } from "react";
import Link from "next/link";

const FormContent = ({ onSubmit, onSwitchRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { email, password, rememberMe };
    onSubmit(formData);
  };

  const handleSignup = () => {
    onSwitchRegister();
  };

  return (
    <div className="form-inner">
      <h3>Login to Domesta</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
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
          <label>Password</label>
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