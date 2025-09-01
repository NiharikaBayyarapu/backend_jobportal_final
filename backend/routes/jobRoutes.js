import express from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyToJob,
  getJobApplicants,
} from '../controllers/jobController.js';

import { protect } from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/roleMiddleware.js';

const jobrouter = express.Router();

// -------------------- PUBLIC ROUTES -------------------- //
jobrouter.get('/', getJobs);                // Get all jobs
jobrouter.get('/:id', getJobById);          // Get job by ID

// -------------------- JOBSEEKER / ADMIN -------------------- //
jobrouter.post(
  '/:id/apply',
  protect,
  authorizeRoles('jobseeker', 'admin'),
  applyToJob
);

// -------------------- RECRUITER / ADMIN -------------------- //
jobrouter.get(
  '/:id/applicants',
  protect,
  authorizeRoles('recruiter', 'admin'),
  getJobApplicants
);

jobrouter.post(
  '/',
  protect,
  authorizeRoles('recruiter', 'admin'),
  createJob
);

jobrouter.put(
  '/:id',
  protect,
  authorizeRoles('recruiter', 'admin'),
  updateJob
);

jobrouter.delete(
  '/:id',
  protect,
  authorizeRoles('recruiter', 'admin'),
  deleteJob
);

export default jobrouter;
