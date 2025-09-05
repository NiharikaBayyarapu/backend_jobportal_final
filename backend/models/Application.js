// backend/models/Application.js
import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    coverLetter: { type: String },
    resumeFileId: { type: mongoose.Schema.Types.ObjectId }, // GridFS file _id
    resumeFilename: { type: String },
    resumeContentType: { type: String },
    resume: { data: Buffer },
    status: {
      type: String,
      enum: ["applied", "reviewing", "interview", "offer", "rejected"],
      default: "applied",
    },
  },
  { timestamps: true }
);

// ✅ Fix index names & schema reference
ApplicationSchema.index({ user: 1 });
ApplicationSchema.index({ job: 1 });

const Application = mongoose.model("Application", ApplicationSchema);

export default Application;
