const User = require("../models/User");
const { stripe } = require("../utils/stripe");

// user controller object
const stripeController = {};

//createSession
stripeController.createSession = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    let stripeCustomerId = user?.stripeCustomerID;

    let session;
    try {
      session = await stripe.checkout.sessions.create(
        {
          mode: "subscription",
          payment_method_types: ["card"],
          currency: "usd",
          line_items: [
            {
              price: req.body.priceId,
              quantity: 1,
            },
          ],
          success_url: "https://onedemic.netlify.app/dashboard/manage-profile",
          cancel_url: "https://onedemic.netlify.app/dashboard/manage-profile",
          customer: stripeCustomerId,
        },
        {
          apiKey: process.env.STRIPE_SECRET_KEY,
        }
      );
    } catch (er) {
      console.log(er);
      return res.status(500).send({
        isSuccess: false,
        session: "Failed to create session",
      });
    }

    return res.status(200).send({
      isSuccess: true,
      session: session,
    });
  } catch (e) {
    res.status(500).send({
      isSuccess: false,
      message: "something went wrong",
    });
  }
};

//
stripeController.webhook = async (request, response, next) => {
  try {
    console.log("object");
    const sig = request.headers["stripe-signature"];
    const endpointSecret = "whsec_Wos90NZ9cN2acmpTUaDGjJCir828oCT9";

    let event;

    try {
      console.log({
        stripeWebhooksConstructEvent: stripe.webhooks.constructEvent,
      });
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log("try executed");
    } catch (err) {
      console.log("try error");
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    //     when 'subscription_schedule.canceled'
    //     subscription_schedule = event.data.object
    // when 'subscription_schedule.created'
    //     subscription_schedule = event.data.object

    switch (event.type) {
      case "charge.succeeded":
        const chargeSucceeded = event.data.object;
        const status = chargeSucceeded?.status;
        const paid = chargeSucceeded?.paid;
        const amount_captured = chargeSucceeded?.amount_captured;
        const email = chargeSucceeded?.billing_details?.email;
        console.log({
          email,
          status,
          paid,
          amount_captured,
        });
        if (email && paid && amount_captured && status === "succeeded") {
          //update your database
          if (amount_captured === 500) {
            //add basic subscription
            try {
              const query = { email: email };
              const options = { upsert: true };
              const endDate = new Date();
              endDate.setMonth(endDate.getMonth() + 1);

              const updateDoc = {
                $set: {
                  selectedPlan: "premium",
                  endDate: endDate,
                },
              };
              const userUpdate = await User.updateOne(
                query,
                updateDoc,
                options
              );
            } catch (e) {
              console.log(e);
            }
          } else if (amount_captured === 1500) {
            //add standard subscription
            try {
              const query = { email: email };
              const options = { upsert: true };
              const endDate = new Date();
              endDate.setMonth(endDate.getMonth() + 1);

              const updateDoc = {
                $set: {
                  selectedPlan: "premium",
                  endDate: endDate,
                },
              };
              const userUpdate = await User.updateOne(
                query,
                updateDoc,
                options
              );
            } catch (e) {
              console.log(e);
            }
          } else {
            response.status(422).send({
              isSuccess: false,
              message: "No valid package found!",
            });
          }
        } else {
          response.status(422).send({
            isSuccess: false,
            message:
              "billing details or some important payment infos are missing!",
          });
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.status(200).send({
      isSuccess: true,
      message: "Successfully updated out database",
    });
  } catch (e) {
    response.status(500).send({ message: e.message || "something went wrong" });
  }
};

function getCustomerEmail(customerId) {
  return stripe.customers
    .retrieve(customerId)
    .then((customer) => customer.email)
    .catch((error) => {
      // Handle error retrieving customer
      console.error("Error retrieving customer:", error);
      throw error;
    });
}

module.exports = stripeController;
