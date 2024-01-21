import express from "express";
// import cookieParser from "cookie-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use(express.json({ limit: "16kb" })); // used for form data
app.use(express.urlencoded({ limit: "16kb" })); // used for url reading and data from url {extended:true} used to nest object.
app.use(express.static("public")); // use to access static files in public folder
app.use(cookieParser());
export { app };
