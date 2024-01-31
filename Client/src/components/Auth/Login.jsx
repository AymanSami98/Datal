// client/src/components/Login.js

import { useState } from "react";
import axios from "axios"; // Import Axios
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../middleware";
function Login() {
  const navigate = useNavigate(); // Initialize the navigate function
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const { setIsAuthenticated } = useAuth(); // Get the isAuthenticated function from the AuthContext
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
        "http://localhost:8000/api/v1/auth/login",
        formData
      );

      if (response.status === 200) {
        // Successful login
        setMessage("Login successful");
        setIsAuthenticated(true);
        navigate("/dashboard");
      } else {
        const errorMessage =
          response.data.message || "An error occurred during login.";
        setMessage(errorMessage);
      }
    } catch (error) {
      // Handle network or unexpected errors
      const errorMessage = error.response
        ? error.response.data.message || "An error occurred during login."
        : "An unexpected error occurred during login.";
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
                Log in
              </button>
              <div>
                Does not have an account?
                <Link to="/signup" className="sign-in-link">
                  Sign Up.
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

export default Login;
