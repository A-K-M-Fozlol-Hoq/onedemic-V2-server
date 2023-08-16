//external imports
const express = require("express");

//internal imports
const resultController = require("../controllers/resultController");
const isAuthenticated = require("../middlewares/isAuthenticated");

// Destructuring controller
const { saveMCQ, saveCQ, getResultsForExam } = resultController;

// Router Object -- module scaffolding
const router = express.Router();

router
  /**
   * @method POST
   * @endpoint base_url/api/v1/result/save-mcq
   */
  .post("/save-mcq", isAuthenticated, saveMCQ)
  /**
   * @method POST
   * @endpoint base_url/api/v1/result/save-cq
   */
  .post("/save-cq", isAuthenticated, saveCQ)
  /**
   * @method GET
   * @endpoint base_url/api/v1/result/get-result/:examId
   */
  .get("/get-result/:examId", isAuthenticated, getResultsForExam);

module.exports = router;
