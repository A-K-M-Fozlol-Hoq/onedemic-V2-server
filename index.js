//external imports
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorhandler = require("errorhandler");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const axios = require("axios");

//internal imports
const mongoDBConnect = require("./config/db");
const routers = require("./routes");

//create app object and define port
const app = express();
const PORT = process.env.PORT || 5000;

//used middlewares
const middlewares = [
  cors(),
  express.json({ limit: "10mb" }),
  errorhandler({ dumpExceptions: true, showStack: true }),
  cookieParser(),
  fileUpload(),
  express.urlencoded({ extended: true }),
];
app.use(middlewares);

//use morgan at development environment
if (process.env.NODE_ENV !== "production") {
  app.use(require("morgan")("dev"));
}

//declare routes
app.use(routers);

//test get request method
app.get("/", (req, res) => {
  res.status(200).send({
    message: "Hello From onedemic!❤",
    date: "3-12-2023", //last deployment date
  });
});

//default error handler
app.use(require("./middlewares/error/error"));

// Listening to server
mongoDBConnect
  .then(() => {
    console.log(`Alhamdu lillah, mongoose DB connected`);
    app.listen(PORT, () => console.log("onedemic is running on PORT:", PORT));
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
