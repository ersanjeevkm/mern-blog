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
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfPfW_5lziQSBfJY73Tbp2dFfG1MhxzELpdw&usqp=CAU",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
