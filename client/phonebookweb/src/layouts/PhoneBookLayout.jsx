import React, { useState, useEffect } from "react";
import {
  getContacts,
  addContact,
  updateContact,
  deleteContact,
} from "../services/phoneBookService";
import {
  shareContact,
  unshareContact,
} from "../services/shareContactService";
import { useNavigate } from "react-router-dom";

export default function PhoneBook() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({
    contact_id: null,
    firstname: "",
    lastname: "",
    email: "",
    contact_numbers: [""],
    photo_url: "", // ✅ new field for profile upload
  });

  const [shareForm, setShareForm] = useState({ contactId: null, sharedUserId: "" });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const data = await getContacts();
    setContacts(data);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    setForm({ ...form, photo_url: e.target.files[0] }); // ✅ store file object
  };

  const handleNumberChange = (index, value) => {
    const numbers = [...form.contact_numbers];
    numbers[index] = value;
    console.log(numbers);
    setForm({ ...form, contact_numbers: numbers });
  };

  const addNumberField = () =>
    setForm({ ...form, contact_numbers: [...form.contact_numbers, ""] });

  const removeNumberField = (index) => {
    const numbers = form.contact_numbers.filter((_, i) => i !== index);
    setForm({ ...form, contact_numbers: numbers.length ? numbers : [""] });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("firstname", form.firstname);
  formData.append("lastname", form.lastname);
  formData.append("email", form.email);
  form.contact_numbers.forEach((num, i) =>
    formData.append(`contact_numbers[${i}]`, num)
  );
  if (form.photo_url) {
    formData.append("photo_url", form.photo_url);
  }

  try {
    if (form.contact_id) {
      await updateContact(form.contact_id, formData);
      alert("✅ Contact updated successfully!");
    } else {
      await addContact(formData);
      alert("✅ Contact added successfully!");
    }

    setForm({
      contact_id: null,
      firstname: "",
      lastname: "",
      email: "",
      contact_numbers: [""],
      photo_url: "",
    });
    fetchContacts();
  } catch (error) {
    console.error(error);
    alert("❌ Failed to save contact. Please try again.");
  }
};

  const handleEdit = (contact) => setForm(contact);

const handleDelete = async (id) => {
  try {
    await deleteContact(id);
    alert("✅ Contact deleted successfully!");
    fetchContacts();
  } catch (error) {
    console.error(error);
    alert("❌ Failed to delete contact. Please try again.");
  }
};
  const openShareForm = (contactId) => {
    setShareForm({ contactId, sharedUserId: "" });
  };

  const handleShareSubmit = async (e) => {
    e.preventDefault();
    try {
      await shareContact(shareForm.contactId, shareForm.sharedUserId);
      alert("Contact shared successfully!");
      setShareForm({ contactId: null, sharedUserId: "" });
    } catch (err) {
      alert("Error sharing contact");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">📒 Phone Book</h2>
        <button className="btn btn-danger" onClick={() => navigate("/login")}>
          Logout
        </button>
      </div>

      {/* Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  name="firstname"
                  placeholder="First Name"
                  value={form.firstname}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="col-md-4">
                <input
                  name="lastname"
                  placeholder="Last Name"
                  value={form.lastname}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="col-md-4">
                <input
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            {/* ✅ Profile Upload */}
            <div className="mt-3">
              <label className="form-label">Upload Profile Photo</label>
              <input
                type="file"
                name="photo_url"
                accept="image/*"
                onChange={handleFileChange}
                className="form-control"
              />
            </div>

            <div className="mt-3">
              {form.contact_numbers.map((num, index) => (
                <div key={index} className="input-group mb-2">
                  <input
                    placeholder={`Contact Number ${index + 1}`}
                    value={num}
                    onChange={(e) => handleNumberChange(index, e.target.value)}
                    required
                    className="form-control"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => removeNumberField(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-outline-primary me-2"
                onClick={addNumberField}
              >
                + Add Number
              </button>
              <button type="submit" className="btn btn-success">
                {form.contact_id ? "Save Contact" : "Add Contact"}
              </button>
            </div>
          </form>
        </div>
      </div>

{/* Table */}
<div className="table-responsive">
  <table className="table table-striped table-bordered table-hover align-middle">
    <thead className="table-primary">
      <tr>
        <th>Profile</th>
        <th>Firstname</th>
        <th>Lastname</th>
        <th>Email</th>
        <th>Contact Numbers</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {contacts.map((c) => (
        <tr key={c.contact_id}>
          <td>
            <img
              src={c.photo_url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="profile"
              className="rounded-circle"
              width="40"
              height="40"
            />
          </td>
          <td>{c.firstname}</td>
          <td>{c.lastname}</td>
          <td>{c.email}</td>
          <td>
            {/* ✅ Dropdown for contact numbers */}
            <select className="form-select form-select-sm">
              {c.contact_numbers.map((num, idx) => (
                <option key={idx} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </td>
          <td>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => handleEdit(c)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(c.contact_id)}
              >
                Delete
              </button>
              <button
                className="btn btn-sm btn-warning"
                onClick={() => openShareForm(c.contact_id)}
              >
                Share
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      {/* Share Contact Form */}
      {shareForm.contactId && (
        <div className="card shadow-sm mt-3">
          <div className="card-body">
            <h5 className="card-title">Share Contact</h5>
            <form onSubmit={handleShareSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Enter user ID or email"
                  value={shareForm.sharedUserId}
                  onChange={(e) =>
                    setShareForm({ ...shareForm, sharedUserId: e.target.value })
                  }
                  className="form-control"
                  required
                />
                <button type="submit" className="btn btn-success">
                  Share
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShareForm({ contactId: null, sharedUserId: "" })}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
