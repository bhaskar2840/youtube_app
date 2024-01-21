import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({ path: "./env" });

connectDB();

//! we made this file in db index so to our entry file more clear
// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
//   } catch (error) {
//     console.error("ERROR: ", error);
//     throw error;
//   }
// })();
//todo ifi function that gets executed const call = function(){};  call(); shorthand
