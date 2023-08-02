// external imports
const { Schema, model, default: mongoose } = require("mongoose");

// create schema
const courseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: {
      type: String,
      unique: true,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    blockedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    pendingStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    autoEnroll: {
      type: Boolean,
      default: true,
      required: true,
    },
    exams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
      },
    ],
  },
  {
    timestamps: true,
    collection: "courses",
  }
);

// create model
const Course = model("Course", courseSchema);

// export model
module.exports = Course;
