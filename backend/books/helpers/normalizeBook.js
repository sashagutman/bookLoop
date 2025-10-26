const { DEFAULT_BOOK_IMAGE } = require("../helpers/constants");

function normalizeBook(payload, userId) {
  const image = payload.image && payload.image.trim() ? payload.image.trim() : DEFAULT_BOOK_IMAGE;
  return {
    ...payload,
    image,
    user_id: userId,
  };
}

module.exports = normalizeBook;


