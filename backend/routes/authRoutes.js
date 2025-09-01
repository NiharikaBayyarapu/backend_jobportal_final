// backend/routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser, getProfile, logoutUser } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import validateRequest from '../middlewares/validateRequest.js';
import { registerSchema, loginSchema } from '../utils/validationSchema.js';

const router = express.Router();

// Register route with validation
router.post('/register', validateRequest(registerSchema), registerUser);

// Login route with validation
router.post('/login', validateRequest(loginSchema), loginUser);

// Protected profile route
router.get('/profile', protect, getProfile);

// Logout route (optional)
router.post('/logout', protect, logoutUser);

export default router;
