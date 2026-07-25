// src/services/authService.js
export const loginUser = async (credentials) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) throw new Error("Login failed");
  return response.json();
};

export const registerUser = async (userData) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error("Signup failed");
  return response.json();
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};
