import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import colors from "colors";

// console.log("MONGO_URI =", process.env.MONGO_URI);
const backendUrl = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${backendUrl}`, {
      maxPoolSize: 200,
      minPoolSize: 20,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 60000,
    });

    console.log(`MongoDB Connected Successfully.`.green.bold);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`.red);
    process.exit(1);
  }
};

export default connectDB;
