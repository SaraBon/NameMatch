const express = require("express");
var bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const keys = require("../config/keys");

// Load input validation for registration and login form
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
//load user model
const User = require("../models/user.js");

const userRouter = express.Router();
userRouter.use(bodyParser.json());

// get a user's data
userRouter.get("/get/:id", (req, res) => {
  User.findById(req.params.id, function(err, p) {
    if (!p) {
      return res.status(400).json({ error: "cannot read user" });
      res.send("no such user");
    } else {
      res.send(p);
    }
  });
});

// register a user
userRouter.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    }
    // create a new user object from the inputted data
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      linkCode: req.body.linkCode
    });

    // Hash password before saving in database
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => res.json(user))
          .catch(() => {
            return res.status(400).json({ error: "An error occured" });
          });
      });
    });
  });
});

//  Login user and return JWT (token)
userRouter.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched --> Create JWT Payload
        const payload = {
          _id: user.id
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect, try again" });
      }
    });
  });
});

//add the current name to the user's names list
userRouter.put("/update/:id", (req, res) => {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      res.send(err);
    } else {
      user.names.push(req.body.name);
      user.save(function(err) {
        if (err) res.send(err);
        res.send(user);
      });
    }
  });
});

//add the seen name to the user's list of seen friend's names
userRouter.put("/update/seen/:id", (req, res) => {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      res.send(err);
    } else {
      user.seenFriendsNames.push(req.body.name);
      user.save(function(err) {
        if (err) res.send(err);
        res.send(user);
      });
    }
  });
});

// delete a name from the user's names list
userRouter.post("/delete/:id", (req, res) => {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      return res
        .status(404)
        .json({ error: "Oops, the name was not deleted, please try again" });
    } else {
      user.names.splice(req.body.index, 1);
      user.save(function(err) {
        if (err) {
          return res.status(400).json({
            error: "Oops, the name was not deleted, please try again"
          });
        }

        res.send(user);
      });
    }
  });
});
// find a user by his code
userRouter.post("/findUserByCode", (req, res) => {
  User.findOne(req.body, function(err, user) {
    if (!user) {
      res.json({ error: "no " });
    } else {
      res.send(user);
    }
  });
});

//link two users by their ID
userRouter.put("/linkUsers/:id", (req, res) => {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      res.send(err);
    } else {
      user.linkedID = req.body.userID;
      user.linkedName = req.body.userName;
      user.save(function(err) {
        if (err) res.send(err);
        //res.send(user);
      });
    }
  });

  User.findById(req.body.userID, function(err, user) {
    if (err) {
      res.send(err);
    } else {
      user.linkedID = req.params.id;
      user.linkedName = req.body.myName;

      user.save(function(err) {
        if (err) res.send(err);
        res.send(user);
      });
    }
  });
});

// delete an account
userRouter.delete("/delete/:id", (req, res) => {
  User.deleteOne({ _id: req.params.id }, function(err, p) {
    return res.json("User deleted");
  });
});

module.exports = userRouter;
