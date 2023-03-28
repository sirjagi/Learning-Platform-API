const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
} = require("../controllers/bootcamps");

const router = express.Router();

// Linking the methods to their controllers

// routes with path /api/v1/bootcamps
router.route("/").get(getBootcamps).post(createBootcamp);

// routes with path /api/v1/bootcamps/:id
router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
