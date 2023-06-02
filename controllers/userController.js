const stripe = require("stripe")(process.env.STRIPE_API_SECRET_KEY);

// internal imports
const User = require("../models/User");

// user controller object
const userController = {};

// insert new user at user collection
userController.createUser = async (req, res) => {
  try {
    // create Stripe customer ID
    const customer = await stripe.customers.create({
      email: req.body.email,
    });

    //Create end date. End data is 7 days later from today.
    const now = new Date();
    const endDate = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 7,
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
      )
    );

    // create newUserData object
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      status: req.body.status,
      profile: req.body.profile,
      uid: req.body.uid,
      selectedPlan: req.body.selectedPlan,
      stripeCustomerID: customer.id,
      usedCreditToday: 0,
      endDate,
    };

    // create new user instance
    const newUser = new User(newUserData);

    // save user at dabase
    const result = await newUser.save();

    // send success response
    res.status(200).json({
      isSuccess: true,
      message: "user data successfully saved",
      user: req.user,
    });
  } catch (err) {
    res.status(err.code || 500).send({
      message: err.message || `unknown error ocurred at user controller`,
      isSuccess: false,
    });
  }
};

userController.getUser = async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email: "akmfozlolhoq@gmail.com" }).select(
      "-courses"
    );
    console.log(email, "this is the user data at get User", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .send({ isSuccess: true, user, message: "endpoint on progress" });
  } catch (err) {
    res.status(err.code || 500).send({
      message: err.message || `unknown error ocurred at user controller`,
      isSuccess: false,
    });
  }
};

userController.updateUserNameAndProfile = async (req, res, next) => {
  try {
    const { email } = req.params;
    const { profile, name } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ isSuccess: false, message: "User not found" });
    }

    // Update profile and name
    user.profile = profile;
    user.name = name;

    // Save the updated user
    await user.save();

    res.status(200).json({
      isSuccess: true,
      message: "User profile and name updated successfully",
    });
  } catch (err) {
    res.status(err.code || 500).send({
      message: err.message || `unknown error ocurred at user controller`,
      isSuccess: false,
    });
  }
};

module.exports = userController;
