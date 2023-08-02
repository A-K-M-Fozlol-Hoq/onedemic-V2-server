//external imports
const express = require("express");

//internal imports
const stripeController = require("../controllers/stripeController");
const isAuthenticated = require("../middlewares/isAuthenticated");

// Destructuring controller
const { createSession, webhook } = stripeController;

// Router Object -- module scaffolding
const router = express.Router();

router.post("/create-session", isAuthenticated, createSession);
router.post("/webhook", express.raw({ type: "application/json" }), webhook);

module.exports = router;
