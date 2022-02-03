const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const verify = require("../middleware/verify");
const { auth, moveFile } = require("../middleware/drive");

//UPDATE
router.put("/", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }

      try {
        const updatedUser = await User.findByIdAndUpdate(
          req.user._id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedUser);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("Access Denied");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      try {
        await Post.deleteMany({ userId: user._id });
        const picId = user.profilePic;
        await moveFile(picId, auth);
        await user.delete();
        res.status(200).json("User has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("Access Denied");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER
router.get("/", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
