// backend/controllers/applicationController.js
import mongoose from "mongoose";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

// Create application with GridFS resume
export const createApplication = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?._id || req.user?.id;
    const { jobId, coverLetter } = req.body;

    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!jobId)
      return res
        .status(400)
        .json({ success: false, message: "jobId is required" });

    const job = await Job.findById(jobId);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    // Build application payload
    const payload = {
      job: job._id,
      user: new mongoose.Types.ObjectId(userId), // ✅ consistent with model
      coverLetter: coverLetter || "",
    };

    if (req.file) {
      payload.resumeFilename = req.file.filename;
      payload.resumeContentType = req.file.mimetype;
      payload.resumeFileId = req.file.id || req.file.fileId || req.file._id;
      payload.resume = { data: req.file.buffer };
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Resume file is required" });
    }

    const application = await Application.create(payload);
    return res.status(201).json({ success: true, application });
  } catch (err) {
    console.error("createApplication error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get logged-in user's applications
export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const applications = await Application.find({ user: userId }) // ✅ use user
      .populate("job", "title company salary location");

    res.json({ success: true, applications });
  } catch (err) {
    console.error("getMyApplications error:", err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching applications" });
  }
};

// Stream resume from GridFS
export const downloadResume = async (req, res) => {
  try {
    const { id } = req.params; // application id
    const app = await Application.findById(id);
    if (!app || !app.resumeFileId) {
      return res
        .status(404)
        .json({ success: false, message: "Resume not found" });
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "resumes",
    });

    res.set(
      "Content-Type",
      app.resumeContentType || "application/octet-stream"
    );
    res.set(
      "Content-Disposition",
      `attachment; filename="${app.resumeFilename || "resume"}"`
    );

    const downloadStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(app.resumeFileId)
    );
    downloadStream.on("error", () =>
      res.status(500).json({ success: false, message: "Error reading file" })
    );
    downloadStream.pipe(res);
  } catch (err) {
    console.error("downloadResume error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Recruiter/Admin: get applications for a job
export const getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });


    const user = await User.findById(req.user._id);

    if (job.postedBy.toString() !== user.email.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "You do not own this job" });
    }

    // if (req.user.role === "recruiter" && String(job.postedBy) !== String(req.user._id)) {
    //   return res.status(403).json({ success: false, message: "You do not own this job" });
    // }

    const applications = await Application.find({ job: jobId })
      .populate("user", "name email") // ✅ use user
      .populate("job", "title location company");

    res.json({ success: true, count: applications.length, applications });
  } catch (err) {
    console.log("getApplicationsForJob error:", err);
    res.status(500).json({ success: false, message: err });
  }
};

// Admin: get all applications
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("user", "name email role") // ✅ use user
      .populate("job", "title location company");

    res.json({ success: true, count: applications.length, applications });
  } catch (err) {
    console.log("getAllApplications error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error fetching applications" });
  }
};

// Recruiter/Admin: update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;


    if (!["accepted", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const application = await Application.findById(id).populate(
      "job",
      "postedBy title"
    );
    if (!application)
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    
    const user = await User.findById(req.user._id);

    if (
      req.user.role === "recruiter" &&
      String(application.job.postedBy) !== String(user.email)
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    application.status = status;
    await application.save();

    res.json({
      success: true,
      message: `Application ${application.status}`,
      application,
    });
  } catch (err) {
    console.error("updateApplicationStatus error:", err);
    res.status(500).json({ success: false, message: "Error updating status" });
  }
};
