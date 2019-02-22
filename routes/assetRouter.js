const express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");

const assetRouter = express.Router();
assetRouter.use(bodyParser.json());

var assetlinks = fs.readFileSync(__dirname + "/assetlinks.json");

assetRouter.get("/assetlinks.json", function(req, res, next) {
  console.log("test");
  res.set("Content-Type", "application/json");
  res.status(200).send(assetlinks);
});

module.exports = assetRouter;
