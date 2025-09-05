import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import dotenv from "dotenv";

dotenv.config();

// ✅ Configure storage for GridFS
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return {
      bucketName: "resumes", // collection in MongoDB
      filename: `${Date.now()}-${file.originalname}`, // ✅ backticks fixed
    };
  },
});

const upload = multer({ storage });

// ✅ Controller
export const uploadResume = [
  upload.single("resume"), // expects field name "resume"
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.json({
      message: "Resume uploaded successfully",
      fileId: req.file.id,
      filename: req.file.filename,
    }); // ✅ properly closed
  },
];
