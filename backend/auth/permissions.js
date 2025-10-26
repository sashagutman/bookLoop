const { handleError } = require("../utils/handleErrors");

const requireAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) return handleError(res, 403, "Admins only");
  next();
};


const ownerOrAdmin = (Model, ownerField = "user_id", paramId = "id") => {
  return async (req, res, next) => {
    try {
      // админ — всегда ок
      if (req.user?.isAdmin) return next();

      const id = req.params[paramId];
      const doc = await Model.findById(id).select(`${ownerField} _id`);
      if (!doc) return handleError(res, 404, "Resource not found");

      const ownerId = String(doc[ownerField]);
      const userId = String(req.user?._id);
      if (ownerId === userId) return next();

      return handleError(res, 403, "Not allowed (owner or admin only)");
    } catch (e) {
      return handleError(res, 500, e.message || "Server error");
    }
  };
};

// Доступ к профилю сам себя или админ (для /api/users/:id)
const selfOrAdmin = (paramId = "id") => (req, res, next) => {
  const isAdmin = req.user?.isAdmin;
  const isSelf = String(req.params[paramId]) === String(req.user?._id);
  if (isAdmin || isSelf) return next();
  return handleError(res, 403, "Not allowed");
};

module.exports = { requireAdmin, ownerOrAdmin, selfOrAdmin };
