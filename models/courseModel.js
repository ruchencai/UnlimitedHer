const { truncate } = require("fs");
const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const User = require("./userModel");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A course must have a name."], // a validator
      unique: true, // not a validator
      trim: true,
      maxlength: [
        40,
        "A course name must have less or equal than 40 characters",
      ], // validator, maxlength is the validator name, not a customable name
      minlength: [
        10,
        "A course name must have greater or equal than 10 characters",
      ],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A course must have a duration"],
    },
    description: {
      type: String,
      required: [true, "A course must have a description"],
    },
    imageCover: {
      type: String,
      required: [true, "A course must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    instructor: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      }, // schema type definition need to be inside an object
    ],
  },
  {
    // need to do this for virtuals to show. virtual: not stored in database but showed in response
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  // all arguments start with find
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt -passwordResetExpires -passwordResetToken",
  });

  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} ms.`);
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
