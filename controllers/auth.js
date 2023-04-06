const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Not validating email and password here because we already
  // have validation within the model
  // and gets handler by our error handler

  // Create user
  const user = await User.create({
    name,
    email,
    // hash password in a middleware (keep controllers clean)
    password,
    role,
  });

  sendTokenResponse(user, 200, res);

  // Create token
  // const token = user.getSignedJwtToken();

  // res.status(200).json({
  //   success: true,
  //   token,
  // });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password"), 400);
  }

  // Check for user
  // include password because we need it for validation
  // Remember: we set the "select" property of password == false
  // so we manually have to select it here
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials"), 401);
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials"), 401);
  }

  sendTokenResponse(user, 200, res);

  // Create token
  // const token = user.getSignedJwtToken();

  // res.status(200).json({
  //   success: true,
  //   token,
  // });
});

// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private (need a token to access this)
exports.logout = asyncHandler(async (req, res, next) => {
  // we have access to cookie b/c of the cookie parser middleware
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private (need a token to access this)
exports.getMe = asyncHandler(async (req, res, next) => {
  // since a protected route, we have access to req.user
  // which will always be the logged in user
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private (need a token to access this)
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private (need a token to access this)
exports.updatePassword = asyncHandler(async (req, res, next) => {
  // select password manually (by default set to false in model)
  const user = await User.findById(req.user.id).select("+password");

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("There is no user with that email", 404));
  }

  // Get reset token
  // func inside User Model
  const resetToken = user.getResetPasswordToken();

  // console.log(resetToken);

  // save to DB
  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  // if in front end, we would perhaps send a clickable Link
  // instead of telling user to send a PUT request
  const message = `You are receiving this email because you 
  (or someone else) has requested the reset of a password. Please
  make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });

    res.status(200).json({
      success: true,
      data: "Email sent",
    });
  } catch (err) {
    // if error, remove these field from the database (that we added earlier)
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token (because hashed version is in DB)
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  // find user by resettoken
  const user = await User.findOne({
    resetPasswordToken,
    // if expire date is greater than now
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined; // goes away
  user.resetPasswordExpire = undefined;
  // password automatically gets encrypted by our middleware
  await user.save();

  sendTokenResponse(user, 200, res);
});

// Just a helper function
// Get token from model, create cookie, and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    // specify that the time is in days
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    // only want cookie to be accessed through client-side script
    httpOnly: true,
  };

  // when we're in production, we set the secure flag on our cookie
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  // We send it...but up to client-side how they want to handle the cookie
  // name, value, options
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
