  require("dotenv").config();
const mongoose = require("mongoose");
const { buildBooksFilter } = require("../helpers/buildBooksFilter");
const Book = require("./Book");
const DB = process.env.DB;

const ensureMongo = () => {
  if (DB !== "MONGODB") throw new Error("Unsupported DB");
};

// LIST
const listBooks = async (query) => {
  ensureMongo();
  const filter = buildBooksFilter(query);
  const items = await Book.find(filter).sort({ createdAt: -1 }).lean();
  return { items, total: items.length };
};

// CREATE/READ/UPDATE/DELETE
const createBook = async (b) => { ensureMongo(); let book = new Book(b); return book.save(); };
const getAllBooks = async () => { ensureMongo(); return Book.find(); };
const getBookById = async (id) => { ensureMongo(); return Book.findById(id); };
const getMyBooks = async (uid) => { ensureMongo(); return Book.find({ user_id: uid }).lean(); };
const updateBook = async (id, patch) => { ensureMongo(); return Book.findByIdAndUpdate(id, patch, { new: true }); };
const deleteBook = async (id) => { ensureMongo(); return Book.findByIdAndDelete(id); };
const deleteAllBooks = async () => { ensureMongo(); return Book.deleteMany({}); };

// LIKE/ WANT (toggle)
const likeBook = async (bookId, userId) => {
  ensureMongo();
  const uid = String(userId);
  const curr = await Book.findById(bookId).select("likes");
  if (!curr) return null;
  const has = curr.likes.includes(uid);
  const update = has ? { $pull: { likes: uid } } : { $addToSet: { likes: uid } };
  return Book.findByIdAndUpdate(bookId, update, { new: true }).select("likes");
};

const toggleWant = async (bookId, userId) => {
  ensureMongo();
  const uid = String(userId);
  const curr = await Book.findById(bookId).select("wants");
  if (!curr) return null;
  const has = curr.wants.includes(uid);
  const update = has ? { $pull: { wants: uid } } : { $addToSet: { wants: uid } };
  return Book.findByIdAndUpdate(bookId, update, { new: true }).select("wants");
};

// user status (states[])
const pullWant = async (bookId, userId) => {
  const uid = String(userId);
  await Book.updateOne({ _id: bookId }, { $pull: { wants: uid } });
};

// поставить/изменить статус пользователя для книги
const setUserStatus = async (bookId, userId, status) => {
  ensureMongo();
  const uidObj = new mongoose.Types.ObjectId(userId);

  // если статус = reading/finished — убрать want
  if (status === "reading" || status === "finished") {
    await pullWant(bookId, userId);
  }

  //  обновить/создать запись в states
  const updated = await Book.findOneAndUpdate(
    { _id: bookId, "states.user": uidObj },
    { $set: { "states.$.status": status } },
    { new: true, runValidators: true }
  ).select("_id states");

  if (updated) return updated;

  return Book.findByIdAndUpdate(
    bookId,
    { $push: { states: { user: uidObj, status } } },
    { new: true, runValidators: true }
  ).select("_id states");
};
// clear user status
const clearUserStatus = async (bookId, userId) => {
  ensureMongo();
  const uid = new mongoose.Types.ObjectId(userId);
  return Book.findByIdAndUpdate(
    bookId,
    { $pull: { states: { user: uid } } },
    { new: true }
  ).select("_id states");
};
// get book by user status
const getBooksByUserStatus = async (userId, status) => {
  ensureMongo();
  const uid = new mongoose.Types.ObjectId(userId);
  if (status === "unread") {
    // нет записи в states для пользователя
    return Book.find({
      states: { $not: { $elemMatch: { user: uid } } },
    }).lean();
  }
  return Book.find({
    states: { $elemMatch: { user: uid, status } },
  }).lean();
};

module.exports = {
  listBooks,
  createBook,
  getAllBooks,
  getBookById,
  getMyBooks,
  updateBook,
  deleteBook,
  likeBook,
  deleteAllBooks,
  toggleWant,
  setUserStatus,
  clearUserStatus,
  getBooksByUserStatus,
};

