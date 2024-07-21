import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// our custom made middleware used to check user logged in

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Attempt to retrieve the token from 'cookies' or 'Authorization header'
    // checking 'Authorization' because we may be using the mobile device where cookies
    // aren't used
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Verify the token using the secret key in '.env' and jwt in the 'User' model
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find the user associated with the decoded token's ID and exclude sensitive fields
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    // Attach the user to the request object for use in subsequent middleware/routes
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
