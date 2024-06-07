const express = require("express");
const {paymentController, paymentVerificationController }= require("../Controllers/paymentController");

const router =express.Router()

router.post("/payment",paymentController)
router.post("/payment/verification",paymentVerificationController)

module.exports = router;