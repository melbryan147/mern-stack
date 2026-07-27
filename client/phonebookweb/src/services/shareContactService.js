import axios from "axios";

const API_URL = "http://localhost:3000/contacts"; // adjust to your backend route

// Share a contact with another user
export const shareContact = async (contactId, sharedUserId) => {
  try {
    const res = await axios.post(`${API_URL}/${contactId}/share`, {
      sharedUserId,
    });
    return res.data;
  } catch (err) {
    console.error("Error sharing contact:", err);
    throw err;
  }
};

// Unshare a contact from a user
export const unshareContact = async (contactId, sharedUserId) => {
  try {
    const res = await axios.post(`${API_URL}/${contactId}/unshare`, {
      sharedUserId,
    });
    return res.data;
  } catch (err) {
    console.error("Error unsharing contact:", err);
    throw err;
  }
};

// Get all contacts visible to current user (own + shared)
export const getSharedContacts = async () => {
  try {
    const res = await axios.get(`${API_URL}/shared`);
    return res.data;
  } catch (err) {
    console.error("Error fetching shared contacts:", err);
    throw err;
  }
};
