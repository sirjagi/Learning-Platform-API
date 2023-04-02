const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.auth && req.headers.auth.startsWith("Bearer")) {
    token = req.headers.auth.split(" ")[1];
  }

  // we're not gonna have cookies
  //   else if (req.cookies.token) {
  //     token = req.cookies.token;
  //   }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    // Verify token

    // (extract it from the payload)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);

    // get the user corresponding to the token
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});
