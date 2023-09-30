const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("./../middleware/catchAsyncErrors")
const User = require("../models/user");
const sendtoken = require("../utils/jwttoken");
const sendEmail = require("../utils/sendEmail.js")
const crypto = require('crypto')
const bcrypt = require('bcryptjs');

exports.registeruser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  console.log(role)
  const user = await User.create({
    name, email, password, avatar: {
      public_id: "ffdfdfdfd",
      url: "sddsfsd"
    }, role
  })



  sendtoken(user, 201, res);
})


exports.loginUser = catchAsyncError(async (req, res, next) => {

  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  // sendtoken(user,200,res);
  const token = user.getJWTtoken();

  const option = {
    maxAge: process.env.JWT_EXPIRE,
    httpOnly: true,
    secure: true
  };

  res.status(200).cookie("token", token, option).json({
    success: true,
    user,
    token
  });

})

exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});



exports.forgotpassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }


  const resettoken = user.getResetPasswordToken();


  await User.findOneAndUpdate({ _id: user._id }, { $set: user });


  const resetPassurl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resettoken}`
  const message = `your password reset token is :- \n\n ${resetPassurl} \n\n if not requested then please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "mar jao",
      message
    });

    res.status(200).json({
      success: true,
      message: `email send to ${user.email}`
    })
  }
  catch (error) {
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    console.log(user)
    await User.findOneAndUpdate({ _id: user._id }, { $set: user });


    return next(new ErrorHandler(error.message, 500));
  }
})

// Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // creating token hash

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  console.log(resetPasswordToken)

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not password", 400));
  }

  user.password = req.body.password;
  user.password = await bcrypt.hash(user.password, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;

  await User.updateOne({ _id: user._id }, { $set: user },
  );


  sendtoken(user, 200, res);
});

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});


// update User password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }

  user.password = req.body.newPassword;
  user.password = await bcrypt.hash(user.password, 10);
  await User.updateOne({ _id: user._id }, { $set: user },).select("-password");

  sendtoken(user, 200, res);
});



exports.getAllUser = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get single user (admin)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});





// update User Role -- Admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }

  // const imageId = user.avatar.public_id;

  // await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});