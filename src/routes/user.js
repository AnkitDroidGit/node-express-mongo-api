var express = require("express");
var router = express.Router();

var userController = require("../controllers/user");
var passport = require("../middleware/passport");

router.get("/test", userController.test);
router.get("/search", passport.verifyToken, userController.searchUsers);
router.post("/register", userController.userCreate);
router.post("/login", userController.userLogin);

module.exports = router;
