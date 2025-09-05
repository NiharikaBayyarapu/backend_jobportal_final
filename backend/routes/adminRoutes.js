import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { 
  getAllUsers, 
  deleteUser, 
  getAllJobs, 
  deleteJob,
  getAllApplications,
} from "../controllers/adminController.js";

const adminrouter = express.Router();

// ✅ Admin - Manage Users
adminrouter.get("/users", protect, adminOnly, getAllUsers);
adminrouter.delete("/users/:userId", protect, adminOnly, deleteUser);

// ✅ Admin - Manage Jobs
adminrouter.get("/jobs", protect, adminOnly, getAllJobs);
adminrouter.delete("/jobs/:jobId", protect, adminOnly, deleteJob);

// ✅ Admin - Manage Applications
adminrouter.get("/applications", protect, adminOnly, getAllApplications);

export default adminrouter;
