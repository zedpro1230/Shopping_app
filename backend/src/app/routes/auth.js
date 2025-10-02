const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/user_token");
const authController = require("../controllers/AuthController");

// Public routes (no authentication required)
router.post("/signup", authController.signup);
router.post("/signin", authController.login);

// Protected routes (authentication required)

module.exports = router;
