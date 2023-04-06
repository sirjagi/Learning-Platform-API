const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");

// @desc    Get reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  // don't want pagination and other things if we're searching courses
  // for a specific bootcamp. Therefore, it has a separate response
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    // does res.advancedResults call the middleware?
    // I doubt it. It just gets the results of the middleware
    // So it is called regardless
    // it just depends whether get its results or not
    res.status(200).json(res.advancedResults);
  }
});
