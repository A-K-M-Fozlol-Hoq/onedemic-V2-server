// external imports
const { Schema, model } = require("mongoose");

// create schema
const resultSchema = new Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    results: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
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
        answerScriptID: {
          // type: String,
          type: mongoose.Schema.Types.ObjectId,
          ref: "PDF",
        },
      },
    ],
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
