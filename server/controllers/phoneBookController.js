const pool = require('../db');

// ✅ Add new contact with numbers
exports.addContact = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { lastname, firstname, email, contact_numbers } = req.body;

    await connection.beginTransaction();

    // Insert into contacts
    const [contactResult] = await connection.query(
      `INSERT INTO contacts (lastname, firstname, email) VALUES (?, ?, ?)`,
      [lastname, firstname, email]
    );

    const contactId = contactResult.insertId;

    // Insert multiple numbers
    if (Array.isArray(contact_numbers)) {
      for (const number of contact_numbers) {
        await connection.query(
          `INSERT INTO contact_numbers (contact_id, contact_number) VALUES (?, ?)`,
          [contactId, number]
        );
      }
    }

    await connection.commit();
    res.status(201).json({ message: 'Contact added successfully', contactId });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

// ✅ Get all contacts with numbers
exports.getContacts = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.contact_id, c.firstname, c.lastname, c.email, cn.contact_number
      FROM contacts c
      LEFT JOIN contact_numbers cn ON c.contact_id = cn.contact_id
      ORDER BY c.contact_id
    `);

    // Group numbers under each contact
    const contacts = {};
    rows.forEach(row => {
      if (!contacts[row.contact_id]) {
        contacts[row.contact_id] = {
          contact_id: row.contact_id,
          firstname: row.firstname,
          lastname: row.lastname,
          email: row.email,
          contact_numbers: []
        };
      }
      if (row.contact_number) {
        contacts[row.contact_id].contact_numbers.push(row.contact_number);
      }
    });

    res.json(Object.values(contacts));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update contact (basic info + replace numbers)
exports.updateContact = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const { lastname, firstname, email, contact_numbers } = req.body;

    await connection.beginTransaction();

    // Update contact info
    await connection.query(
      `UPDATE contacts SET lastname = ?, firstname = ?, email = ? WHERE contact_id = ?`,
      [lastname, firstname, email, id]
    );

    // Replace numbers (delete old, insert new)
    await connection.query(`DELETE FROM contact_numbers WHERE contact_id = ?`, [id]);

    if (Array.isArray(contact_numbers)) {
      for (const number of contact_numbers) {
        await connection.query(
          `INSERT INTO contact_numbers (contact_id, contact_number) VALUES (?, ?)`,
          [id, number]
        );
      }
    }

    await connection.commit();
    res.json({ message: 'Contact updated successfully' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

// ✅ Delete contact (cascade deletes numbers)
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM contacts WHERE contact_id = ?`, [id]);
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
