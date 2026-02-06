const bookValidate = require("./Joi/bookValidate");

const validator = process.env.VALIDATOR

const bookValidation = (book) => {
  if (validator !== "Joi") return null;

  const { error, value } = bookValidate.validate(book, {
    abortEarly: true,   // первая ошибка 
    stripUnknown: true, // выкинуть лишние поля
    convert: true,      // "2026" -> 2026
  });

  if (!error) return null;

  return {
    message: error.details?.[0]?.message || "Validation error",
    details: error.details.map((d) => ({
      message: d.message,
      path: d.path,
      type: d.type,
    })),
  };
};

module.exports = bookValidation;
