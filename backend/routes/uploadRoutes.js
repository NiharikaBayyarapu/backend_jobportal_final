// routes/uploadRoutes.js
import express from "express";
import upload from "../middlewares/upload.js";  // use only your middleware

const uploadrouter = express.Router();

// Example route
uploadrouter.post("/", upload.single("file"), (req, res) => {
  res.json({
    message: "File uploaded successfully",
    file: req.file,
  });
});

export default uploadrouter;
