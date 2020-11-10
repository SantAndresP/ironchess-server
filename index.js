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

app.use((req, res, next) => {
  // If no routes match, send them the React HTML.
  res.sendFile(__dirname + "/public/index.html");
});

/*    Port.    */
const server = app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log("Server is running at PORT 5000.");
});

/*    Socket.IO    */
io = socket(server);

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("join_game", (data) => {
    socket.join(data);
    console.log("User joined Game: " + data);
  });

  socket.on("send_game_info", (data) => {
    console.log(data);
    socket.to(data.room).emit("receive_info", data);
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED.");
  });
});
