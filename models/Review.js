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

// Prevent user from submitting more than 1 review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// Static method to get average rating and save
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  // the objects inside are like steps (pipeline)
  // 1st match, then group, then...etc
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        // bootcamp id (weird syntax)
        _id: "$bootcamp",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  // add newly generated average rating to the Bootcamp (DB)
  // console.log(obj);
  try {
    // "grabbing" bootcamp model
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating,
    });
  } catch (err) {
    console.error(err);
  }
};

// Middleware (Query middleware)

// Call getAverageRating after save
// "post" as in "after"
ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.bootcamp);
});

// Call getAverageRating after remove
ReviewSchema.pre("deleteOne", { document: true, query: false }, function () {
  this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model("Review", ReviewSchema);
