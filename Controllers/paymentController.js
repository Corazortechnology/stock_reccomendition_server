require("dotenv").config()
const Razorpay = require("razorpay");
const { dataUpload } = require("./dataUpload");
const crypto = require("crypto");
const { payment } = require("../Model/payment");
const { user } = require("../Model/user_auth");
const jwt = require('jsonwebtoken');

//constants variables
let price = null;
let duration = null;
let selectedPlan = null;
let id = null;


const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECURITY_KEY,
});

async function paymentController(req, res) {
    const { amount, period, plan } = req.body;

    // getting user id from refresh token
    const refreshToken = req.cookies['refresh-token'];
    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: "unauthorized"
        });
    }
    const decodedRefreshToken =jwt.verify(refreshToken, process.env.REFRESH_KEY);
    console.log(refreshToken,"  ",decodedRefreshToken)
    const userId = decodedRefreshToken.user; 

    duration = period;
    price = amount;
    selectedPlan = plan;
    id = userId

    const options = {
        amount: Number(amount * 100),  // amount in the smallest currency unit
        currency: "INR",
    };

    const order = await instance.orders.create(options)
    res.status(200).json({
        success:true,
        message: 'order created successfully',
        data: order
    })
}


// Utility function to calculate end date based on the subscription type
const calculateEndDate = (startDate, type) => {
    const startTimestamp = new Date(startDate).getTime();

    if (type === 'Monthly') {
        // Number of milliseconds in one month (assuming an average month length of 30.44 days)
        const oneMonthInMilliseconds = 30.44 * 24 * 60 * 60 * 1000;
        const endTimestamp = startTimestamp + oneMonthInMilliseconds;
        return new Date(endTimestamp);
    } else if (type === 'Annual') {
        // Number of milliseconds in one year (using 365.25 days to account for leap years)
        const oneYearInMilliseconds = 365.25 * 24 * 60 * 60 * 1000;
        const endTimestamp = startTimestamp + oneYearInMilliseconds;
        return new Date(endTimestamp);
    }

    // Return null or handle invalid type cases
    return null;
};


async function paymentVerificationController(req, res) {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature)
    try {
        // Create Sign
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        // Create ExpectedSign
        const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_SECURITY_KEY)
            .update(body.toString())
            .digest("hex");

        // console.log(razorpay_signature === expectedSign);
        console.log(razorpay_signature)
        console.log(expectedSign)
        // Create isAuthentic
        const isAuthentic = expectedSign === razorpay_signature;

        // Condition 
        if (isAuthentic) {

            const subscriptionStartDate = new Date();
            const subscriptionEndDate = calculateEndDate(subscriptionStartDate, duration);

            const newPayment = new payment({
                userId: id,
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
                planName: selectedPlan,
                amount: price,
                duration,
                subscriptionStartDate,
                subscriptionEndDate,
            });

            await newPayment.save();

            const isUser = await user.findOne({ _id: id });

            if (!isUser) {
                res.status(404).json({ message: "No user found!!" });
            }

            isUser.subscription.plan = selectedPlan;
            isUser.subscription.expires = subscriptionEndDate;

            await isUser.save();

            res.redirect(`https://www.signalsandweights.com/paymentSuccess?refrence=${razorpay_payment_id}&amount=${price}&plan=${selectedPlan}&type=${duration}&expires=${subscriptionEndDate}`)

        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }

}

module.exports = { paymentController, paymentVerificationController }