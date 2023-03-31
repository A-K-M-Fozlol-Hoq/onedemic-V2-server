const express = require("express");
const userController = require("../controllers/userController");
const isUserValid = require("../middlewares/user/isUserValid");
const isAuthenticated = require("../middlewares/isAuthenticated");
// const { verifyCustomTokenMiddleware } = require('../middlewares/verifyCustomToken');
// Destructuring controllers
const { createUser, getUser } = userController;

// Router Object -- module scaffolding
const router = express.Router();

/**
 * @method POST
 * @endpoint base_url/api/user/createUser
 */
router.post("/createUser", isAuthenticated, isUserValid, createUser);

/**
 * @method GET
 * @endpoint base_url/api/user/getUser
 */
router.post("/getUser", getUser);

module.exports = router;
