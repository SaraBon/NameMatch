//load dependencies
const express = require("express");
var bodyParser = require("body-parser");

const namesRouter = express.Router();
namesRouter.use(bodyParser.json());

const Name = require("../models/names.js");

namesRouter.get("/get", (req, res) => {
  console.log("getting names");

  var r = Math.floor(Math.random() * 71142);

  Name.aggregate([{ $match: { gender: "F" } }, { $sample: { size: 6 } }]).exec(
    function(err, names) {
      console.log(names);
      if (!names) {
        console.log("err getting names");
        res.send({ answer: "err getting names" });
      } else {
        res.send(names);
      }
    }
  );
});

module.exports = namesRouter;
