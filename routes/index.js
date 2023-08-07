//external imports
const express = require("express");

//internal imports
const userRouter = require("./userRouter");
const stripeRouter = require("./stripeRouter");
const courseRouter = require("./courseRouter");
const chatRouter = require("./chatRouter");

//declare router object -- module scaffolding
const router = express.Router();

router.use("/user", userRouter);
router.use("/stripe", stripeRouter);
router.use("/course", courseRouter);
router.use("/chat", chatRouter);

//export router object
module.exports = router;
