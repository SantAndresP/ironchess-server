/*    Setup.    */
const express = require("express");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const logger = require("morgan");
const socket = require("socket.io");

// Database.
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
require("./config/db.config");
require("dotenv").config();

// Models.
const UserModel = require("./models/User.model");
const GameModel = require("./models/Game.model");

app.use(
  session({
    secret: "marshall-attack",
    saveUninitialized: true,
    resave: true,
    cookie: {
      maxAge: 60 * 60 * 24 * 1000,
    },

    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 60 * 60 * 24,
      autoRemove: "disabled",
    }),
  })
);

app.use(logger("dev"));

// Sets origin of the client.
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

/*    Routes.    */
const authRoutes = require("./routes/auth.routes");
app.use("/api", authRoutes);

const fileUploads = require("./routes/upload.routes");
app.use("/api", fileUploads);

const mainRoutes = require("./routes/main.routes");
app.use("/api", mainRoutes);

app.use((req, res, next) => {
  // If no routes match, send them the React HTML.
  res.sendFile(__dirname + "/public/index.html");
});

/*    Port.    */
const server = app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log("Server is running at PORT 5000.");
});

/*
 *    Socket.IO
 */
io = socket(server);

io.on("connection", (socket) => {
  console.log(socket.id);

  // Chat box.
  socket.on("join_room", (data) => {
    socket.join(data);

    console.log("User Joined Room: " + data);
  });

  socket.on("send_message", (data) => {
    console.log("Chatbox data!!!!!!", data);
    socket.to(data.room).emit("receive_message", data.content);
  });

  // Chess game.
  socket.on("join_game", (data) => {
    socket.join(data.roomId);
    console.log("User joined game:", data);

    GameModel.findOne({ roomId: data.roomId }).then((findResult) => {
      console.log("Find result!!!!!", findResult);
      if (!findResult) {
        GameModel.create({
          roomId: data.roomId,
          white: data.white,
        }).then((res) => {
          console.log(res);
        });
      } else {
        GameModel.findOneAndUpdate(
          { roomId: data.roomId },
          { black: data.black },
          { new: true }
        )
          .then((res) => {
            console.log("findOneAndUpdate Res!", res);
          })
          .catch((err) => {
            console.log("findOneAndUpdate Catch!", err);
          });
      }
    });
  });

  socket.on("send_game_info", (data) => {
    console.log("This is send_game_info", data);

    GameModel.findOneAndUpdate(
      { roomId: data.room },
      { $set: { movetext: data.moves } }
    ).then((res) => {
      console.log(res);
    });
    socket.to(data.room).emit("receive_info", data);
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED FROM ROOM.");
  });
});
