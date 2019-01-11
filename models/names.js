const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//schema
const Name = new Schema(
  {
    name: {
      type: String
    },
    gender: {
      type: String
    },
    shownToPartner: {
      type: Boolean
    }
  },
  { collection: "names" }
);

module.exports = mongoose.model("Name", Name);
