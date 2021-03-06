const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPwd = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPwd,
    });

    const user = await newUser.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN AND
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(400).json("Wrong credentials!");
    } else {
      const validated = await bcrypt.compare(req.body.password, user.password);
      if (!validated) {
        res.status(400).json("Wrong credentials!");
      } else {
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
          expiresIn: process.env.TOKEN_EXP,
        });

        const { password, ...others } = user._doc;
        res.setHeader("auth_token", token);
        res.status(200).json(others);
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
