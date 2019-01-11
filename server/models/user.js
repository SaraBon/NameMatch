const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//schema
const User = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  names: {
    type: Array
  },
  linkCode: {
    type: String
  },
  linkedID: {
    type: String
  },
  linkedName: {
    type: String
  },
  seenFriendsNames: {
    type: Array
  }
});

module.exports = mongoose.model("User", User);
