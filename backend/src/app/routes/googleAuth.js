const express = require("express");
const router = express.Router();
const googleAuthController = require("../controllers/GoogleLogin");

// Start OAuth with Google
router.get("/auth/google", googleAuthController.startOAuth);

// Callback from Google
router.get("/auth/google/callback", googleAuthController.handleOAuthCallback);

module.exports = router;
