//external imports
const express = require("express");

//internal imports
const courseController = require("../controllers/courseController");
const isAuthenticated = require("../middlewares/isAuthenticated");

// Destructuring controller
const {
  createCourse,
  isCodeAvailable,
  getCourses,
  enrollCourse,
  getSingleCourse,
  approveOrRejectPendingStudents,
  blockStudent,
  unBlockStudent,
  unBlockAndAddStudent,
  removeStudent,
} = courseController;

// Router Object -- module scaffolding
const router = express.Router();

router
  /**
   * @method POST
   * @endpoint base_url/api/v1/course/create-course
   */
  .post("/create-course", isAuthenticated, createCourse)
  /**
   * @method POST
   * @endpoint base_url/api/v1/course/enroll-course
   */
  .post("/enroll-course", isAuthenticated, enrollCourse)
  /**
   * @method GET
   * @endpoint base_url/api/v1/course/courses/:userEmail
   */
  .get("/courses/:userEmail", isAuthenticated, getCourses)
  /**
   * @method GET
   * @endpoint base_url/api/v1/course/:courseId
   */
  .get("/:courseId", isAuthenticated, getSingleCourse)
  /**
   * @method GET
   * @endpoint base_url/api/v1/course/is-code-available/:code
   */
  .get("/is-code-available/:code", isAuthenticated, isCodeAvailable)
  /**
   * @method PUT
   * @endpoint base_url/api/v1/course/approve-or-reject-pending-students/
   */
  .put(
    "/approve-or-reject-pending-students/",
    isAuthenticated,
    approveOrRejectPendingStudents
  )
  /**
   * @method PUT
   * @endpoint base_url/api/v1/course/remove-student
   */
  .put("/remove-student", isAuthenticated, removeStudent)
  /**
   * @method PUT
   * @endpoint base_url/api/v1/course/block-student
   */
  .put("/block-student", isAuthenticated, blockStudent)
  /**
   * @method PUT
   * @endpoint base_url/api/v1/course/unblock-student
   */
  .put("/unblock-student", isAuthenticated, unBlockStudent)
  /**
   * @method PUT
   * @endpoint base_url/api/v1/course/unblock-and-add-student
   */
  .put("/unblock-and-add-student", isAuthenticated, unBlockAndAddStudent);

module.exports = router;
