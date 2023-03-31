// external imports
const express = require("express");
const Joi = require("joi");
const stripe = require("stripe")("your_stripe_api_key");
const User = require("./models/user");

// create express app
const app = express();

// middleware to parse request body
app.use(express.json());

// define validation schema using Joi
const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string()
    .valid("student", "teacher", "admin", "developer")
    .required(),
  profile: Joi.string(),
});

// create endpoint to create a user
app.post("/users", async (req, res) => {
  try {
    // validate request body using Joi
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // create Stripe customer ID
    const customer = await stripe.customers.create({
      email: req.body.email,
    });

    // create user object with Stripe customer ID
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      profile: req.body.profile,
      stripeCustomerID: customer.id,
    });

    // save user data to database
    await user.save();

    // return success response
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// start server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
