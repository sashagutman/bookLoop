const { handleError } = require("../utils/handleErrors")

module.exports = (req, res, next) => {
  if (!req.user?.isAdmin) return handleError(res, 403, "Admins only");
  next();
};
