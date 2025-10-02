const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const express = require("express");
const passport = require("passport");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// Load environment variables first
dotenv.config({ silent: true });

const route = require("./src/app/routes/index");
const app = express();
const db = require("./src/config/data");
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());

// Connect to database
db.connect();
// Basic route
route(app);
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
