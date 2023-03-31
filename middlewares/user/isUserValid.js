const Joi = require("joi");
const createError = require("http-errors");

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string()
    .valid("student", "teacher", "admin", "developer")
    .required(),
  status: Joi.string().valid("active", "pending", "inactive").required(),
  profile: Joi.string(),
  uid: Joi.string().required(),
  selectedPlan: Joi.string()
    .valid("trial", "basic", "premium", "none")
    .required(),
});

const isUserValid = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    const message = error.details.map((detail) => detail.message).join(", ");
    next(createError(403, message));
  }
  next();
};

module.exports = isUserValid;

/*
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
      enum: ["trial", "basic", "premium", "none"],
      required: true,
      default: "none",
    },
    endDate: {
      type: Date,
    },
    usedCreditToday: {
      type: Number,
      default: 0,
    },
    lastLogin: {
      type: Date,
      required: true,
      default: Date.now,
    },
    accessToken: {
      type: String,
      required: true,
    },
*/
