const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN


const generateToken = (user) =>
  jwt.sign(
    { _id: user._id, email: user.email, isAdmin: !!user.isAdmin },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

const verifyToken = (tokenFromClient) => {
  try { return jwt.verify(tokenFromClient, JWT_SECRET); }
  catch { return null; }
};

module.exports = { generateToken, verifyToken };

