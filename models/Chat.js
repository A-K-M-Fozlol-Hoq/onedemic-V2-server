// external imports
const { Schema, model } = require("mongoose");

// create schema
const chatSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "chat",
  }
);

// create model
const Chat = model("Chat", chatSchema);

// export model
module.exports = Chat;
