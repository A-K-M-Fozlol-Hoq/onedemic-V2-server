//external imports
const express = require("express");

//internal imports
const examController = require("../controllers/examController");
const isAuthenticated = require("../middlewares/isAuthenticated");

// Destructuring controller
const { createExam, getExams, getFullExam } = examController;

// Router Object -- module scaffolding
const router = express.Router();

router
  /**
   * @method POST
   * @endpoint base_url/api/v1/exam/create-exam
   */
  .post("/create-exam", isAuthenticated, createExam)
  /**
   * @method GET
   * @endpoint base_url/api/v1/exam/get-exams/:courseId
   */
  .get("/get-exams/:courseId", isAuthenticated, getExams)
  /**
   * @method GET
   * @endpoint base_url/api/v1/exam/get-exam/:examId
   */
  .get("/get-exam/:examId", isAuthenticated, getFullExam);

module.exports = router;
