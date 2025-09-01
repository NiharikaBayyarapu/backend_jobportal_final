import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    type: {
      type: String,
      enum: ["full-time", "part-time", "remote", "contract", "internship"],
      required: true,
    },
    experience: { type: Number, required: true }, // యూజర్ అవసరమైతే చేర్చండి
    postedBy: {
      type: String,
      ref: "User",
      required: true,
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);
export default Job;
