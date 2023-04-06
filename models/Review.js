const mongoose = require("mongoose");
const Bootcamp = require("./Bootcamp");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title for the review"],
    maxlength: 100,
  },
  text: {
    type: String,
    required: [true, "Please add some text"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please add a rating between 1 and 10"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // relation
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    // reference Bootcamp model
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    // reference Bootcamp model
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Review", ReviewSchema);
