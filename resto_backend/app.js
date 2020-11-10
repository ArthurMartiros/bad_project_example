require("custom-env").env(process.env.NODE_ENV);
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const admin = require("./admins/api");
const resto = require("./restos/api");
const menu = require("./menus/api");
const table = require("./tables/api");
const user = require("./users/api");
const orders = require("./order-history/api");
const photos = require("./photos/api");
const fee_call = require("./fee_and_call/api");

const app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.options("*", cors());
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: "false" }));

process.setMaxListeners(0);

app.use("/", admin);
app.use("/", resto);
app.use("/", menu);
app.use("/", table);
app.use("/", user);
app.use("/", fee_call);
app.use("/orders", orders);
app.use("/photos", photos);

// app.all('*', function (req, res, next) {
//     res.header('Cache-Control', 'no-store');
//     res.header("Access-Control-Allow-Origin", "http://localhost:8080");
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header("Access-Control-Allow-Headers", "X-Requested-With,     Content-Type");
//     next();
// });
app.listen(process.env[`PORT-${process.env.name}`], () => {
  console.log(
    "Application Is Listening On Port ",
    process.env[`PORT-${process.env.name}`]
  );
});
