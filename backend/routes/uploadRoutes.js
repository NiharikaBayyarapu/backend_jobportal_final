import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";

const router = express.Router();

// Mongo URI
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jobPortal";

// Create connection
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Init gfs
let gfs;
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
});

// Storage engine
const storage = multer.diskStorage({
  destination:"temp/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Upload resume
router.post("/resume", upload.single("resume"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({
    message: "Resume uploaded successfully",
    fileId: req.file.id,
    filename: req.file.filename,
  });
});

//  Get resume by ID
router.get("/files/:id", async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    gfs.openDownloadStream(fileId).pipe(res);
  } catch (err) {
    res.status(404).json({ message: "File not found" });
  }
});

//  List all uploaded files (optional)
router.get("/files", async (req, res) => {
  try {
    const files = await conn.db.collection("uploads.files").find().toArray();
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Error fetching files" });
  }
});

export default router;
