var User = require("../models/user.js");

module.exports = {
  addNames: (req, res, next) => {
    console.log("usercontroller receiving: ");
    console.log(req.body);
    //---------------------------------

    User.findById(req.body._id, function(err, p) {
      if (!p) {
        var newUser = new User(req.body);
        newUser.save((err, user) => {
          return user.addNames(req.body);
        });
      } else {
        p.save((err, user) => {
          return user.addNames(req.body);
        });
      }
    });
    res.send("response from method addNames in user controller");
  }

  //     deleteNames: (req, res) => {
  //
  //       console.log("usercontroller receiving for deletion: ")
  //       console.log(req.body)
  // //---------------------------------
  //
  // User.findById(req.body._id, function(err, p) {
  //
  //
  //     p.save((err, user) => {
  //       return user.deleteNames(req.body, res)
  //     })
  //
  // });
  // //res.send("hi from user.ctrl")
  //
  //     },
};
