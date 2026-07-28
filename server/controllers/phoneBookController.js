const db = require('../db');
const path = require('path');
const {verifyToken} = require('../utils');
const fileUpload = require('express-fileupload');

// ✅ Add new contact with profile photo

// Convert contact_numbers[x] keys into an array
function normalizeContactNumbers(body) {
  const numbers = [];

  Object.keys(body).forEach((key) => {
    if (key.startsWith("contact_numbers[")) {
      numbers.push(body[key]);
      delete body[key]; // clean up
    }
  });

  if (numbers.length > 0) {
    body.contact_numbers = numbers;
  }

  return body;
}
exports.addContact = async (req, res) => {
  const connection = await db.pool.getConnection();
  let transactionStarted = false;

  try {
    // Validate token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = verifyToken(token);

    const ownerId = decodedToken.userId;

    // Normalize request data
    const {
      firstname,
      lastname,
      email,
      contact_numbers
    } = normalizeContactNumbers(req.body);


    // Handle profile image
    let photoPath =
      "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    const uploadedPhoto = req.files?.photo_url;

    if (uploadedPhoto) {

      const fileName = `${Date.now()}-${uploadedPhoto.name}`;

      const uploadPath = path.join(
        __dirname,
        "..",
        "uploads",
        fileName
      );

      await uploadedPhoto.mv(uploadPath);

      photoPath = `/uploads/${fileName}`;
    }


    await connection.beginTransaction();
    transactionStarted = true;

        // Create contact
    const [contactResult] = await connection.query(
      `
      INSERT INTO contacts
      (
        firstname,
        lastname,
        email,
        owner_id
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        firstname,
        lastname,
        email,
        ownerId
      ]
    );

    const contactId = contactResult.insertId;


    // Create profile
    const [profileResult] = await connection.query(
      `
      INSERT INTO profiles(photo_url,contact_id)
      VALUES (?,?)
      `,
      [photoPath, contactId]
    );

    const profileId = profileResult.insertId;




    // Insert contact numbers
    if (Array.isArray(contact_numbers) && contact_numbers.length > 0) {

      const values = contact_numbers.map(num => [
        contactId,
        num
      ]);

      await connection.query(
        `
        INSERT INTO contact_numbers
        (
          contact_id,
          contact_number
        )
        VALUES ?
        `,
        [values]
      );
    }


    await connection.commit();


    return res.status(201).json({
      message: "Contact created successfully",
      contactId,
      profileId,
      photo_url: photoPath
    });


  } catch (error) {

    if (transactionStarted) {
      await connection.rollback();
    }

    console.error("Add contact error:", error);

    return res.status(500).json({
      message: "Failed to create contact",
      error: error.message
    });

  } finally {

    connection.release();

  }
};

// exports.addContact = async (req, res) => {
//   const connection = await db.pool.getConnection();
//   try {
//     const { lastname, firstname, email, contact_numbers, photo_url } = req.body;
//     console.log(req.body)
//     await connection.beginTransaction();

//     // 1. Insert profile first
//     const [profileResult] = await connection.query(
//       `INSERT INTO profiles (photo_url) VALUES (?)`,
//       [photo_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'] // default icon
//     );
//     const profileId = profileResult.insertId;

//     // 2. Insert contact linked to profile
//     const [contactResult] = await connection.query(
//       `INSERT INTO contacts (lastname, firstname, email, profile_id) VALUES (?, ?, ?, ?)`,
//       [lastname, firstname, email, profileId]
//     );
//     const contactId = contactResult.insertId;

//     // 3. Insert multiple numbers
//     if (Array.isArray(contact_numbers)) {
//       for (const number of contact_numbers) {
//         await connection.query(
//           `INSERT INTO contact_numbers (contact_id, contact_number) VALUES (?, ?)`,
//           [contactId, number]
//         );
//       }
//     }

//     await connection.commit();
//     res.status(201).json({ 
//       message: 'Contact + profile added successfully', 
//       contactId, 
//       profileId 
//     });
//   } catch (error) {
//     await connection.rollback();
//     res.status(500).json({ error: error.message });
//   } finally {
//     connection.release();
//   }
// };

// // ✅ Add new contact with numbers
// exports.addContact = async (req, res) => {
//   const connection = await db.pool.getConnection();
//   try {
//     const { lastname, firstname, email, contact_numbers } = req.body;

//     await connection.beginTransaction();

//     // Insert into contacts
//     const [contactResult] = await connection.query(
//       `INSERT INTO contacts (lastname, firstname, email) VALUES (?, ?, ?)`,
//       [lastname, firstname, email]
//     );

//     const contactId = contactResult.insertId;

//     // Insert multiple numbers
//     if (Array.isArray(contact_numbers)) {
//       for (const number of contact_numbers) {
//         await connection.query(
//           `INSERT INTO contact_numbers (contact_id, contact_number) VALUES (?, ?)`,
//           [contactId, number]
//         );
//       }
//     }

//     await connection.commit();
//     res.status(201).json({ message: 'Contact added successfully', contactId });
//   } catch (error) {
//     await connection.rollback();
//     res.status(500).json({ error: error.message });
//   } finally {
//     connection.release();
//   }
// };

// ✅ Get all contacts with numbers
exports.getContacts = async (req, res) => {
  try {
    const [rows] = await db.pool.query(`
      SELECT c.contact_id, c.firstname, c.lastname, c.email, cn.contact_number, c.owner_id, p.photo_url
      FROM contacts c
      LEFT JOIN contact_numbers cn ON c.contact_id = cn.contact_id
      LEFT JOIN profiles p ON c.contact_id = p.contact_id
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
          contact_numbers: [],
          owner_id: row.owner_id || null, // Include owner_id if available
          photo_url: row.photo_url
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
  const connection = await db.pool.getConnection();
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
    await db.pool.query(`DELETE FROM contacts WHERE contact_id = ?`, [id]);
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Share a contact
exports.shareContact = async (req, res) => {
  try {
    const { contactId, sharedUserId } = req.body;
    await pool.query(
      `INSERT INTO contact_shares (contact_id, shared_user_id) VALUES (?, ?)`,
      [contactId, sharedUserId]
    );
    res.json({ message: 'Contact shared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Unshare a contact
exports.unshareContact = async (req, res) => {
  try {
    const { contactId, sharedUserId } = req.body;
    await pool.query(
      `DELETE FROM contact_shares WHERE contact_id = ? AND shared_user_id = ?`,
      [contactId, sharedUserId]
    );
    res.json({ message: 'Contact unshared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get contacts visible to current user
exports.getContactsForUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = verifyToken(token);

    const userId = decodedToken.userId;

    const [rows] = await db.pool.query(`
      SELECT
        c.contact_id,
        c.firstname,
        c.lastname,
        c.email,
        c.owner_id,
        p.photo_url,
        cn.contact_number
      FROM contacts c
      LEFT JOIN profiles p 
          ON c.profile_id = p.contact_id
      LEFT JOIN contact_numbers cn 
          ON c.contact_id = cn.contact_id
      LEFT JOIN contact_shares cs 
          ON c.contact_id = cs.contact_id
      WHERE c.owner_id = ?
        OR cs.shared_user_id = ?
      GROUP BY
        c.contact_id,
        c.firstname,
        c.lastname,
        c.email,
        c.owner_id,
        p.photo_url,
        cn.contact_number
    `, [userId, userId]);

    const contacts = {};
    rows.forEach(row => {
      if (!contacts[row.contact_id]) {
        contacts[row.contact_id] = {
          contact_id: row.contact_id,
          firstname: row.firstname,
          lastname: row.lastname,
          email: row.email,
          contact_numbers: [],
          owner_id: row.owner_id || null, // Include owner_id if available
          photo_url: row.photo_url
        };
      }
      if (row.contact_number) {
        contacts[row.contact_id].contact_numbers.push(row.contact_number);
      }
    });

    res.json(Object.values(contacts));

  } catch (error) {
    console.error("Get contacts error:", error);
    res.status(500).json({ error: error.message });
  }
};