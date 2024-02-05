const mongoose = require("mongoose");
// const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      maxLength: 30,
      minLength: 4,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // validate: validator.isEmail,
    },
    pass: {
      type: String,
      // default: null,
      required:true
    }
  },
  {
    versionKey: false,
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = {UserModel};