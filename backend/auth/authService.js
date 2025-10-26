const { handleError } = require("../utils/handleErrors");
const { verifyToken } = require("./providers/jwt"); 

module.exports = (req, res, next) => {
  // токен из Authorization: Bearer <token>
  const header = req.get("authorization") || req.get("Authorization");
  let token = null;

  if (header) {
    const [scheme, value] = header.split(" ");
    if (scheme === "Bearer" && value) token = value;
  }

  // фолбэк: x-auth-token
  if (!token) token = req.header("x-auth-token");

  if (!token) return handleError(res, 401, "Please login");

  const payload = verifyToken(token);
  if (!payload) return handleError(res, 401, "Invalid or expired token");

  req.user = payload; 
  next();
};

