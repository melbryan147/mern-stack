import React, { useEffect, useState } from "react";
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  toggleActive,
} from "../services/userService";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    role: "user",
    is_active: true,
    password_hash: "",
  });
  const [editUserId, setEditUserId] = useState(null);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    role: "",
    is_active: true,
    password_hash: "",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const handleAdd = async () => {
    if (!newUser.username || !newUser.email) return;
    const user = await addUser(newUser);
    setUsers((prev) => [...prev, user]);
    setNewUser({ username: "", email: "", role: "user", is_active: true, password_hash: "" });
  };

  const handleUpdate = async () => {
    const updated = await updateUser(editUserId, editForm);
    setUsers((prev) => prev.map((u) => (u.user_id === editUserId ? updated : u)));
    setEditUserId(null);
    setEditForm({ username: "", email: "", role: "", is_active: true, password_hash: "" });
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.user_id !== id));
  };

  const handleToggle = async (id) => {
    // const updated = await toggleActive({ targetUserId: id, action: toggleValue ? "activate" : "deactivate", performedBy: "current_user_id" });

    const updated = "deactivate"
    setUsers((prev) => prev.map((u) => (u.user_id === id ? updated : u)));
  };

  const startEdit = (user) => {
    setEditUserId(user.user_id);
    setEditForm({
      username: user.username,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      password_hash: user.password_hash,
    });
  };

  return (
    <div>
      <h2>User Management Table</h2>

      {/* Add User Form */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <input
          type="text"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password_hash}
          onChange={(e) => setNewUser({ ...newUser, password_hash: e.target.value })}
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
        <button onClick={handleAdd}>Add User</button>
      </div>

      {/* Table */}
      <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "center" }}>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Password Hash</th>
            <th>Role</th>
            <th>Is Active</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) =>
            editUserId === user.user_id ? (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="password"
                    value={editForm.password_hash}
                    onChange={(e) => setEditForm({ ...editForm, password_hash: e.target.value })}
                  />
                </td>
                <td>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={editForm.is_active}
                    onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                  />
                </td>
                <td>{user.created_at}</td>
                <td>{user.updated_at}</td>
                <td>
                  <button onClick={handleUpdate}>Save</button>
                  <button onClick={() => setEditUserId(null)}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.password_hash}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    onClick={() => handleToggle(user.user_id, { is_active: !user.is_active })}
                    style={{
                      backgroundColor: user.is_active ? "green" : "red",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td>{user.created_at}</td>
                <td>{user.updated_at}</td>
                <td>
                  <button onClick={() => startEdit(user)}>Update</button>
                  <button
                    onClick={() => handleDelete(user.user_id)}
                    style={{ marginLeft: "5px", backgroundColor: "darkred", color: "white" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
