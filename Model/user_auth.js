const mongoose = require("mongoose");

//user schema
const userScheme = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    default: "user",
  },

  is_varified: {
    type: Boolean,
    default: false,
  },

  date_created: String,
});

// schema for storing otp for user email validation
const useremailVarification = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  date_created: {
    type: Date,
    default: Date.now(),
  },
  date_expires: {
    type: Date,
    default: Date.now(),
  },
});

// schema for storing otp for resseting password by user email validation
const reset_password = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  date_created: {
    type: Date,
    default: Date.now(),
  },
  date_expires: {
    type: Date,
    default: Date.now(),
  },
});

const user = mongoose.model("User", userScheme);
const ownerEmailverification = mongoose.model(
  "email_verification",
  useremailVarification
);
const passwordEmailverification = mongoose.model(
  "password_email_verification",
  reset_password
);

module.exports = { user, ownerEmailverification, passwordEmailverification };