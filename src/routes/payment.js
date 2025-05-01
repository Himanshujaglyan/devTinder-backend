const { userauth } = require("../Middleware/auth");
const razorpayInstance = require("../utils/razorpay");
const express = require("express");
const paymentRouter = express.Router();
const Payment = require("../models/paymentModel");
const { membershipAmount } = require("../utils/constant");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");

paymentRouter.post("/payment/create", userauth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized access!" });
    }
    if (!membershipAmount[membershipType]) {
      return res.status(400).json({ msg: "Invalid membership type" });
    }
    const { firstName, lastName, emailId } = req.user;
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType: membershipType,
      },
    });
    //save it in my database
    // console.log(order);
    const payment = new Payment({
      userId: req.user.id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });
    const savedPayment = await payment.save();
    //return back my order details to frontend
    // res.json({...savedPayment.toJSON()});
    // res.json(savedPayment.toJSON());
    res.json({ ...savedPayment.toJSON(), orderId: savedPayment.orderId });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

//webhook signal payment fail or success
paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");

    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }
    // update my payment status in DB
    if (!req.body.payload || !req.body.payload.payment || !req.body.payload.payment.entity) {
        return res.status(400).json({ msg: "Invalid webhook payload" });
      }
      const paymentDetails = req.body.payload.payment.entity;
      

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();

    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    await user.save();

    // Update the user as premium

    if (req.body.event === "payment.captured") {
      // handle successful payment
    }
    if (req.body.event === "payment.failed") {
      // handle failed payment
    }

    // return success response to razorpay
    return res.status(200).json({ msg: "Webhook received successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = paymentRouter;
