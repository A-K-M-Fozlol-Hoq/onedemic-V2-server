// external imports
const { Schema, model } = require("mongoose");

// create schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin", "developer"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "pending", "inactive"],
      required: true,
    },
    profile: {
      type: String,
      required: true,
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    stripeCustomerID: {
      type: String,
      required: true,
      unique: true,
    },
    selectedPlan: {
      type: String,
      enum: ["none", "trial", "premium"],
      required: true,
      default: "none",
    },
    endDate: {
      type: Date,
      required: true,
    },
    lastLogin: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// create model
const User = model("User", userSchema);

// export model
module.exports = User;
