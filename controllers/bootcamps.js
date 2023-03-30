const ErrorResponse = require("../utils/errorResponse");

const Bootcamp = require("../models/Bootcamp");

// middleware functions

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();

    res.status(200).json({
      sucess: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    // if valid id but not found
    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `Bootcampt not found with id of ${req.params.id}`,
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    // if invalid id format

    // res.status(400).json({
    //   success: false,
    // });

    // This calls the middleware?? (./middleware/error)
    next(err);

    // next() calls the middleware
    // a class we created
    // next(
    //   new ErrorResponse(`Bootcampt not found with id of ${req.params.id}`, 404)
    // );
  }
};

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = async (req, res, next) => {
  // put in the database
  // any field not in our model does not get put in DB (MongoDB feature)

  try {
    // Mongoose method
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    // res.status(400).json({
    //   success: false,
    // });
    next(err);
  }
};

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      // updated data should be the new data
      new: true,
      // run mongoose validators
      runValidators: true,
    });

    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `Bootcampt not found with id of ${req.params.id}`,
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    // return res.status(400).json({
    //   success: false,
    // });
    next(err);
  }
};

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `Bootcampt not found with id of ${req.params.id}`,
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    // return res.status(400).json({
    //   success: false,
    // });
    next(err);
  }
};
