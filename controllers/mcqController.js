// internal imports
const Chat = require("../models/Chat");
const MCQ = require("../models/MCQ");

// mcq controller object
const mcqController = {};

// get mcq data
mcqController.getMCQ = async (req, res, next) => {
  try {
    const searchString = req.body.searchString;

    if (!searchString) {
      return res.status(400).send({
        message: "Missing searchString",
        isSuccess: false,
      });
    }

    const matchingMCQs = await MCQ.find({
      question: { $regex: searchString, $options: "i" }, // Use a regular expression for substring match
    }).limit(10);

    res.status(200).send({
      message: "MCQ suggestions fetched successfully",
      isSuccess: true,
      data: matchingMCQs,
    });
  } catch (error) {
    console.error("Error fetching MCQ suggestions:", error);
    res.status(500).send({
      message: error.message || "Internal server error",
      isSuccess: false,
    });
  }
};

module.exports = mcqController;
