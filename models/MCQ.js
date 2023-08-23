const { Schema, model } = require("mongoose");

const mcqSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [
        {
          type: String,
          required: true,
          trim: true,
        },
      ],
    },
    answer: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (val) {
          return this.options.includes(val);
        },
        message: "Answer should be one of the options",
      },
    },
    tags: {
      type: [String],
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "mcqs",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

mcqSchema.virtual("numOptions").get(function () {
  return this.options.length;
});

mcqSchema.index({ answer: 1 });

const MCQ = model("MCQ", mcqSchema);

module.exports = MCQ;
