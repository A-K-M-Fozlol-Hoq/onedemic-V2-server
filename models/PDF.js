// external imports
const { Schema, model } = require("mongoose");

// create schema
const pdfSchema = new Schema(
  {
    pdfBase64: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
  },
  {
    timestamps: true,
    collection: "pdf",
  }
);

// create model
const PDF = model("PDF", pdfSchema);

// export model
module.exports = PDF;
