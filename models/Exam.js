// external imports
const { Schema, model } = require("mongoose");

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
    questionPaperID: {
      type: String,
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
        correctOption: {
          type: String,
          required: true,
        },
      },
    ],
    // studentsProgress: [
    //   {
    //     student: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "User",
    //       required: true,
    //     },
    //     answeredMcqQuestions: {
    //       type: Number,
    //       default: 0,
    //     },
    //   },
    // ],
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
