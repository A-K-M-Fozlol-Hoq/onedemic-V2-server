// external imports
const { Schema, model } = require("mongoose");

// create schema
const courseSchema = new Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    courseTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    courseCode: {
      type: String,
      unique: true,
    },
    photo: {
      type: String,
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
