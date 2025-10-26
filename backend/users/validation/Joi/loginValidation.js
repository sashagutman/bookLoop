const Joi = require("joi");
const { PASSWORD_REGEX, PASSWORD_HELP_TEXT } = require("../validationPasswordPolicy");

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Invalid email format",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .pattern(PASSWORD_REGEX)
    .required()
    .messages({
      "string.pattern.base": PASSWORD_HELP_TEXT,
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
});

module.exports = (credentials) =>
  loginSchema.validate(credentials, { abortEarly: false, stripUnknown: true });
