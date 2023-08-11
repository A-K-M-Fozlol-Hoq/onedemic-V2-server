//external imports
const express = require("express");

//internal imports
const resultController = require("../controllers/resultController");
const isAuthenticated = require("../middlewares/isAuthenticated");

// Destructuring controller
const { saveMCQ } = resultController;

// Router Object -- module scaffolding
const router = express.Router();

router
  /**
   * @method POST
   * @endpoint base_url/api/v1/result/save-mcq
   */
  .post("/save-mcq", isAuthenticated, saveMCQ);

module.exports = router;
