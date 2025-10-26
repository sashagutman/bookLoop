const bookValidate = require("./Joi/bookValidate");

const validator = process.env.VALIDATOR

const bookValidation = (book) => {
    if (validator === "Joi") {
        const {error} = bookValidate.validate(book);
        if (error) return error.details.map((detail) => detail.message);
        return "";
    }
}

module.exports = bookValidation;
