const express = require("express");
const {paymentController, paymentVerificationController }= require("../Controllers/paymentController");
const authenticateToken = require("../middlewears/verifyAuth");

const router =express.Router()

router.post("/payment",authenticateToken,paymentController)
router.post("/payment/verification",paymentVerificationController)

module.exports = router;