const Joi = require("joi");

const bookValidation = Joi.object({
  title: Joi.string().min(2).max(256),
  author: Joi.string().min(2).max(256),
  language: Joi.string().valid("en","ru","uk","he","es","de","fr","it","pl","pt","other"),
  publishedYear: Joi.number().integer().min(0).max(new Date().getFullYear()),
  readYear: Joi.number().integer().min(0).max(new Date().getFullYear()),
  description: Joi.string().max(3000).allow(""),
  genre: Joi.string().valid(
  "fiction",
  "classic",
  "fantasy",
  "sci_fi",
  "detective",
  "thriller",
  "romance",
  "horror",
  "history",
  "biography",
  "non_fiction",
  "poetry",
  "graphic_novel",
  "other"
),
  pages: Joi.number().integer().min(1),
  status: Joi.string().valid("reading", "unread", "finished"),
  image: Joi.string().uri().pattern(/^https?:\/\/.+/i).allow("", null),
  rating: Joi.number().min(0).max(5),
  notes: Joi.string().allow("").max(1000),
}).min(1); // хотя бы одно поле обязательно

module.exports = bookValidation;
