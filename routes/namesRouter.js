const express = require("express");
var bodyParser = require("body-parser");

const namesRouter = express.Router();
namesRouter.use(bodyParser.json());

const Name = require("../models/names.js");

namesRouter.get("/get/all", (req, res) => {
  Name.aggregate([{ $sample: { size: 10 } }]).exec(function(err, names) {
    if (!names) {
      res.send({ error: "error getting names" });
    } else {
      res.send(names);
    }
  });
});

namesRouter.get("/get/boy", (req, res) => {
  Name.aggregate([{ $match: { gender: "M" } }, { $sample: { size: 10 } }]).exec(
    function(err, names) {
      if (!names) {
        res.send({ error: "error getting names" });
      } else {
        res.send(names);
      }
    }
  );
});

namesRouter.get("/get/girl", (req, res) => {
  Name.aggregate([{ $match: { gender: "F" } }, { $sample: { size: 10 } }]).exec(
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
