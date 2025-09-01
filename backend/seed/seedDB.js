import dotenv from 'dotenv';
import mongoose from 'mongoose'
import User from './models/User.js';
import Job from './models/Job.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await User.deleteMany();
    await Job.deleteMany();

    await User.insertMany(users);
    await Job.insertMany(jobs);

    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error('Error with data import:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Job.deleteMany();

    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error('Error with data destroy:', error);
    process.exit(1);
  }
};

const run = async () => {
  await connectDB();

  if (process.argv[2] === '-d') {
    await destroyData();
  } else {
    await importData();
  }
};

run();
