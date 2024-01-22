import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";

dotenv.config({ path: "./env" });

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected :) DB HOST: ${connectionInstance.connections[0].host}`
    );
  } catch (error) {
    console.error("ERROR: Mongo Db not connected :( ", error);
    process.exit(1);
  }
};

export default connectDB;
