import {jwtDecode} from "jwt-decode";
// src/services/authService.js
export const loginUser = async (credentials) => {
  const response = await fetch("http://localhost:3000/auth/signin", {
    method: "POST",
    headers: {'Content-Type': 'application/json',
             'Accept': 'application/json',
             'Access-Control-Allow-Origin': '*'},
    body: JSON.stringify(credentials),
  });
      const data = await response.json();
    if (data.token) {
      localStorage.setItem("token", data.token);

      const decoded = jwtDecode(data.token); // { user_id, role, exp }
      return decoded; // return role to LoginPage
    }
  if (!response.ok) throw new Error("Login failed");
  return response.json();
};

export const registerUser = async (userData) => {
  const response = await fetch("http://localhost:3000/auth/signup", {
    method: "POST",
    headers: {'Content-Type': 'application/json',
             'Accept': 'application/json',
             'Access-Control-Allow-Origin': '*'},
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error("Signup failed");
  console.log(response);
  alert("Signup successful! Please log in.");
  return response.json();
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};
