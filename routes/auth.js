const express = require("express");
const { register, login, getMe } = require("../controllers/auth");

const router = express.Router();

const { protect } = require("../middleware/auth");

// Same thing
// router.post("/register", register);
router.route("/register").post(register);

router.route("/login").post(login);

router.get("/me", protect, getMe);

module.exports = router;
