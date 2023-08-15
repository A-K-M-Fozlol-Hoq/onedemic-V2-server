// external imports
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// create schema
const resultSchema = new Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    examType: {
      type: String,
      enum: ["mcq", "written"],
      required: true,
    },
    answeredMcqs: [
      {
        question: {
          type: String,
          required: true,
        },
        options: [
          {
            type: String,
            required: true,
          },
        ],
        selectedOption: {
          type: String,
        },
      },
    ],
    mark: {
      type: Number,
      default: 0,
    },
    answerScript: {
      type: String,
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "PDF",
    },
  },
  {
    timestamps: true,
    collection: "results",
  }
);

// create model
const Result = model("Result", resultSchema);

// export model
module.exports = Result;
