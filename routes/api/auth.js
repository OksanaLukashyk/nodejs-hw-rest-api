const express = require("express");
const authRouter = express.Router();
const jsonParser = express.json();
const authController = require("../../controllers/auth");
const isAuth = require("../../middleware/isAuth");

authRouter.post("/register", jsonParser, authController.register);
authRouter.post("/login", jsonParser, authController.login);
authRouter.post("/logout", isAuth, authController.logout);
authRouter.get("/current", isAuth, authController.getCurrent);
authRouter.patch("/", isAuth, authController.updSubscription);

module.exports = authRouter;
