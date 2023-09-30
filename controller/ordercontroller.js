// const Order = require("./../models/order")
// const Product = require("../models/product");
// const ApiFeatures = require("../utils/apifeatures");
// const ErrorHandler = require("../utils/errorhandler");
// const catchAsyncError = require("./../middleware/catchAsyncErrors")


// // create new order

// // Create new Order
// exports.newOrder = catchAsyncErrors(async (req, res, next) => {
//     const {
//         shippingInfo,
//         orderItems,
//         paymentInfo,
//         itemsPrice,
//         taxPrice,
//         shippingPrice,
//         totalPrice,
//     } = req.body;

//     const order = await Order.create({
//         shippingInfo,
//         orderItems,
//         paymentInfo,
//         itemsPrice,
//         taxPrice,
//         shippingPrice,
//         totalPrice,
//         paidAt: Date.now(),
//         user: req.user._id,
//     });

//     res.status(201).json({
//         success: true,
//         order,
//     });
// });

// exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
//     const order = await Order.findById(req.params.id).populate(
//         "user",
//         "name email"
//     );

//     if (!order) {
//         return next(new ErrorHander("Order not found with this Id", 404));
//     }

//     res.status(200).json({
//         success: true,
//         order,
//     });
// });


// //   get single order


// exports.getsingleorder = catchAsyncError(async (req, res, next) => {
//     const order = await Order.findById(req.params.id).populate("user", "name email");


//     if (!order) {
//         return next(new ErrorHandler("Order not found with this Id", 404));
//     }

//     res.status(200).json({
//         success: true,
//         order,
//     });
// })

// exports.myOrders = catchAsyncError(async (req, res, next) => {
//     const orders = await Order.find({ user: req.user._id });

//     res.status(200).json({
//         success: true,
//         orders,
//     });
// });

// const Order = require("../models/orderModel");
// const Product = require("../models/productModel");
// const ErrorHander = require("../utils/errorhander");
// const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// // Create new Order
// exports.newOrder = catchAsyncErrors(async (req, res, next) => {
//     const {
//         shippingInfo,
//         orderItems,
//         paymentInfo,
//         itemsPrice,
//         taxPrice,
//         shippingPrice,
//         totalPrice,
//     } = req.body;

//     const order = await Order.create({
//         shippingInfo,
//         orderItems,
//         paymentInfo,
//         itemsPrice,
//         taxPrice,
//         shippingPrice,
//         totalPrice,
//         paidAt: Date.now(),
//         user: req.user._id,
//     });

//     res.status(201).json({
//         success: true,
//         order,
//     });
// });

// // get Single Order
// exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
//     const order = await Order.findById(req.params.id).populate(
//         "user",
//         "name email"
//     );

//     if (!order) {
//         return next(new ErrorHandler("Order not found with this Id", 404));
//     }

//     res.status(200).json({
//         success: true,
//         order,
//     });
// });

// // get logged in user  Orders
// exports.myOrders = catchAsyncErrors(async (req, res, next) => {
//     const orders = await Order.find({ user: req.user._id });

//     res.status(200).json({
//         success: true,
//         orders,
//     });
// });

// // get all Orders -- Admin
// exports.getAllOrders = catchAsyncError(async (req, res, next) => {
//     const orders = await Order.find();

//     let totalAmount = 0;

//     orders.forEach((order) => {
//         totalAmount += order.totalPrice;
//     });

//     res.status(200).json({
//         success: true,
//         totalAmount,
//         orders,
//     });
// });



// // update Order Status -- Admin
// exports.updateOrder = catchAsyncError(async (req, res, next) => {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//         return next(new ErrorHandler("Order not found with this Id", 404));
//     }

//     if (order.orderStatus === "Delivered") {
//         return next(new ErrorHandler("You have already delivered this order", 400));
//     }

//     if (req.body.status === "Shipped") {
//         order.orderItems.forEach(async (o) => {
//             await updateStock(o.product, o.quantity);
//         });
//     }
//     order.orderStatus = req.body.status;

//     if (req.body.status === "Delivered") {
//         order.deliveredAt = Date.now();
//     }

//     await Order.save(req.params.id, order, { validateBeforeSave: false });
//     res.status(200).json({
//         success: true,
//     });
// });

// async function updateStock(id, quantity) {
//     const product = await Product.findById(id);

//     product.Stock -= quantity;

//     await Product.findByIdAndUpdate(id, product, { validateBeforeSave: false });
// }




// // delete Order -- Admin
// exports.deleteOrder = catchAsyncError(async (req, res, next) => {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//         return next(new ErrorHandler("Order not found with this Id", 404));
//     }

//     await order.remove();

//     res.status(200).json({
//         success: true,
//     });
// });