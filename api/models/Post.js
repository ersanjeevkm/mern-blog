const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
      default: "1iqa2R8sVzjP8qBDEgRBIqHkg_K1HVM3y",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    categories: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
