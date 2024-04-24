import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
//this middleware is used to check whether user is present or not
//checks whether user is present or not
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    //in case of mobile application developement we have header not cookies Authorization: Bearer <token>
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ","");

    if (!token) {
      throw new ApiError(401, "Unauthorized request!!!");
    }

    //while generating acess token i have given _id, email and many more as payload so we need them so we need the decoded token first
    //decoded token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      //todo: discuss about frontend
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
