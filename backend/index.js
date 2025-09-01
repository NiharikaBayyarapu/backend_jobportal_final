import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userrouter from './routes/userRoutes.js';
import jobrouter from './routes/jobRoutes.js';
import adminrouter from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();
connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Set allowed origins (from .env or default to localhost:5174)
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(o => o.trim())
  : ['http://localhost:5173'];

// ✅ Define proper CORS options
const corsOptions = {
  orgini: "http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};

// ✅ Apply middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userrouter);
app.use('/api/jobs', jobrouter);
app.use('/api/admin', adminrouter);
app.use('/api/upload', uploadRoutes);

// ✅ Test route
app.get('/', (req, res) => res.send('API running'));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
