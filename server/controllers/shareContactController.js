const db = require('../db');

// Share a contact with another user
exports.shareContact = async (req, res) => {
  const { contactId } = req.params;
  const { sharedUserId } = req.body;
  const userId = req.user.id; // logged-in user

  try {
    // Check if current user is the owner of the contact
    const [contact] = await db.pool.query("SELECT owner_id FROM contacts WHERE contact_id = ?", [contactId]);
    if (!contact || contact.owner_id !== userId) {
      return res.status(403).json({ message: "Not authorized to share this contact" });
    }

    // Insert into contact_shares
    await db.pool.query(
      "INSERT INTO contact_shares (contact_id, shared_user_id) VALUES (?, ?)",
      [contactId, sharedUserId]
    );

    res.json({ message: "Contact shared successfully" });
  } catch (err) {
    console.error("Error sharing contact:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Unshare a contact
exports.unshareContact = async (req, res) => {
  const { contactId } = req.params;
  const { sharedUserId } = req.body;
  const userId = req.user.id;

  try {
    const [contact] = await db.pool.query("SELECT owner_id FROM contacts WHERE contact_id = ?", [contactId]);
    if (!contact || contact.owner_id !== userId) {
      return res.status(403).json({ message: "Not authorized to unshare this contact" });
    }

    await db.pool.query(
      "DELETE FROM contact_shares WHERE contact_id = ? AND shared_user_id = ?",
      [contactId, sharedUserId]
    );

    res.json({ message: "Contact unshared successfully" });
  } catch (err) {
    console.error("Error unsharing contact:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all contacts visible to current user (own + shared)
exports.getSharedContacts = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.pool.query(
      `SELECT DISTINCT c.contact_id, c.firstname, c.lastname, c.email, c.created_at, c.updated_at, p.photo_url
       FROM contacts c
       LEFT JOIN profiles p ON c.profile_id = p.profile_id
       LEFT JOIN contact_shares cs ON c.contact_id = cs.contact_id
       WHERE c.owner_id = ? OR cs.shared_user_id = ?`,
      [userId, userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching shared contacts:", err);
    res.status(500).json({ message: "Server error" });
  }
};
