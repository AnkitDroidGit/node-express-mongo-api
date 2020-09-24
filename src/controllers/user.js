var User = require("../models/user");
var jwt = require("jsonwebtoken");
var config = require("../config/config");
var response = require("../responsehandler/response");

const createToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, config.secret, {
    expiresIn: config.tokenLife, // 86400 expires in 24 hours
  });
};

//Simple version, without validation or sanitation
exports.test = (req, res) => {
  res.send(response.sendresponse("Welcome to user controller", null));
};

//Create a new user
exports.userCreate = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      res.send(response.sendresponse(err, null));
      return;
    }

    if (user) {
      res.send(response.sendresponse("The user already exists.", null));
      return;
    }

    var user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      refreshtoken: null,
    });

    user.save(function (err, result) {
      if (err) {
        res.send(response.sendresponse(err, null));
        return;
      } else {
        res.send(response.sendresponse("User created successfully", result));
      }
    });
  });
};

exports.userLogin = (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.send(
      response.sendresponse("Please send the username and passowrd", null)
    );
  }
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      res.send(response.sendresponse(err, null));
      return;
    }

    if (!user) {
      res.send(response.sendresponse("The user does not exist", null));
      return;
    }
    var token = createToken(user);
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (isMatch && !err) {
        res.send(
          response.sendloginresponse("User information fetched", user, token)
        );
        var userObject = user;
        User.findByIdAndUpdate(user.id, { $set: userObject }, (err, user) => {
          if (err) {
          }
        });
      } else {
        res.send(response.sendresponse("The email and password do not match"));
      }
    });
  });
};

exports.searchUsers = (req, res) => {
  User.find().exec((err, users) => {
    if (err) {
      res.send(response.sendresponse(err, null));
      return;
    } else {
      User.count().exec((err, count) => {
        if (err) {
          res.send(response.sendresponse(err, null));
          return;
        } else {
          let searchString = req.query.search;
          if (searchString === "") {
            User.find().exec((err, users) => {
              if (err) {
                res.send(response.sendresponse(err, null));
                return;
              } else {
                User.count().exec((err, count) => {
                  if (err) {
                    res.send(response.sendresponse(err, null));
                    return;
                  } else {
                    res.send(response.sendresponse(err, users));
                  }
                });
              }
            });
          } else {
            User.find({
              name: { $regex: ".*" + `${searchString}` + ".*", $options: "i" },
            }).exec((err, result) => {
              if (err) {
                res.send(response.sendresponse(err, null));
                return;
              }
              res.send(response.sendresponse(err, result));
            });
          }
        }
      });
    }
  });
};
