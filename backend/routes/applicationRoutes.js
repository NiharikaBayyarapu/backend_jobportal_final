// backend/routes/applicationRoutes.js
import express from "express";
import multer from "multer";
import {
  protect,
  adminOnly,
  recruiterOnly,
  jobseekerOnly,
} from "../middlewares/authMiddleware.js";
import {
  createApplication,
  getMyApplications,
  downloadResume,
  getApplicationsForJob,
  getAllApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

const router = express.Router();

// ✅ Configure Multer for temporary file storage
const storage = multer.diskStorage({
  destination: "temp/", // save temp files here
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

/**
 * 📌 Application Routes
 */

// Jobseeker: Apply to a job (with resume upload)
router.post(
  "/apply",
  protect,
  jobseekerOnly,
  upload.single("resume"),
  createApplication
);

// Jobseeker: Get logged-in user's applications
router.get("/my", protect, jobseekerOnly, getMyApplications);

// Download resume for a specific application
router.get("/:id/resume", protect, downloadResume);

// Recruiter/Admin: Get applications for a specific job
router.get("/job/:jobId", protect, recruiterOnly, getApplicationsForJob);

// Admin: Get all applications
router.get("/", protect, adminOnly, getAllApplications);

// Recruiter/Admin: Update application status (accept/reject)
router.put("/:id/status", protect, recruiterOnly, updateApplicationStatus);

export default router;
