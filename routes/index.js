//external imports
const express = require("express");

//internal imports
const userRouter = require("./userRouter");
const stripeRouter = require("./stripeRouter");
const courseRouter = require("./courseRouter");
const chatRouter = require("./chatRouter");
const examRouter = require("./examRouter");
const pdfRouter = require("./pdfRouter");
const MCQRouter = require("./MCQRouter");
const resultRouter = require("./resultRouter");

//declare router object -- module scaffolding
const router = express.Router();

router.use("/user", userRouter);
router.use("/stripe", stripeRouter);
router.use("/course", courseRouter);
router.use("/chat", chatRouter);
router.use("/exam", examRouter);
router.use("/pdf", pdfRouter);
router.use("/mcq", MCQRouter);
router.use("/result", resultRouter);

//export router object
module.exports = router;
