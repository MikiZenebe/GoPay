import mongoose from "mongoose";
import env from "../utils/validateEnv";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(env.MONGO_URI);
    console.log(`MongoDB connected: ${connect.connection.host}`);
  } catch (error: any) {
    console.error(`Error connection to mongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
