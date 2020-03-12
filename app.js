require("./db/db");
require("dotenv").config();
require("./jobs/index");

var http = require("http");
var socketIo = require("socket.io");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cookieSession = require("cookie-session");
var usersRouter = require("./routes/users");
var coinsRouter = require("./routes/coins");
var passport = require("./passport/index");
const _ = require("lodash");

var app = express();
const Tickers = require("./models/tickers");

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 1000
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(passport.session());

// IMPORTANT: routes
app.use("/users", usersRouter);
app.use("/coins", coinsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

var server = http.createServer(app);

const io = socketIo(server); // < Interesting!

const getApiAndEmit = async socket => {
  try {
    const coins = await Tickers.find().sort({
      updated_timestamp: -1
    });
    const history_coins = _.chain(
      _.sortBy(coins, [
        function(o) {
          return o.marketcap_rank;
        }
      ])
    )
      .groupBy("ticker")
      .map((value, key) => ({ ticker: key, data: value }))
      .value();

    socket.emit("FromAPI", history_coins); // Emitting a new message. It will be consumed by the client
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

let interval;

io.on("connection", socket => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 10000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port);

module.exports = app;
