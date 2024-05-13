const express = require("express");
const {
  user_login,
  user_regiser,
  email_varification,
} = require("../../controllers/authController");
// const {
//   reset_password_otp,
//   password_verification,
//   updatePassword,
// } = require("../../controllers/resetPassword");
const router = express.Router();
const { user } = require("../../userModel/users");

//registration
router.post("/register", user_regiser);

//login
router.post("/login", user_login);

//email verification
router.post("/verification", email_varification);

module.exports = router;
