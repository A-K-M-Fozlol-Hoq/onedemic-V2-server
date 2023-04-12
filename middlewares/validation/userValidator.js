// external imports
const Joi = require("joi");
const createError = require("http-errors");

//User validator object -- module scaffolding
const userValidator = {};

// creating userSchema for joi validdator
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

// creating  isUserValid middleware
userValidator.isUserValid = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    const message = error.details.map((detail) => detail.message).join(", ");
    next(createError(403, message));
  }
  next();
};

// export userValidator
module.exports = userValidator;
