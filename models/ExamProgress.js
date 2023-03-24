// external imports
const { Schema, model } = require("mongoose");

// create schema
const examProgressSchema = new Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    submissionTime: {
      type: Date,
    },
    mcqAnswers: {
      type: [
        {
          question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true,
          },
          selectedOption: {
            type: Number,
            required: true,
          },
        },
      ],
    },
    writtenAnswerPDF: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PDF",
    },
    status: {
      type: String,
      enum: ["Started", "Completed"],
      default: "Started",
    },
  },
  {
    timestamps: true,
    collection: "exam-progress",
  }
);

// create model
const ExamProgress = model("ExamProgress", examProgressSchema);

// export model
module.exports = ExamProgress;
