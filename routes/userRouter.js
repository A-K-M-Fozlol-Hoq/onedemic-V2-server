//external imports
const express = require("express");

//internal imports
const userController = require("../controllers/userController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const { isUserValid } = require("../middlewares/validation/userValidator");

// Destructuring controller
const { createUser, getUser, updateUserNameAndProfile } = userController;

// Router Object -- module scaffolding
const router = express.Router();

router
  /**
   * @method POST
   * @endpoint base_url/api/user/createUser
   */
  .post("/createUser", isUserValid, isAuthenticated, createUser)
  /**
   * @method GET
   * @endpoint base_url/api/user/getUser/:email
   */
  .get("/getUser/:email", getUser)
  /**
   * @method GET
   * @endpoint base_url/api/user//update-user-name-and-profile/:email
   */
  .put("/update-user-name-and-profile/:email", updateUserNameAndProfile);

module.exports = router;
