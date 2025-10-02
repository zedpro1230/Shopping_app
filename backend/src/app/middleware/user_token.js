const jwt = require("jsonwebtoken");

function generateAccessToken(UserId) {
  return jwt.sign(UserId, process.env.TOKEN_SECRET, { expiresIn: "30d" });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, result) => {
      if (err) return res.sendStatus(403).send("forbidden");
      req.body.createdBy = result.userId;
    });
  }
  next();
}

module.exports = { generateAccessToken, authenticateToken };
