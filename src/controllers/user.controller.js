import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// function to generate access token and refresh token
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    // Finding the user in the database by 'userId'
    const user = await User.findOne(userId);

    // Generate an access token using a method defined in the User model
    const accessToken = user.generateAccessToken();

    // Generate a refresh token using a method defined in the User model
    const refreshToken = user.generateRefreshToken();
    console.log("refreshToken:", refreshToken);

    // Assign the generated refresh token to the user's 'refreshToken' field
    user.refreshToken = refreshToken;

    // Save the updated user object to the database,(validateBeforeSave: false) without running validation checks before saving
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating Access and Refresh token"
    );
  }
};

// asyncHandler is the helper function we created in the utils
const registerUser = asyncHandler(async (req, res) => {
  // 1: get user details from frontend
  // 2: validation - not empty
  // 3: check if user already exists using username and email
  // 4: check for images, check for avatar
  // 5: upload them to cloudinary, avatar
  // 6: create user object - create entry in db
  // 7: remove password and refresh token field from response
  // 8: check for user creation
  // 9: return response

  // 1: get user details from frontend
  const { username, email, fullName, password } = req.body;
  // 2: validation - not empty
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // 3: check if user already exists using username and email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // 4: check for images, check for avatar
  // "files" is from from multer
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // 5: upload them to cloudinary, avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  // 6: create user object - create entry in db
  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  // 7: remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // 8: check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  // 9: return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // 1: get login details from client
  // 2: check using username or email
  // 3: find the user
  // 4: do the password check
  // 5: if password matched generate access token and refresh token
  // 6: send cookies

  // 1: get login details from client
  const { email, username, password } = req.body;
  console.log(email);
  // 2: check using username or email
  if (!(username || email)) {
    throw new ApiError(400, "username or email required");
  }

  // 3: find the user
  const user = await User.findOne({
    // '$or' is used to perform a logical OR operation on an array of one or more
    // expressions and selects the documents that satisfy at least one of the expressions
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 'User' is the mongo schema whereas,
  // 'user' is the user that we get from db after findOne()
  // 'isPasswordCorrect()' is the method we created in the 'User' schema
  // 'password' is from client
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // 5: if password matched generate access token and refresh token
  console.log(user._id);
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // 6: send cookies
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // cookie options
  const options = {
    httpOnly: true, // Cookie accessible only by the web server, not by client-side
    secure: true, // Cookie sent only over HTTPS
  };

  // returning response to the user as a cookie
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      // 'ApiResponse' is defined in 'src/utils'
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // Update the user document by setting the refreshToken to undefined
  //  we have access to 'req.user' coz we have used a custom middleware 'auth.middleware.js'
  // in our 'logout' route
  await User.findByIdAndUpdate(req.user._id, {
    // the $set operator is used to update the value of a field in a mongo document
    $set: {
      refreshToken: undefined,
    },
  });

  const options = {
    httpOnly: true, // Cookie accessible only by the web server, not by client-side
    secure: true, // Cookie sent only over HTTPS
  };

  // Clear the accessToken and refreshToken cookies and send a response
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged-out successfully"));
});
export { registerUser, loginUser, logoutUser };
