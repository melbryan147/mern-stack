import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset, confirmPasswordReset } from "../../services/resetPasswordService";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");

  // Step 1: Request reset
  const handleRequest = async (e) => {
    e.preventDefault();
    try {
      const data = await requestPasswordReset(email);
      localStorage.setItem("resetToken", data.resetToken); // store token
      alert(data.message);
      setShowResetForm(true);
    } catch (err) {
      alert(err.error || "Failed to request reset");
    }
  };

  // Step 2: Confirm reset
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      const data = await confirmPasswordReset(localStorage.getItem("resetToken"), passwords.newPassword);
      alert(data.message);
      setShowResetForm(false);
      setEmail("");
      setPasswords({ newPassword: "", confirmPassword: "" });
      navigate("/login"); // ✅ redirect to login after success
    } catch (err) {
      alert(err.error || "Failed to reset password");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-sm p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center text-danger mb-4">🔒 Reset Password</h3>

        {!showResetForm ? (
          // Step 1: Request reset link
          <form onSubmit={handleRequest}>
            <div className="mb-3">
              <label className="form-label">Enter your email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-warning">
                Request Reset
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </button>
            </div>
          </form>
        ) : (
          // Step 2: Reset form
          <form onSubmit={handleResetSubmit}>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                required
                className="form-control"
              />
            </div>
            {error && <div className="text-danger mb-2">{error}</div>}
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowResetForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
