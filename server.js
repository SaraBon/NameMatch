const userRouter = require("./routes/userRouter.js");
const namesRouter = require("./routes/namesRouter.js");
const mongoose = require("mongoose");
const express = require("express");
var bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
var fs = require("fs");

const app = express();

const port = process.env.PORT || 5000;

const DB = process.env.MONGODB_URI || "mongodb://localhost:27017/expresspost";

mongoose
  .connect(
    DB,
    { useNewUrlParser: true }
  )
  .then(
    () => {
      console.log("Database is connected");
    },
    err => {
      console.log("Can not connect to the database" + err);
    }
  );

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "client", "build")));

app.use("/users", userRouter);
app.use("/names", namesRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

var assetlinks = fs.readFileSync(__dirname + "/static/assetlinks.json");
app.get("/.well-known/assetlinks.json", function(req, res, next) {
  res.set("Content-Type", "application/json");
  res.status(200).send(assetlinks);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
