const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const auth = require("../../auth/authService");
const { ownerOrAdmin } = require("../../auth/permissions");
const requireAdmin = require("../../middlewares/requireAdmin");
const Book = require("../models/Book");
const {
  createBook,
  getAllBooks,
  getBookById,
  getMyBooks,
  updateBook,
  deleteBook,
  likeBook,
  deleteAllBooks,
  toggleWant,
  listBooks,
  setUserStatus,
  clearUserStatus,
  getBooksByUserStatus,
} = require("../models/booksAccessDataService");

const normalizeBook = require("../helpers/normalizeBook");
const bookValidation = require("../validation/bookValidationService");
const { handleError, createError } = require("../../utils/handleErrors");
const { normalizeLanguage } = require("../helpers/normalizeLanguage");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// create book
router.post("/", auth, async (req, res) => {
  if (req.body && typeof req.body.language !== "undefined") {
    req.body.language = normalizeLanguage(req.body.language);
  }
  
  const v = bookValidation(req.body);
  if(v) {
    return res.status(400).json(createError("Validation", v.message, 400, v.details));
  }

  try {
    const normalized = normalizeBook(req.body, req.user._id);
    const book = await createBook(normalized);
    return res.status(201).json(book);
  } catch (e) { return handleError(res, 500, e.message || "Server error"); }
});

// list all
router.get("/", async (req, res) => {
  try {
    const { items } = await listBooks(req.query);
    return res.status(200).json(items);
  } catch (e) { return handleError(res, 500, e.message || "Server error"); }
});

// admin delete
router.delete("/", auth, requireAdmin, async (req, res) => {
  try { await deleteAllBooks(); return res.sendStatus(204); }
  catch (e) { return handleError(res, 500, e.message || "Server error"); }
});

// my books
router.get("/my-books", auth, async (req, res) => {
  try {
    const { status, favorites, want, owned } = req.query;

    if (owned === "true") {
      const mine = await getMyBooks(req.user._id);
      return res.status(200).json(mine);
    }

    if (favorites === "true") {
      const favs = await Book.find({ likes: String(req.user._id) }).lean();
      return res.status(200).json(favs);
    }

    if (want === "true") {
      const wanted = await Book.find({ wants: String(req.user._id) }).lean();
      return res.status(200).json(wanted);
    }

    if (status) {
      const allowed = ["reading", "unread", "finished"];
      if (!allowed.includes(status)) {
        return handleError(res, 400, `Invalid status. Allowed: ${allowed.join(", ")}`);
      }

      const mineByStatus = await getBooksByUserStatus(req.user._id, status);
      return res.status(200).json(mineByStatus);
    }

    return res.status(200).json([]);
  } catch (error) {
    console.error("[/my-books] error:", error);
    return handleError(res, error.status || 500, error.message || "Server error");
  }
});


// like book
router.patch("/:id/like", auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return handleError(res, 400, "Invalid book id");
    const updated = await likeBook(id, req.user._id);
    if (!updated) return handleError(res, 404, "Book not found");
    return res.status(200).json({
      _id: updated._id, likes: updated.likes,
      likesCount: Array.isArray(updated.likes) ? updated.likes.length : 0,
    });
  } catch (e) { return handleError(res, 500, e.message || "Server error"); }
});

// want to read book
router.patch("/:id/want", auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return handleError(res, 400, "Invalid book id");
    const updated = await toggleWant(id, req.user._id);
    if (!updated) return handleError(res, 404, "Book not found");
    return res.status(200).json({
      _id: updated._id, wants: updated.wants,
      wantsCount: Array.isArray(updated.wants) ? updated.wants.length : 0,
    });
  } catch (e) { return handleError(res, 500, e.message || "Server error"); }
});

// user status (reading | finished | unread/null)
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return handleError(res, 400, "Invalid book id");

    let { status } = req.body || {};
    const allowed = ["reading", "finished", "unread", null];
    if (!allowed.includes(status)) {
      return handleError(res, 400, `Invalid status. Allowed: reading, finished, unread, null`);
    }

    if (status == null || status === "unread") {
      const cleared = await clearUserStatus(id, req.user._id);
      if (!cleared) return handleError(res, 404, "Book not found");
      return res.status(200).json({ _id: cleared._id, status: "unread" });
    }

    const updated = await setUserStatus(id, req.user._id, status);
    if (!updated) return handleError(res, 404, "Book not found");
    return res.status(200).json({ _id: updated._id, status });
  } catch (e) { return handleError(res, 500, e.message || "Server error"); }
});

// get by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return handleError(res, 400, "Invalid book id");
    const book = await getBookById(id);
    if (!book) return handleError(res, 404, "Book not found");
    return res.status(200).json(book);
  } catch (error) { return handleError(res, 400, error.message || "Bad request"); }
});
// update
router.put("/:id", auth, ownerOrAdmin(Book), async (req, res) => {
  if (req.body && typeof req.body.language !== "undefined") {
    req.body.language = normalizeLanguage(req.body.language);
  }
  
  const v = bookValidation(req.body);
  if(v) {
    return res.status(400).json(createError("Validation", v.message, 400, v.details));
  }

  try {
    const { id } = req.params;
    if (!isValidId(id)) return handleError(res, 400, "Invalid book id");
    const updated = await updateBook(id, req.body);
    if (!updated) return handleError(res, 404, "Book not found");
    return res.status(200).json(updated);
  } catch (e) { return handleError(res, 500, e.message || "Server error"); }
});
//delete by id
router.delete("/:id", auth, ownerOrAdmin(Book), async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return handleError(res, 400, "Invalid book id");
    const removed = await deleteBook(id);
    if (!removed) return handleError(res, 404, "Book not found");
    return res.status(200).json(removed);
  } catch (e) { return handleError(res, 500, e.message || "Server error"); }
});

module.exports = router;
