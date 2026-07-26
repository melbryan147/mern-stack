import React, { useState, useEffect } from "react";
import { getContacts, addContact, updateContact, deleteContact } from "../services/phoneBookService";
import {useNavigate} from "react-router-dom";

export default function PhoneBook() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ id: null, firstname: "", lastname: "", email: "", contact_numbers: [""] });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const data = await getContacts();
    setContacts(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNumberChange = (index, value) => {
    const numbers = [...form.contact_numbers];
    numbers[index] = value;
    setForm({ ...form, contact_numbers: numbers });
  };

  const addNumberField = () => {
    setForm({ ...form, contact_numbers: [...form.contact_numbers, ""] });
  };
    // ✅ Remove number field
  const removeNumberField = (index) => {
    const numbers = form.contact_numbers.filter((_, i) => i !== index);
    setForm({ ...form, contact_numbers: numbers.length ? numbers : [""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.contact_id) {
      await updateContact(form.contact_id, form);
    } else {
      await addContact(form);
    }
    setForm({ contact_id: null, firstname: "", lastname: "", email: "", contact_numbers: [""] });
    fetchContacts();
  };

  const handleEdit = (contact) => {
    setForm(contact);
  };

  const handleDelete = async (id) => {
    await deleteContact(id);
    fetchContacts();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📒 Phone Book</h2>
      <button onClick={() => navigate("/login")}>Logout</button>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input name="firstname" placeholder="First Name" value={form.firstname} onChange={handleChange} required />
        <input name="lastname" placeholder="Last Name" value={form.lastname} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />

        {form.contact_numbers.map((num, index) => (
          <div key={index} style={{ display: "flex", gap: "5px", marginBottom: "5px" }}>
            <input
              placeholder={`Contact Number ${index + 1}`}
              value={num}
              onChange={(e) => handleNumberChange(index, e.target.value)}
              required
            />
            <button type="button" onClick={() => removeNumberField(index)}>Remove</button>
          </div>
        ))}
      
        <button type="button" onClick={addNumberField}>+ Add Number</button>
        <button type="submit">{form.contact_id ? "Save Contact" : "Add Contact"}</button>
      </form>
        

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
            <tr key={c.contact_id}>
              <td>{c.firstname}</td>
              <td>{c.lastname}</td>
              <td>{c.email}</td>
              <td>{c.contact_numbers.join(", ")}</td>
              <td>
                <button onClick={() => handleEdit(c)}>Edit</button>
                <button onClick={() => handleDelete(c.contact_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>  
    </table>
    </div>
  );
}  