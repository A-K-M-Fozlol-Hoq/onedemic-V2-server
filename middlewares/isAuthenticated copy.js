const { getAuth } = require("firebase-admin/auth");
const { admin } = require("../config/firebase.config.js");

const isAuthenticated = (req, res, next) => {
  try {
    if (!req.headers?.authorization?.startsWith("Bearer ")) {
      return res.status(401).send({ message: "unauthorized" });
    } else {
      const token = req.headers.authorization.split(" ")[1];
      console.log(token, admin);
      getAuth(admin)
        .verifyIdToken(token)
        .then((decodedUser) => {
          if (!decodedUser) {
            return res.status(403).send({ message: "forbidden" });
          }
          req.user = decodedUser;
          console.log(decodedUser, "decodedUser");
          next();
        })
        .catch((err) => {
          console.log(err, "decodedUser");
          if (err.code === "auth/id-token-expired") {
            return res.status(403).json({
              message: "Session Expired please login again",
            });
          }
          console.log({
            code: err.code,
          });
          return res.status(500).json({ message: err.message });
        });
    }
  } catch (err) {
    console.log({
      code: err.code,
    });
    return res.status(500).send({ message: err.message });
  }
};

module.exports = isAuthenticated;
