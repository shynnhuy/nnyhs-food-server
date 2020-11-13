require("dotenv").config();

const socketIO = require("socket.io");
const mongoose = require("mongoose");
const chalk = require("chalk");
const { success, error } = require("consola");

const log = console.log;

mongoose.Promise = global.Promise;
// mongoose.connect(process.env.DB_DEV, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
//   useCreateIndex: true,
// });

// mongoose.connection.on("error", (err) => {
//   log(chalk.red(`Connect to MongoDB error: ${err.message}`));
// });

// mongoose.connection.once("open", () => {
//   log(chalk.green(`Connected to MongoDB`));
// });

require("./src/models/User");
require("./src/models/Role");
require("./src/models/Category");
require("./src/models/Shop");
require("./src/models/Product");
require("./src/models/RefreshToken");

const app = require("./src/app");
// app.disable('etag');

const port = process.env.PORT;

const startApp = async () => {
  try {
    await mongoose.connect(process.env.DB_DEV, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.clear();
    success({
      message: `Successfully connected to ${process.env.DB_DEV}`,
      badge: true,
    });
    const server = app.listen(port, () =>
      success({
        message: `Server running on port ${port}`,
        badge: true,
      })
    );
    const io = socketIO(server);
    socketListen(io);
  } catch (err) {
    error({
      message: `Unable to connect ${process.env.DB_DEV}\n${err}`,
      badge: true,
    });
    startApp();
  }
};
startApp();
// const server = app.listen(port, () =>
//   success({
//     message: `Server running on port ${port}`,
//     badge: true,
//   })
// );
// const io = socketIO(server);

// const server = app.listen(port, () =>
//   log(
//     chalk.green.bold("Server") +
//       chalk.yellow(` running on port `) +
//       chalk.red(port)
//   )
// );
function socketListen(io) {
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
}
