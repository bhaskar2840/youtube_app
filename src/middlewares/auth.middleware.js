import { ApiError } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// when we use use.cookie-parser() it is like middleware and both req and res has access to all cookie methods.

export const verfiyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", " ");
    // we are saving our token from cookies.
    // if we are working on mobile or some custom req is send we need to provide token Autorization : Bearer <token>

    if (!token) {
      throw new ApiError(401, "Unauthorized Request!");
    }

    //now we need to verify the token and decode the info from token recieved
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user; // added user object in req
    next(); // next is there to tell that the process is complete and move on to the next process.
  } catch (error) {
    throw new ApiError(401, error?.massage || "Invalid access Token");
  }
});
