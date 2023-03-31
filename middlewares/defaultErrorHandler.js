const ErrorHander = require("./error");

module.exports = (err, req, res, next) => {
  err.statusCode = err.status || 500;
  err.message = err.message || "Internal Server Error";

  console.log(err.message, "default Error handler");
  res.status(err.statusCode).json({
    isSuccess: false,
    msg: err.message,
  });
};
