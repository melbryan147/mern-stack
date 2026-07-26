import axios from "axios";

const API_URL = "http://localhost:3000/phonebook";

export const getContacts = async () => {
  const response = await axios.get(`${API_URL}/contacts`);
  return response.data;
};

export const addContact = async (contact) => {
  const response = await axios.post(`${API_URL}/contacts`, contact);
  return response.data;
};

export const updateContact = async (id, contact) => {
  const response = await axios.put(`${API_URL}/contacts/${id}`, contact);
  return response.data;
};

export const deleteContact = async (id) => {
  const response = await axios.delete(`${API_URL}/contacts/${id}`);
  return response.data;
};
