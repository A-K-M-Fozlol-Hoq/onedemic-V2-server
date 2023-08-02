//external imports
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const fileUpload = require("express-fileupload");

//internal imports
const mongoDBConnect = require("./config/db");
const routers = require("./routes");
const {
  notFoundHandler,
  commonErrorHandler,
} = require("./middlewares/errorHandler");

//create app object and define port
const app = express();
const PORT = process.env.PORT || 5000;

//used middlewares
const middlewares = [
  cors(),
  // express.json({ limit: "10mb" }),
  cookieParser(),
  fileUpload(),
  express.urlencoded({ extended: true }),
];
app.use(middlewares);

app.use((req, res, next) => {
  console.log(req.originalUrl);
  if (req.originalUrl === "/stripe/webhook") {
    next();
  } else {
    express.json({ limit: "10mb" })(req, res, next);
  }
});

//use morgan at development environment
if (process.env.NODE_ENV !== "production") {
  app.use(require("morgan")("dev"));
}

//declare routes
app.use("/api/v1", routers);

//hello world get request method
app.get("/", (req, res) => {
  res.status(200).send({
    message: "Hello From onedemic!❤",
    date: "3-27-2023", //last deployment date
  });
});

// // 404 not found handler
app.use(notFoundHandler);

// common error handler
app.use(commonErrorHandler);

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
