import axios from "axios";

const API_URL = "http://localhost:3000/phonebook";

const getHeaders = (isFormData = false) => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    ...(isFormData ? {} : { "Content-Type": "application/json,multipart/form-data" }),
  },
});

export const getContacts = async () => {
  const response = await axios.get(`${API_URL}/contacts`, getHeaders());
  console.log(response.data);
  return response.data;
};

export const addContact = async (contact) => {
  console.log(contact);
  const isFormData = contact instanceof FormData;
  console.log(isFormData);
  const response = await axios.post(`${API_URL}/contacts`, contact, getHeaders(isFormData));
  return response.data;
};

export const updateContact = async (id, contact) => {
  const isFormData = contact instanceof FormData;
  console.log(contact);
  console.log(isFormData);
  const response = await axios.put(`${API_URL}/contacts/${id}`, contact, getHeaders(isFormData));
  return response.data;
};

export const deleteContact = async (id) => {
  const response = await axios.delete(`${API_URL}/contacts/${id}`, getHeaders());
  return response.data;
};
