const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const webpack = require("webpack");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const ormFactory = require('./server/core/orm/factory').instance();
const handlerFactory = require('./server/core/handlers/factory').instance();
const configurationFactory = require("./server/core/configuration/factory").instance();
const devMiddleware = require("webpack-dev-middleware");

const index = require("./server/routes/index");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/**
 * Initialize Webpack Configuration
 */
const nodeEnv = configurationFactory.getEnv();

if (nodeEnv.value === "development") {
  const config = require("webpack.dev");
  const compiler = webpack(config);
  app.use(require("webpack-hot-middleware")(compiler));
  app.use(
    devMiddleware(compiler, {
      noInfo: true,
      publicPath: config.output.publicPath
    })
  );
} else {
  app.use("/build", express.static(path.join(__dirname, "build")));
}

// this will sync db for starting.
app.locals.db = ormFactory.start();
// initialize authentication
//app.use(authenticationFactory.initialize());

// http handler
app.use(handlerFactory.httpHandler);

// use routes
app.use('/', index);

// exception handler
app.use(handlerFactory.exceptionHandler);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log(err.message);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
