const express = require("express");

const router = express.Router();

// const { isAuthuser, authorizeRoles } = require("../middleware/auth");
// const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controller/ordercontroller");

// router.route("/order/new").post(isAuthuser, newOrder);

// router.route("/order/:id").get(isAuthuser, authorizeRoles("admin"), getSingleOrder);
// router.route("/orders/me").get(isAuthuser, myOrders);

// router.route("/amin/orders").get(isAuthuser, authorizeRoles("admin"), getAllOrders);
// router.route("/admin/order/:id").put(isAuthuser, authorizeRoles("admin"), updateOrder).delete(isAuthuser, authorizeRoles("admin"), deleteOrder);
module.exports = router;
