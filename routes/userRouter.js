//external imports
const express = require("express");

//internal imports
const userController = require("../controllers/userController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const { isUserValid } = require("../middlewares/validation/userValidator");

// Destructuring controller
const { createUser, getUser } = userController;

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
   * @endpoint base_url/api/user/getUser
   */
  .get("/getUser/:email", getUser);

module.exports = router;

/*
alternative way to decalre routes
router.post("/createUser", isAuthenticated, isUserValid, createUser);
router.post("/getUser", getUser);
*/
