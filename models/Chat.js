// external imports
const { Schema, model, default: mongoose } = require("mongoose");

// create schema
const chatSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    isSentFromTeacher: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "chats",
  }
);

// create model
const Chat = model("Chat", chatSchema);

// export model
module.exports = Chat;
