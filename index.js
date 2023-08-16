const multer = require("multer");
const {
  addUser,
  removeUser,
  getUserById,
  getRoomUsers,
} = require("./utils/message");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const http = require("http");
const { Server } = require("socket.io");
const Chat = require("./models/Chat");

const mongoDBConnect = require("./config/db");
const routers = require("./routes");
const {
  notFoundHandler,
  commonErrorHandler,
} = require("./middlewares/errorHandler");
const { default: mongoose } = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

const middlewares = [
  cors(),
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

if (process.env.NODE_ENV !== "production") {
  app.use(require("morgan")("dev"));
}

app.use("/api/v1", routers);

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Hello From onedemic!❤",
    date: "3-27-2023", //last deployment date
  });
});

// ################################# Messaging part #################################
// Socket.io Connection
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("join", (userData, callback) => {
    // console.log(userData);
    const { userId, room } = userData;
    // console.log({ userId, room });
    const { error, user } = addUser({ id: socket.id, userId, room });
    if (error) {
      callback(error);
    }

    socket.join(room);

    const roomUsers = getRoomUsers(room);
    io.to(room).emit("userList", { roomUsers: roomUsers });
    io.emit("userList", {
      _id: "newMessage._id",
    });

    callback();
  });

  socket.on("message", async (data) => {
    // console.log(data);
    const newMessage = new Chat(data);
    await newMessage.save();

    const user = getUserById(socket.id);
    const newMessageData = await Chat.find({ _id: newMessage?._id }).populate(
      "senderId",
      "name"
    );
    console.log(newMessageData, "ho");

    io.to(user?.room).emit("message", {
      _id: newMessage._id,
      message: newMessage.message,
      isSentFromTeacher: newMessage.isSentFromTeacher,
      senderId: newMessageData[0].senderId,
      createdAt: newMessage.createdAt || "createdAt",
    });
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "System",
        text: `${user.name} just left ${user.room}.`,
      });

      const roomUsers = getRoomUsers(user.room);
      io.to(user.room).emit("userList", { roomUsers });
    }
  });
});

app.use(notFoundHandler);

app.use(commonErrorHandler);

mongoDBConnect
  .then(() => {
    console.log(`Alhamdu lillah, mongoose DB connected`);
    server.listen(PORT, () =>
      console.log("onedemic is running on PORT:", PORT)
    );
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
