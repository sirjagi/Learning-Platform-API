const express = require("express");
const { getCourses } = require("../controllers/courses");

// merging url params (coming in from bootcamps)
// ex: /bootcamps/:bootcampId/courses
const router = express.Router({ mergeParams: true });

router.route("/").get(getCourses);

module.exports = router;
