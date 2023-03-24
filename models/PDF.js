// external imports
const { Schema, model } = require("mongoose");

// create schema
const pdfSchema = new Schema(
  {
    pdfId: { type: String, required: true },
    pdfBase64: { type: String, required: true },
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

/*
alternative model: 
name: {
  type: String,
  required: true,
},
data: {
  type: Buffer,
  required: true,
},
contentType: {
  type: String,
  required: true,
},
*/
