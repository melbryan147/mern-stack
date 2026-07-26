import React, { useState } from "react";
import { logoutUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const UserTable = () => {
  const navigate = useNavigate();
  function handleLogout() {
    logoutUser();
    navigate("/login"); // Redirect to login page after logout
  }
  const [users, setUsers] = useState([
    {
      userId: 1,
      email: "alice@example.com",
      role: "admin",
      isActive: true,
      createdAt: "2026-07-20",
      updatedAt: "2026-07-23",
    },
    {
      userId: 2,
      email: "bob@example.com",
      role: "user",
      isActive: false,
      createdAt: "2026-07-21",
      updatedAt: "2026-07-23",
    },
  ]);

  const [newUser, setNewUser] = useState({
    email: "",
    role: "user",
    isActive: true,
  });

  const [editUserId, setEditUserId] = useState(null);
  const [editForm, setEditForm] = useState({ email: "", role: "", isActive: true });

  // Toggle Active
  const toggleActive = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.userId === id
          ? { ...user, isActive: !user.isActive, updatedAt: new Date().toISOString().split("T")[0] }
          : user
      )
    );
  };

  // Delete User
  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((user) => user.userId !== id));
  };

  // Add User
  const addUser = () => {
    const nextId = users.length ? Math.max(...users.map((u) => u.userId)) + 1 : 1;
    const today = new Date().toISOString().split("T")[0];
    setUsers([
      ...users,
      {
        userId: nextId,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.isActive,
        createdAt: today,
        updatedAt: today,
      },
    ]);
    setNewUser({ email: "", role: "user", isActive: true });
  };

  // Start Editing
  const startEdit = (user) => {
    setEditUserId(user.userId);
    setEditForm({ email: user.email, role: user.role, isActive: user.isActive });
  };

  // Save Update
  const saveUpdate = () => {
    setUsers((prev) =>
      prev.map((user) =>
        user.userId === editUserId
          ? { ...user, ...editForm, updatedAt: new Date().toISOString().split("T")[0] }
          : user
      )
    );
    setEditUserId(null);
    setEditForm({ email: "", role: "", isActive: true });
  };

  return (
  <>
    <div>
      <h2>User Management Table</h2>
      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>Logout</button>
      {/* Add User Form */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
        <button onClick={addUser}>Add User</button>
      </div>

      {/* Table */}
      <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "center" }}>
        <thead>
          <tr>
            <th>UserID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Is Active</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) =>
            editUserId === user.userId ? (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>
                  <input
                    type="text"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
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
                    checked={editForm.isActive}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                  />
                </td>
                <td>{user.createdAt}</td>
                <td>{user.updatedAt}</td>
                <td>
                  <button onClick={saveUpdate}>Save</button>
                  <button onClick={() => setEditUserId(null)}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    onClick={() => toggleActive(user.userId)}
                    style={{
                      backgroundColor: user.isActive ? "green" : "red",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td>{user.createdAt}</td>
                <td>{user.updatedAt}</td>
                <td>
                  <button onClick={() => startEdit(user)}>Update</button>
                  <button
                    onClick={() => deleteUser(user.userId)}
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
    </>
  );
};

export default UserTable;
