const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Routes d'authentification
router.get("/login", authController.showLoginForm);
router.post("/login", authController.login);
router.get("/signup", authController.showSignupForm);
router.post("/signup", authController.signup);
router.get("/logout", authController.logout);

module.exports = router;