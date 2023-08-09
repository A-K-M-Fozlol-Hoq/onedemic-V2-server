//external imports
const express = require("express");

//internal imports
const mcqController = require("../controllers/mcqController");
const isAuthenticated = require("../middlewares/isAuthenticated");

// Destructuring controller
const { getMCQ } = mcqController;

// Router Object -- module scaffolding
const router = express.Router();

router
  /**
   * @method POST
   * @endpoint base_url/api/v1/mcq/
   */
  .post("/", isAuthenticated, getMCQ);

module.exports = router;
