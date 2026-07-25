// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { loginUser, logoutUser } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    setUser(data.user);
    localStorage.setItem("token", data.token);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token }); // optionally fetch profile
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
