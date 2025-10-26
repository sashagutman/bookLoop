const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{7,}$/; 
const PASSWORD_HELP_TEXT = "Password must be at least 7 characters long and include at least one uppercase letter and one digit.";

module.exports = { PASSWORD_REGEX, PASSWORD_HELP_TEXT };