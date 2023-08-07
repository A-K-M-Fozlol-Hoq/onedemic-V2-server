//external imports
const express = require("express");

//internal imports
const chatController = require("../controllers/chatController");
const isAuthenticated = require("../middlewares/isAuthenticated");

// Destructuring controller
const { getMessages } = chatController;

// Router Object -- module scaffolding
const router = express.Router();

router
  /**
   * @method GET
   * @endpoint base_url/api/chat/get-messages/:courseId
   */
  .get("/get-messages/:courseId", isAuthenticated, getMessages);

module.exports = router;
