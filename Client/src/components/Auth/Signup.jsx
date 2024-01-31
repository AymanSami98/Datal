// client/src/components/Signup.js

import { useState } from "react";
import axios from "axios"; // Import Axios
import "./style.css";
import { Link } from "react-router-dom";
function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/signup",
        formData
      );

      if (response.status === 201 || response.status === 200) {
        setMessage("Signup successful");
        // Redirect or perform any other actions you need upon successful signup
      } else {
        const errorMessage =
          response.data.message || "An error occurred during Signup.";

        setMessage(errorMessage);
      }
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message || "An error occurred during signup."
        : "An unexpected error occurred during signup.";
      setMessage(errorMessage);
    }
  };

  return (
    <div className="login">
      <div className="App">
        <div className="left"></div>
        <div className="right">
          <h2>Welcome To Datal</h2>
          <p>This is a test page</p>
          <div className="form">
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button type="submit" className="btn">
                Sign Up
              </button>
              <div>
                Already have an account?
                <Link to="/login" className="sign-in-link">
                  Log in.
                </Link>
              </div>
            </form>
            {message && <p>{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
