const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  email: {
    type: String,
    required: true,
    max: 100,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true, max: 100, unique: true },
});

UserSchema.pre("save", function (next) {
  var user = this;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// Export the model
module.exports = mongoose.model("User", UserSchema);
