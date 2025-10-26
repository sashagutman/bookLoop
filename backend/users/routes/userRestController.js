const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const auth = require("../../auth/authService");
const requireAdmin = require("../../middlewares/requireAdmin");
const { handleError } = require("../../utils/handleErrors");
const returnUser = require("../helpers/returnUser");

// Joi-валидаторы
const loginValidation = require("../validation/Joi/loginValidation");
const registerValidation = require("../validation/Joi/registerValidation");
const updateValidation = require("../validation/Joi/updateValidation");
const { PASSWORD_REGEX } = require("../validation/validationPasswordPolicy");

// сервисы доступа к данным
const {
  registerUser,
  getUser,
  getAllUsers,
  loginUser,
  updateUser,
  deleteUser,
  updatePassword,
  deleteAllUsers,
} = require("../models/usersAccessDataService");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

/* ===================== AUTH ===================== */

// register
router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return handleError(res, 400, error.details.map(d => d.message).join(", "));

  const result = await registerUser(req.body);
  if (result instanceof Error) return handleError(res, result.status || 400, result.message);

  return res.status(201).json(returnUser(result));
});

// login (email+password)
router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return handleError(res, 400, error.details.map(d => d.message).join(", "));

  const { email, password } = req.body;
  const result = await loginUser(email, password);
  if (result?.isError) return handleError(res, result.status || 400, result.message);

  return res.status(200).json(result);
});

/* ===================== ME ===================== */

// get my profile
router.get("/me", auth, async (req, res) => {
  const result = await getUser(req.user._id);
  if (result instanceof Error) return handleError(res, result.status || 400, result.message);
  return res.status(200).json(result);
});

// update my profile
router.put("/me", auth, async (req, res) => {
  const { error } = updateValidation(req.body);
  if (error) return handleError(res, 400, error.details.map(d => d.message).join(", "));

  const result = await updateUser(req.user._id, req.body);
  if (result instanceof Error) return handleError(res, result.status || 400, result.message);

  return res.status(200).json(returnUser(result));
});

// delete my account
router.delete("/me", auth, async (req, res) => {
  const result = await deleteUser(req.user._id);
  if (result instanceof Error) return handleError(res, result.status || 400, result.message);
  return res.status(200).json(returnUser(result));
});

// update my password
router.patch("/me/password", auth, async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || !PASSWORD_REGEX.test(newPassword)) {
      return handleError(
        res,
        400,
        "Password must be at least 7 characters and include uppercase, lowercase, number, and special character"
      );
    }

    const id = req.user._id.toString();
    const result = await updatePassword(id, newPassword);
    return res.status(200).json(result);
  } catch (e) {
    return handleError(res, 500, e.message || "Server error");
  }
});

/* ===================== ADMIN ===================== */

// list all users
router.get("/", auth, requireAdmin, async (req, res) => {
  const result = await getAllUsers();
  if (result instanceof Error) return handleError(res, result.status || 400, result.message);
  return res.status(200).json(result);
});

router.delete("/", auth, requireAdmin, async (req, res) => {
  try {
    const keepAdmins = req.query.keepAdmins !== "false";
    const keepSelf = req.query.keepSelf !== "false";
    const selfId = req.user._id?.toString?.();

    const result = await deleteAllUsers({ keepAdmins, keepSelf, selfId });
    if (result instanceof Error) {
      return handleError(res, result.status || 400, result.message);
    }

    return res.status(200).json({ deletedCount: result.deletedCount || 0 });
  } catch (e) {
    return handleError(res, 500, e.message || "Server error");
  }
});

// get user by id
router.get("/:id", auth, requireAdmin, async (req, res) => {
  if (!isValidId(req.params.id)) return handleError(res, 400, "Invalid user id");
  const result = await getUser(req.params.id);
  if (result instanceof Error) return handleError(res, result.status || 400, result.message);
  return res.status(200).json(result);
});

// update user by id
router.put("/:id", auth, requireAdmin, async (req, res) => {
  if (!isValidId(req.params.id)) return handleError(res, 400, "Invalid user id");

  const { error } = updateValidation(req.body);
  if (error) return handleError(res, 400, error.details.map(d => d.message).join(", "));

  const result = await updateUser(req.params.id, req.body);
  if (result instanceof Error) return handleError(res, result.status || 400, result.message);
  return res.status(200).json(returnUser(result));
});

// delete user by id (admin)
router.delete("/:id", auth, requireAdmin, async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return handleError(res, 400, "Invalid user id");

    const victimId = String(req.params.id);
    const selfId = String(req.user._id);
    // защита от удаления самого себя
    if (victimId === selfId) {
      return handleError(res, 400, "Admin cannot delete themselves via this endpoint");
    }

    const result = await deleteUser(victimId);
    if (result instanceof Error) {
      return handleError(res, result.status || 400, result.message);
    }

    return res.sendStatus(204);
  } catch (e) {
    return handleError(res, 500, e.message || "Server error");
  }
});

module.exports = router;
