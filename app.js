const express =require('express')

const app=express();
const cookieParser =require('cookie-parser')
const errormiddleware=require("./middleware/error")
const cors = require('cors');
app.use(cors());
app.use(cookieParser());
app.use(express.json());
const product=require("./routes/productRoute")
const user=require("./routes/userRoute");
const order=require("./routes/orderRoute");
const paymentRoute =require("./routes/paymentRoutes.js");

app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);

app.use("/api", paymentRoute);

app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);

//middleware for error

app.use(errormiddleware)

module.exports = app