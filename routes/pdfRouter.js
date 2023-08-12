//external imports
const express = require("express");

//internal imports
const pdfController = require("../controllers/pdfController");
const isAuthenticated = require("../middlewares/isAuthenticated");

// Destructuring controller
const { createPDF, getPDFById } = pdfController;

// Router Object -- module scaffolding
const router = express.Router();

router
  /**
   * @method POST
   * @endpoint base_url/api/v1/pdf/create-pdf
   */
  .post("/create-pdf", isAuthenticated, createPDF)
  /**
   * @method GET
   * @endpoint base_url/api/v1/pdf/get-pdf/:pdfId
   */
  .get("/get-pdf/:pdfId", getPDFById)
  // .post("/get-pdf/:pdfId", getPDFById)
  // .get("/get-pdf/:pdfId", getPDFById)
// .get("/get-pdf", isAuthenticated, getPDFById);

module.exports = router;
