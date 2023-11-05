const express = require("express");
const authController = require("./../controllers/authControllers");

const router = express.Router();
const courseController = require("./../controllers/courseControllers");

router
  .route("/")
  .get(courseController.getAllCourses)
  .post(
    authController.protect,
    authController.restrictTo("admin", "instructor"),
    courseController.createCourse
  ); // run middleware first, then create

router
  .route("/:id")
  .get(courseController.getCourse)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "instructor"),
    courseController.uploadCourseImages,
    courseController.resizeCourseImages,
    courseController.updateCourse
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "instructor"),
    courseController.deleteCourse
  );

module.exports = router;
