var User = require("../models/user");
var config = require("../config/config");
var response = require("../responsehandler/response");
var jwt = require("jsonwebtoken");

//Verify if the user is authorized
exports.verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        return res
          .status(401)
          .json(
            response.sendresponse(false, null, "Unauthorized access", null)
          );
      }
      if (Date.now() / 1000 > decoded.exp) {
        return res
          .status(401)
          .json(response.sendresponse(false, null, "Token has expired.", null));
      }
      req.decoded = decoded;
      console.log("::::::::::::::::::::");
      console.log(decoded);
      console.log(":::::::::::::::::::::");
      next();
    });
  } else {
    // if there is no token
    // return an error
    return res
      .status(403)
      .send(response.sendresponse(false, null, "No token provided.", null));
  }
};
