// src/services/userService.js
import axios from "axios";

const API_URL = "http://localhost:3000/user"; 
// Adjust if your backend runs on a different port

const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // adjust if you store elsewhere
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all users
export const getUsers = async () => {
  const res = await axios.get(`${API_URL}/all`, getAuthHeaders());
  return res.data;
};

// Add new user
export const addUser = async (newUser) => {
  const res = await axios.post(`${API_URL}/insert`, newUser, getAuthHeaders());
  return res.data;
};

// Update user
export const updateUser = async (id, updatedData) => {
  const res = await axios.put(`${API_URL}/update/${id}`, updatedData, getAuthHeaders());
  return res.data;
};

// Delete user
export const deleteUser = async (id) => {
  await axios.delete(`${API_URL}/delete/${id}`, getAuthHeaders());
  return true;
};

// Toggle active status
export const toggleActive = async (toggleData) => {
  const res = await axios.put(`${API_URL}/toggle`, toggleData, getAuthHeaders());
  return res.data;
};
