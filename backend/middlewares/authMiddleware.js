import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect Middleware - Verify Token & Attach User
export const protect = async (req, res, next) => {
  let token;

  // Token format: "Bearer <token>"
  if (req.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "No token, not authorized" });
  }
  console.log("Token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user details except password
    const user = await User.findOne({ email: decoded.email }).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user; // ✅ Full user object with role, name, email
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token failed or expired" });
  }
};

// ✅ Role-specific Middlewares (can still use authorizeRoles)
export const adminOnly = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }
  return res.status(403).json({ success: false, message: "Access denied: Admins only" });
};

export const recruiterOnly = (req, res, next) => {
  if (req.user?.role === "recruiter") {
    return next();
  }
  return res.status(403).json({ success: false, message: "Access denied: Recruiters only" });
};

export const jobseekerOnly = (req, res, next) => {
  if (req.user?.role === "jobseeker") {
    return next();
  }
  return res.status(403).json({ success: false, message: "Access denied: Jobseekers only" });
};
