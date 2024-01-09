const express = require("express");
const contactsController = require("../../controllers/contacts.js");
const router = express.Router();

router.get("/", contactsController.getAllContacts);

router.get("/:id", contactsController.getSelectedContact);

router.post("/", contactsController.addNewContact);

router.delete("/:id", contactsController.deleteContact);

router.put("/:id", contactsController.updateExistingContact);

module.exports = router;
