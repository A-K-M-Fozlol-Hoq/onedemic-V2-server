//external imports
const express = require("express");

//internal imports
const courseController = require("../controllers/courseController");
const isAuthenticated = require("../middlewares/isAuthenticated");

// Destructuring controller
const { createCourse, isCodeAvailable, getCourses, enrollCourse } =
  courseController;

// Router Object -- module scaffolding
const router = express.Router();

router
  /**
   * @method POST
   * @endpoint base_url/api/course/create-course
   */
  .post("/create-course", isAuthenticated, createCourse)
  /**
   * @method POST
   * @endpoint base_url/api/course/enroll-course
   */
  .post("/enroll-course", isAuthenticated, enrollCourse)
  /**
   * @method GET
   * @endpoint base_url/api/course/courses/:userEmail
   */
  .get("/courses/:userEmail", isAuthenticated, getCourses)
  /**
   * @method GET
   * @endpoint base_url/api/course/is-code-available/:code
   */
  .get("/is-code-available/:code", isAuthenticated, isCodeAvailable);

module.exports = router;
