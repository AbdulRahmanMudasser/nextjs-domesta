import { useState } from "react";
import Link from "next/link";

const FormContent = ({ onSubmit, onSwitchRegister }) => {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    const formData = {
      email,
      password,
      rememberMe,
    };

    console.log("FormContent submitting:", formData); // Debug log
    onSubmit(formData);
  };

  const handleSignup = () => {
    onSwitchRegister(); // Call the function to switch to the registration form
  };

  return (
    <div className="form-inner">
      <h3>Login to Domesta</h3>

      {/* Login Form */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            name="username"
            placeholder="email"
            required
            value={email} // Controlled input
            onChange={(e) => setUsername(e.target.value)} // Update state on input change
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={password} // Controlled input
            onChange={(e) => setPassword(e.target.value)} // Update state on input change
          />
        </div>

        <div className="form-group">
          <div className="field-outer">
            <div className="input-group checkboxes square">
              <input
                type="checkbox"
                name="remember-me"
                id="remember"
                checked={rememberMe} // Controlled input
                onChange={(e) => setRememberMe(e.target.checked)} // Update state on checkbox change
              />
              {/* <label htmlFor="remember" className="remember">
                <span className="custom-checkbox"></span> Remember me
              </label> */}
            </div>
            {/* <a href="#" className="pwd">
              Forgot password?
            </a> */}
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




// "use client";

// import { useState } from "react";
// import Link from "next/link";

// const FormContent = ({ onSubmit, onSwitchRegister }) => {
//   const [email, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault(); // Prevent page reload on form submit

//     const formData = {
//       email,
//       password,
//       rememberMe,
//     };

//     console.log("FormContent submitting:", formData); // Debug log
//     onSubmit(formData);
//   };

//   const handleSignup = () => {
//     onSwitchRegister(); // Call the function to switch to the registration form
//   };

//   return (
//     <div className="form-inner">
//       <h3>Login to Domesta</h3>

//       {/* Login Form */}
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Email</label>
//           <input
//             type="text"
//             name="username"
//             placeholder="email"
//             required
//             value={email} // Controlled input
//             onChange={(e) => setUsername(e.target.value)} // Update state on input change
//           />
//         </div>

//         <div className="form-group">
//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             required
//             value={password} // Controlled input
//             onChange={(e) => setPassword(e.target.value)} // Update state on input change
//           />
//         </div>

//         <div className="form-group">
//           <div className="field-outer">
//             <div className="input-group checkboxes square">
//               <input
//                 type="checkbox"
//                 name="remember-me"
//                 id="remember"
//                 checked={rememberMe} // Controlled input
//                 onChange={(e) => setRememberMe(e.target.checked)} // Update state on checkbox change
//               />
//               <label htmlFor="remember" className="remember">
//                 <span className="custom-checkbox"></span> Remember me
//               </label>
//             </div>
//             <a href="#" className="pwd">
//               Forgot password?
//             </a>
//           </div>
//         </div>

//         <div className="form-group">
//           <button
//             className="theme-btn btn-style-one"
//             type="submit"
//             name="log-in"
//             onClick={(e) => {
//               e.preventDefault();
//               handleLogin();
//             }}
//           >
//             Log In
//           </button>
//         </div>
//       </form>

//       <div className="bottom-box">
//         <div className="text">
//           Don't have an account?{" "}
//           <span
//             className="call-modal signup"
//             onClick={handleSignup}
//             style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
//           >
//             Signup
//           </span>
//         </div>
//       </div>
      
//     </div>
//   );
// };

// export default FormContent;
