require("dotenv").config();

const socketIO = require("socket.io");
const mongoose = require("mongoose");
const { success, error } = require("consola");

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_DEV, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

mongoose.connection.on("error", (err) => {
  error({
    message: `Connect to MongoDB error: ${err.message}`,
    badge: true,
  });
});

mongoose.connection.once("open", () => {
  success({
    message: `Connected to MongoDB`,
    badge: true,
  });
});

require("./src/models/User");
require("./src/models/Role");
require("./src/models/Category");
require("./src/models/Shop");
require("./src/models/Product");
require("./src/models/RefreshToken");

const app = require("./src/app");
// app.disable('etag');

const port = process.env.PORT;

const server = app.listen(port, () =>
  success({
    message: `Server running on port ${port}`,
    badge: true,
  })
);
const io = socketIO(server);
io.on("connection", function (socket) {
  // log("User " + chalk.green(socket.id) + " connected");
  socket.on("sendMessage", function (msg) {
    console.log("message: " + msg);
    io.emit("newMsg", msg);
  });
  socket.on("change_request_status", function (status) {
    io.emit("onchange_request_status", status);
  });
  socket.on("disconnect", function () {
    console.log("User Disconnected");
  });
});
