const express =require("express");
const { getAllProducts,createProduct, updateproduct, deleteProduct, getProductDetails ,createProductReview,getProductReviews,deleteReview} = require("../controller/productController");

const { isAuthuser,authorizeRoles } = require("../middleware/auth");

const router=express.Router();

router.route("/products").get( getAllProducts)
router.route("/admin/product/new").post(isAuthuser,createProduct)
router.route("/admin/product/:id").put(isAuthuser,authorizeRoles("admin"),updateproduct).get(isAuthuser,getProductDetails)
router.route("/admin/product/:id").delete(isAuthuser,authorizeRoles("admin"),deleteProduct)
router.route("/product/:id").get(isAuthuser,getProductDetails)

router.route("/review").put(isAuthuser, createProductReview);

router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthuser, deleteReview);
module.exports=router