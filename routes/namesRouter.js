const express = require("express");
var bodyParser = require("body-parser");

const namesRouter = express.Router();
namesRouter.use(bodyParser.json());

const Name = require("../models/names.js");

namesRouter.get("/get", (req, res) => {
  var r = Math.floor(Math.random() * 71142);

  Name.aggregate([{ $match: { gender: "F" } }, { $sample: { size: 6 } }]).exec(
    function(err, names) {
      if (!names) {
        res.send({ error: "error getting names" });
      } else {
        res.send(names);
      }
    }
  );
});

module.exports = namesRouter;
