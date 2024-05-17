const express = require("express");
const { user_regiser, user_login, email_varification } = require("../../Controllers/authController");
const router = express.Router();
const {verify} =require("../../middlewears/verifyToken")


//registration
router.post("/register",verify, user_regiser);

//login
router.post("/login",user_login); 


//email verification
router.post("/verification", email_varification);

module.exports = router; 