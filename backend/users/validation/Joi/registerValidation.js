const Joi = require("joi");
const {PASSWORD_REGEX, PASSWORD_HELP_TEXT } = require ("../validationPasswordPolicy");

const nameSchema = Joi.object({
  first: Joi.string().trim().min(2).max(256).required(),
  middle: Joi.string().trim().allow("").max(256),
  last: Joi.string().trim().allow("").max(256),
});

const imageSchema = Joi.object({
  url: Joi.string().uri().max(1024).allow(""),
  alt: Joi.string().trim().allow("").max(256),
});

const registerSchema = Joi.object({
  name: nameSchema,        
  image: imageSchema.optional(),
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .pattern(PASSWORD_REGEX)
    .required()
    .messages({
      "string.pattern.base": PASSWORD_HELP_TEXT,
      "any.required": "Password is required",
    }),

  country: Joi.string().trim().min(2).max(256).required(),
  city: Joi.string().trim().min(2).max(256),

  isAdmin: Joi.forbidden()
})

  .custom((value, helpers) => {
    const hasFirst = value?.name?.first && value.name.first.trim().length > 0;
    const hasUserName = value?.userName && value.userName.trim().length > 0;
    if (!hasFirst && !hasUserName) {
      return helpers.message("Either first name or userName must be provided");
    }
    return value;
  }, "name or userName requirement");

const registerValidation = (user) =>
  registerSchema.validate(user, {
    abortEarly: false,
    stripUnknown: true,
  });

module.exports = registerValidation;
