
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let gridfsBucket;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully"); 

    // create GridFS bucket after connection
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.connection.db, {
      bucketName: "resumes",
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export { gridfsBucket };
export default connectDB;
