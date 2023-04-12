//external imports
const express = require("express");

//internal imports
const userRouter = require("./userRouter");

//declare router object -- module scaffolding
const router = express.Router();

router.use("/user", userRouter);

//export router object
module.exports = router;
