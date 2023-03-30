const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
} = require("../controllers/bootcamps");

const router = express.Router();

// Linking the methods to their controllers

// if we post a get request at this route, we call getBootcampsInRadius
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

// routes with path /api/v1/bootcamps
router.route("/").get(getBootcamps).post(createBootcamp);

// routes with path /api/v1/bootcamps/:id
router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
