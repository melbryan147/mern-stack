import axios from "axios";

const API_URL = "http://localhost:3000/auth/reset";

// ✅ Request reset link
export const requestPasswordReset = async (email) => {
  try {
    const res = await axios.post(`${API_URL}/request`, { email });
    return res.data;
  } catch (err) {
    console.error("Error requesting password reset:", err);
    throw err.response?.data || err;
  }
};

// ✅ Confirm reset with token + new password
export const confirmPasswordReset = async (token, newPassword) => {
  try {
    const res = await axios.post(`${API_URL}/confirm`, {
      token,
      newPassword,
    });
    return res.data;
  } catch (err) {
    console.error("Error confirming password reset:", err);
    throw err.response?.data || err;
  }
};
