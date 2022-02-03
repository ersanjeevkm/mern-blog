const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multerUpload = require("./middleware/multer");
const { createAndUploadFile, auth } = require("./middleware/drive");
const verify = require("./middleware/verify");

dotenv.config();
app.use(express.json());

mongoose
  .connect(process.env.DB_CONNECT)
  .then(console.log("Connected to DB"))
  .catch((err) => console.log(err));

app.post(
  "/api/upload",
  verify,
  multerUpload().single("file"),
  async (req, res) => {
    await createAndUploadFile(req, auth);
    console.log("File uploaded to drive. File Id >>> " + req.fileId);
    res.status(200).json({ fileId: req.fileId });
  }
);

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/category", categoryRoute);

app.listen("3000", () => {
  console.log("API server is running");
});
