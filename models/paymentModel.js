const mongoose = require('mongoose');


const paymentSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address:{
    type:String,
    required:true,
  },
  bookingtime:{
    type:String,
    required:true,
  },
  orderCreationId:{
    type: String,
    required: true,
  },
  razorpayOrderId: {
    type: String,
    required: true,
  },
  razorpayOrderId: {
    type: String,
    required: true,
  },
  razorpayPaymentId: {
    type: String,
    required: true,
  },
  razorpaySignature: {
    type: String,
    required: true,
  },
});

module.exports=mongoose.model("Payment", paymentSchema);
