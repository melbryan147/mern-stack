// src/pages/Auth/LoginPage.jsx
import { useState } from "react";
import { loginUser } from "../../services/authService";
import {useNavigate} from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  // const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginUser(form);
      console.log("Login successful:", userData);
      // Handle successful login (e.g., store token, redirect)
      navigate("/ums"); // Redirect to a protected route after login
      if (userData.role === "admin" || userData.role === "superadmin") {
        navigate("/ums"); // Redirect to admin dashboard
      }else if (userData.role === "user") {
        navigate("/phonebook"); // Redirect to user dashboard
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
