// external imports
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// create schema
const examSchema = new Schema(
  {
    examName: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    startDateTime: {
      type: Date,
      required: true,
    },
    endDateTime: {
      type: Date,
      required: true,
    },
    examType: {
      type: String,
      enum: ["mcq", "written"],
      required: true,
    },
    questionPaper: {
      type: String,
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "PDF",
    },
    mcqQuestions: [
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
        answer: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: "exams",
  }
);

// create model
const Exam = model("Exam", examSchema);

// export model
module.exports = Exam;
