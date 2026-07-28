import { useState } from "react";
import { loginUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // ✅ error state

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // clear error when user types again
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginUser(form);
      console.log("Login successful:", userData);

      // Redirect based on role
      if (userData.role === "admin" || userData.role === "superadmin") {
        navigate("/ums");
      } else if (userData.role === "user") {
        navigate("/phonebook");
      } else {
        navigate("/homepage");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password. Please try again."); // ✅ user-friendly message
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-sm p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center text-primary mb-4">🔑 Login</h3>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger text-center py-2 mb-3">
              {error}
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Login
          </button>
        </form>
        <div className="text-center mt-3">
          <small>
            Don’t have an account?{" "}
            <span
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </small>
          <br />
          <small>
            <span
              className="text-danger"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/reset-password")}
            >
              Forgot Password?
            </span>
          </small>
        </div>
      </div>
    </div>
  );
}
