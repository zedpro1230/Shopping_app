const byScrypt = require("bcryptjs");
const User = require("../models/User");
const { generateAccessToken } = require("../middleware/user_token");
class AuthController {
  async signup(req, res) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const name = req.body.name;
      const userEmail = await User.findOne({ email: email });

      if (!email || !password || !name) {
        return res.status(400).json({ content: "All fields are required" });
      }
      if (userEmail) {
        return res.status(400).json({ content: "Email already exists" });
      } else {
        const hashedPassword = await byScrypt.hash(password, 10);
        const user = await User.create({
          name: name,
          email: email,
          password: hashedPassword,
        });
        const token = generateAccessToken({ userId: user._id });

        return res.status(201).json({ data: user, token: token });
      }
    } catch (error) {
      return res.status(500).json({ content: "Internal server error" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ content: "Email and password are required" });
      }

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ content: "Invalid email or password" });
      }

      // Check password
      const isPasswordValid = await byScrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ content: "Invalid email or password" });
      }

      // Generate JWT token
      const token = generateAccessToken({ userId: user._id });

      return res.status(200).json({
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        token: token,
      });
    } catch (error) {
      return res.status(500).json({ content: "Internal server error" });
    }
  }
}
module.exports = new AuthController();
