const mongoose = require("mongoose");

//user schema
const paymentScheme = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    razorpay_payment_id: {
        type: String,
        required: true,
    },
    razorpay_order_id: {
        type: String,
        required: true,
    },
    razorpay_signature: {
        type: String,
        required: true,
    },
    planName: {
        type: String,
        required: true,
    },
    duration:{
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default:"INR"
    },
    status: {
        type: String,
        default: 'authenticated',
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
    subscriptionStartDate: {
        type: Date,
        required: true,
    },
    subscriptionEndDate: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
});


const payment =mongoose.model("Payment",paymentScheme);

module.exports ={payment}