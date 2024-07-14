const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewears/verifyAuth");
const getUser  = require("../Controllers/getUserController");
const logoutUser = require("../Controllers/logoutUser");

// getuser
router.get('/getUser', authenticateToken, getUser)

// logout
router.get("/user/logout",logoutUser)

module.exports = router;