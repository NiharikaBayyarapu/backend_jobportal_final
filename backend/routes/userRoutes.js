import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import { getUserApplications } from "../controllers/jobController.js";

const userrouter = express.Router();

// Task 33: View all jobs a specific user has applied to
userrouter.get(
  "/:id/applications",
  protect,
  authorizeRoles("jobseeker", "admin", "recruiter" ),
  getUserApplications
);

export default userrouter;
