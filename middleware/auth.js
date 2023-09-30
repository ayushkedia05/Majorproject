const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require('jsonwebtoken')
const User = require('./../models/user')
exports.isAuthuser = catchAsyncErrors(async (req, res, next) => {

  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("please login to access the code", 401));
  }

  const decodeddata = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodeddata.id);
  next();
})

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resouce `,
          403
        )
      );
    }

    next();
  };
};

