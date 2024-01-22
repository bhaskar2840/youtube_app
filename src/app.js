import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use(express.json({ limit: "16kb" })); // used for form data
app.use(express.urlencoded({ limit: "16kb" })); // used for url reading and data from url {extended:true} used to nest object.
app.use(express.static("public")); // use to access static files in public folder
app.use(cookieParser());

//todo importing router

import userRouter from "./routers/user.routes.js";

//routes declaration
//! we will not use app.get() as we are passing route as middleware and not directly.

app.use("api/v1/users", userRouter);
// http://localhost:8000/api/v1/users/register         api/v2/users is standard practise.

export default app;
