
const crypto = require("crypto");
const Payment = require("../models/paymentModel.js");
const Razorpay = require("razorpay")
// const {instance}=require("./../server.js")
const dotenv = require("dotenv");
// const { default: orders } = require("razorpay/dist/types/orders.js");
const sendEmail = require("../utils/sendEmail.js")



exports.checkout = async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  try {

    const order = await new Razorpay({
      key_id: `rzp_test_k3MW8TT2RoP1b5`,
      key_secret: `bvqnelWbiOm0MLEwCF2GnBwk`,
    }).orders.create(options);
    console.log(order)

    res.status(200).json({
      success: true,
      order,
    });
  }
  catch (err) {
    console.log(err);
  }
};

exports.paymentVerification = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
    req.body;

  console.log(req.body)
  const body = razorpayOrderId + "|" + razorpayPaymentId;

  const expectedSignature = crypto
    .createHmac("sha256", "bvqnelWbiOm0MLEwCF2GnBwk")
    .update(body.toString())
    .digest("hex");
  console.log(expectedSignature, razorpaySignature)
  const isAuthentic = expectedSignature === razorpaySignature;

  // Database comes here

  try {
    if (isAuthentic) {

      const data = await Payment.create(
        req.body
      );
      console.log(data)

      let message=`Appointment has been successfully booked for the ${req.body.firstname} ${req.body.lastname} \n 
      email= ${req.body.email} \n 
      phone=${req.body.phone} \n
      address=${req.body.address} \n 
      Appointent time time=${req.body.bookingtime}`
      await sendEmail({
        email: req.body.email,
        subject: "Appointment booked successfully",
        message
      });

      await sendEmail({
        email: 'kedia.ayush0511@gmail.com',
        subject: "Appointment booked successfully",
        message
      });
       console.log("aa")
       res.status(200).json({
        success: true,
      });
    } else {
      res.status(400).json({
        success: false,
      });
    }
  }
  catch (error) {
    console.log(error)

    res.status(400).json({
      success: false,
    });
  }


};
