const Joi = require("joi");
const { PASSWORD_REGEX, PASSWORD_HELP_TEXT } = require("../validationPasswordPolicy");

module.exports = (payload) => {
  const schema = Joi.object({
    newPassword: Joi.string()
      .pattern(PASSWORD_REGEX)
      .required()
      .messages({
        "string.pattern.base": PASSWORD_HELP_TEXT,
        "string.empty": "New password is required",
        "any.required": "New password is required",
      }),
  });

  return schema.validate(payload, { abortEarly: false, stripUnknown: true });
};