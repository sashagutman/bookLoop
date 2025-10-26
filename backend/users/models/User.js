const mongoose = require("mongoose");
const emptyToUndefined = require("../helpers/emptyToUndefined");
const { PASSWORD_REGEX, PASSWORD_HELP_TEXT } = require("../validation/validationPasswordPolicy");

const userSchema = new mongoose.Schema(
  {
    name: {
      first: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 256,
        required: true,          
        set: emptyToUndefined,
      },
      middle: {
        type: String,
        trim: true,
        maxlength: 256,
        default: "",
        set: (v) => (v === "" ? "" : emptyToUndefined(v)),
      },
      last: {
        type: String,
        trim: true,
        maxlength: 256,
        default: "",
        set: (v) => (v === "" ? "" : emptyToUndefined(v)),
      },
    },

    image: {
  url: {
    type: String,
    trim: true,
    match: /^https?:\/\/.+/i,
    default: "https://picsum.photos/200",
    set: emptyToUndefined,  
  },
  alt: {
    type: String,
    trim: true,
    maxlength: 256,
    default: "User avatar",
    set: emptyToUndefined,
  },
},

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      minlength: 5,
      maxlength: 256,
      match: /^([a-zA-Z0-9._%+\-]+)@([a-zA-Z0-9.\-]+)\.([a-zA-Z]{2,})$/,
    },

    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      maxlength: 1024,
      validate: {
        validator(value) {
          return PASSWORD_REGEX.test(value);
        },
        message: PASSWORD_HELP_TEXT,
      },
    },

    country: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 256,
      set: emptyToUndefined,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 256,
      set: emptyToUndefined,
    },

    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },

    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
