const { connect, set } = require('mongoose');
set('strictQuery', false);

const liveURL = process.env.MONGO_STR_LIVE;
const testURL = process.env.MONGO_STR_TEST;
let selected_URL;

if (process.env.NODE_ENV !== 'development') {
  selected_URL = testURL;
} else {
  selected_URL = liveURL;
}

module.exports = connect(selected_URL, { useNewUrlParser: true });