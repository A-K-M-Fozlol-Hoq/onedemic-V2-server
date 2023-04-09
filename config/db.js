//external imports
const { connect } = require("mongoose");

const liveURL = process.env.MONGO_STR_LIVE;
const testURL = process.env.MONGO_STR_TEST;
let selected_URL;

if (process.env.NODE_ENV !== "development") {
  selected_URL = testURL;
} else {
  selected_URL = liveURL;
}

module.exports = connect(testURL, { useNewUrlParser: true });
