const stripe = require("stripe")(process.env.STRIPE_API_SECRET_KEY);

// internal imports
const User = require("../models/User");

// user controller object
const userController = {};

// insert new user at user collection
userController.createUser = async (req, res) => {
  try {
    // // create Stripe customer ID
    // const customer = await stripe.customers.create({
    //   email: req.body.email,
    // });

    // // stripeCustomerID: ,

    // // create newUserData object
    // const newUserData = {
    //   name: req.body.name,
    //   email: req.body.email,
    //   role: req.body.role,
    //   status: req.body.status,
    //   profile: req.body.profile,
    //   uid: req.body.uid,
    //   selectedPlan: req.body.selectedPlan,
    //   stripeCustomerID: customer.id,
    //   usedCreditToday: 0,
    //   // refrestToken: req.body.refrestToken,
    // };

    // // create new user instance
    // const newUser = new User(newUserData);

    // // save user at dabase
    // const result = await newUser.save();

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

userController.getUser = async (req, res, next) => {};

// userController.getUser = async (req, res, next) => {
//   try {
//     const email = req.body.email;

//     const tokenSecret = req.headers?.authorization?.split(" ")[1];
//     if (!tokenSecret || process.env.USER_TOKEN_KEY != tokenSecret) {
//       const error = new Error("Please send valid token!");
//       error.code = 401;
//       throw error;
//     }

//     if (email) {
//       // validation part
//       const isEmailValid = isEmailValidFunc(email);

//       if (isEmailValid) {
//         // get from db
//         const user = await User.findOne({ email: email });
//         if (user) {
//           // create jwt token
//           const tokenData = {
//             name: user.name,
//             email: email,
//             userType: user.userType,
//           };
//           var token = jwt.sign({ tokenData }, process.env.JWT_SECRET, {
//             expiresIn: process.env.JWT_EXPIRE, // expires in 1 day
//           });

//           res.status(200).json({
//             isSuccess: true,
//             message: "found user data",
//             user,
//             token,
//           });
//         } else {
//           res.status(400).json({
//             isSuccess: true,
//             message:
//               "the data in the input request is not valid or present in the db",
//             user,
//             token,
//           });
//         }
//       } else {
//         res.status(422).json({
//           isSuccess: false,
//           message: "please provide valid email.",
//         });
//       }
//     } else {
//       res.status(422).json({
//         isSuccess: false,
//         message: " email is required",
//       });
//     }
//   } catch (e) {
//     res.status(e.code || 500).send({
//       message: e.message || `unknown error ocurred at user controller`,
//       isSuccess: false,
//     });
//   }
// };

module.exports = userController;
