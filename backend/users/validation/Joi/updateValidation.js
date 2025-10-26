const Joi = require("joi");

const nameSchema = Joi.object({
  first: Joi.string().min(2).max(256),
  middle: Joi.string().allow("").max(256),
  last: Joi.string().allow("").max(256),
});

const imageSchema = Joi.object({
  url: Joi.string().uri().allow(""),
  alt: Joi.string().allow("").max(256),
});

const updateSchema = Joi.object({
  name: nameSchema,                  // вложенный объект
  userName: Joi.string().min(2).max(256),
  image: imageSchema,                 // вложенный объект
  email: Joi.string().trim().lowercase().email({ tlds: { allow: false } }),
  country: Joi.string().min(2).max(256),
  city: Joi.string().min(2).max(256),
  role: Joi.string().valid("admin", "user"),
})
  .min(1) 
  .unknown(false);

const updateValidation = (user) =>
  updateSchema.validate(user, { abortEarly: false, stripUnknown: true });

module.exports = updateValidation;
