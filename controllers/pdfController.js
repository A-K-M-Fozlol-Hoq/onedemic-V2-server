// internal imports
const PDF = require("../models/PDF");

// pdf controller object
const pdfController = {};

// store pdf
pdfController.createPDF = async (req, res) => {
  try {
    const file = req.files.file;
    console.log(file);

    // Basic validation for the uploaded file
    if (!file) {
      res.status(422).send({
        message: "Please upload a valid file",
        isSuccess: false,
      });
      return;
    }

    const newPDF = file.data;
    const encPDF = newPDF.toString("base64");

    const pdfFile = {
      contentType: file.mimetype,
      size: file.size,
      pdfBase64: encPDF,
    };

    // Create a new PDF instance
    const pdf = new PDF(pdfFile);

    // Save the PDF document to the database
    const newPdf = await pdf.save();

    // console.log({ nenewPdfwPdf });

    res.status(200).send({
      message: "PDF created successfully",
      isSuccess: true,
      data: newPdf,
    });
  } catch (error) {
    res.status(error.code || 500).send({
      message: error.message || `Something went wrong`,
      isSuccess: false,
    });
  }
};

module.exports = pdfController;
