import React, { useEffect, useState } from "react";
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  toggleActive,
} from "../services/userService";
import { useNavigate } from "react-router-dom";

const UserTable = () => {
  const navigate = useNavigate();
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

  const handleToggle = async (userId, currentStatus) => {
    try {
      const toggleData = {
        targetUserId: userId,
        action: currentStatus ? "deactivate" : "activate",
        performedBy: 1, // replace with logged-in admin ID
      };

      const updatedUser = await toggleActive(toggleData);

      setUsers((prev) =>
        prev.map((user) =>
          user.user_id === userId ? { ...user, ...updatedUser } : user
        )
      );
    } catch (err) {
      console.error("Toggle failed:", err);
    }
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
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">👥 User Management</h2>
        <button className="btn btn-danger" onClick={() => navigate("/login")}>Logout</button>
      </div>

      {/* Add User Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title">Add New User</h5>
          <div className="row g-2">
            <div className="col-md-3">
              <input
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="form-control"
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="form-control"
              />
            </div>
            <div className="col-md-3">
              <input
                type="password"
                placeholder="Password"
                value={newUser.password_hash}
                onChange={(e) => setNewUser({ ...newUser, password_hash: e.target.value })}
                className="form-control"
              />
            </div>
            <div className="col-md-2">
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="form-select"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <div className="col-md-1">
              <button className="btn btn-success w-100" onClick={handleAdd}>Add</button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Password Hash</th>
              <th>Role</th>
              <th>Status</th>
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
                  <td><input type="text" value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} className="form-control" /></td>
                  <td><input type="text" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="form-control" /></td>
                  <td><input type="password" value={editForm.password_hash} onChange={(e) => setEditForm({ ...editForm, password_hash: e.target.value })} className="form-control" /></td>
                  <td>
                    <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} className="form-select">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </td>
                  <td><input type="checkbox" checked={editForm.is_active} onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })} /></td>
                  <td>{user.created_at}</td>
                  <td>{user.updated_at}</td>
                  <td>
                    <button className="btn btn-sm btn-success me-2" onClick={handleUpdate}>Save</button>
                    <button className="btn btn-sm btn-secondary" onClick={() => setEditUserId(null)}>Cancel</button>
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
                      className={`btn btn-sm ${user.is_active ? "btn-success" : "btn-danger"}`}
                      onClick={() => handleToggle(user.user_id, user.is_active)}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td>{user.created_at}</td>
                  <td>{user.updated_at}</td>
                  <td>
                    <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-primary flex-fill" onClick={() => startEdit(user)}>Update</button>
                    <button className="btn btn-sm btn-danger flex-fill" onClick={() => handleDelete(user.user_id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
