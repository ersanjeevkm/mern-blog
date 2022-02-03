const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "1szK_knLR19gKH0uyrkS_l2dim_XaK368",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
