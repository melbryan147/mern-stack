import React, { useState } from "react";
import { logoutUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function PhoneBook() {
  const navigate = useNavigate();
  const initialData = [
  { 
    id: 1, 
    firstname: "Juan", 
    lastname: "Dela Cruz", 
    email: "juan@example.com", 
    contact_numbers: ["+63-912-345-6789", "+63-912-111-2222"] 
  },
  { 
    id: 2, 
    firstname: "Maria", 
    lastname: "Reyes", 
    email: "maria@example.com", 
    contact_numbers: ["+63-917-555-1234"] 
  },
];
  const [contacts, setContacts] = useState(initialData);
  const [form, setForm] = useState({ id: null, firstname: "", lastname: "", email: "", contact_numbers: [""] });

  // Handle input change for basic fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle phone number change
  const handleNumberChange = (index, value) => {
    const numbers = [...form.contact_numbers];
    numbers[index] = value;
    setForm({ ...form, contact_numbers: numbers });
  };

  // Add another phone number field
  const addNumberField = () => {
    setForm({ ...form, contact_numbers: [...form.contact_numbers, ""] });
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.id) {
      setContacts(contacts.map((c) => (c.id === form.id ? { ...form } : c)));
    } else {
      setContacts([...contacts, { ...form, id: Date.now() }]);
    }
    setForm({ id: null, firstname: "", lastname: "", email: "", contact_numbers: [""] });
  };

  // Edit contact
  const handleEdit = (contact) => {
    setForm(contact);
  };

  // Delete contact
  const handleDelete = (id) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📒 Phone Book (Multiple Numbers)</h2>
      <button onClick={() => { logoutUser(); navigate("/login"); }} style={{ marginBottom: "20px" }}>Logout</button>  

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input name="firstname" placeholder="First Name" value={form.firstname} onChange={handleChange} required />
        <input name="lastname" placeholder="Last Name" value={form.lastname} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />

        {form.contact_numbers.map((num, index) => (
          <input
            key={index}
            placeholder={`Contact Number ${index + 1}`}
            value={num}
            onChange={(e) => handleNumberChange(index, e.target.value)}
            required
          />
        ))}
        <button type="button" onClick={addNumberField}>+ Add Number</button>

        <button type="submit">{form.id ? "Update" : "Add"} Contact</button>
      </form>

      {/* Table */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Email</th>
            <th>Contact Numbers</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c.id}>
              <td>{c.firstname}</td>
              <td>{c.lastname}</td>
              <td>{c.email}</td>
              <td>{c.contact_numbers.join(", ")}</td>
              <td>
                <button onClick={() => handleEdit(c)}>Edit</button>
                <button onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
