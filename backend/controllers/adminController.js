import User from "../models/User.js";
import Job from "../models/Job.js";

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -__v")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: users.length,
      users,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ message: "Server error while fetching users" });
  }
};

/**
 * @desc    Delete a user by ID (Admin only)
 * @route   DELETE /api/admin/users/:userId
 * @access  Private/Admin
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({ message: "Error deleting user" });
  }
};

/**
 * @desc    Get all jobs (Admin only)
 * @route   GET /api/admin/jobs
 * @access  Private/Admin
 */
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    return res.status(200).json({
      count: jobs.length,
      jobs,
    });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    return res.status(500).json({ message: "Error fetching jobs" });
  }
};

/**
 * @desc    Delete a job by ID (Admin only)
 * @route   DELETE /api/admin/jobs/:jobId
 * @access  Private/Admin
 */
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.deleteOne();
    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("Error deleting job:", err);
    return res.status(500).json({ message: "Error deleting job" });
  }
};
