const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/usersAvatar");
const storage = require("../../middleware/upload");

router.patch(
  "/avatars",
  storage.single("avatar"),
  usersController.updateAvatar
);

module.exports = router;
