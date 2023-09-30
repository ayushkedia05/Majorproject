const express = require("express");
const { registeruser, loginUser, logout, forgotpassword, resetPassword, getUserDetails, updatePassword, getAllUser, getSingleUser, updateUserRole, deleteUser } = require("../controller/userController");
const { isAuthuser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registeruser)
router.route("/login").post(loginUser)
router.route("/logout").get(logout)

router.route("/password/forgot").post(forgotpassword)
router.route("/password/reset/:token").get(resetPassword)

router.route("/me").get(isAuthuser, getUserDetails);
router.route("/password/update").put(isAuthuser, updatePassword);

// router.route("/me/update").put(isAuthuser, updateProfile);

router.route("/admin/users").get(isAuthuser, authorizeRoles("admin"), getAllUser);
router.route("/admin/users/:id").get(isAuthuser, authorizeRoles("admin"), getSingleUser);

router
    .route("/admin/user/:id")
    .get(isAuthuser, authorizeRoles("admin"), getSingleUser)
    .put(isAuthuser, authorizeRoles("admin"), updateUserRole)
    .delete(isAuthuser, authorizeRoles("admin"), deleteUser);

module.exports = router