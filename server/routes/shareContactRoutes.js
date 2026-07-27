const express = require("express");
const router = express.Router();
const shareController = require("../controllers/shareContactController");
const {protect} = require('../middleware/index');

// Share a contact
router.post("/:contactId/share", protect, shareController.shareContact);

// Unshare a contact
router.post("/:contactId/unshare", protect, shareController.unshareContact);

// Get all shared contacts for logged-in user
router.get("/shared", protect, shareController.getSharedContacts);

module.exports = router;
