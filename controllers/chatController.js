// internal imports
const Chat = require("../models/Chat");

// chat controller object
const chatController = {};

// get chat data after login
chatController.getMessages = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const messages = await Chat.find({ courseId })
      .populate("senderId", "name")
      .sort({ createdAt: -1 })
      .exec();
    res.json(messages || []);
  } catch (err) {
    res.status(err.code || 500).send({
      message: err.message || `unknown error ocurred at chat controller`,
      isSuccess: false,
    });
  }
};

module.exports = chatController;
