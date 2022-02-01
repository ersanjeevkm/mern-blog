const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const verify = require("../middleware/verify");
const { auth, moveFile } = require("../middleware/drive");

//CREATE
router.post("/", verify, async (req, res) => {
  const postData = { ...req.body, userId: req.user._id };
  const newPost = new Post(postData);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verify, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      if (post.userId.toString() === req.user._id) {
        try {
          const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {
              $set: req.body,
            },
            { new: true }
          );
          res.status(200).json(updatedPost);
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        res.status(401).json("Access Denied!");
      }
    } else {
      res.status(404).json("Post not found!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verify, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      if (post.userId.toString() === req.user._id) {
        try {
          const picId = post.photo;
          await moveFile(picId, auth);
          await post.delete();
          res.status(200).json("Post has been deleted!");
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        res.status(401).json("Access Denied!");
      }
    } else {
      res.status(404).json("Post not found!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "userId",
      "username _id"
    );
    res.status(200).json(post._doc);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL POST
router.get("/", async (req, res) => {
  const userName = req.query.user;
  const catName = req.query.cat;

  try {
    let posts;
    if (userName) {
      const user = await User.findOne({ username: userName });
      posts = await Post.find({ userId: user._id });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
