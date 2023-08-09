//external imports
const express = require("express");

//internal imports
const examController = require("../controllers/examController");
const isAuthenticated = require("../middlewares/isAuthenticated");

// Destructuring controller
const { createExam } = examController;

// Router Object -- module scaffolding
const router = express.Router();

router
  /**
   * @method POST
   * @endpoint base_url/api/v1/exam/create-exam
   */
  .post("/create-exam", createExam);
// .post("/create-exam", isAuthenticated, createExam);

module.exports = router;
