const express = require("express");
const contactsController = require("../../controllers/contacts.js");
const { isValidId } = require("../../middleware/isValidId.js");
const router = express.Router();

router.get("/", contactsController.getAllContacts);

router.get("/:id", isValidId, contactsController.getSelectedContact);

router.post("/", contactsController.addNewContact);

router.delete("/:id", isValidId, contactsController.deleteContact);

router.put("/:id", isValidId, contactsController.updateExistingContact);

router.patch(
  "/:id/favorite",
  isValidId,
  contactsController.updateStatusFavorite
);

module.exports = router;
