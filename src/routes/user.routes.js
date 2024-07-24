import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);

// route to refresh access token
router.route("/refresh-token").post(refreshAccessToken);

// change password route
router.route("/change-password").post(verifyJWT, changeCurrentPassword);

// get current user
router.route("/current-user").get(verifyJWT, getCurrentUser);

// update details
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

// route for updating the avatar
// 'upload.single' is used to handle a single file upload with a specified field name
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

// route for updating the cover image
router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

// route for getting current username
router.route("/c/:username").get(verifyJWT, getUserChannelProfile);

// route to get watch history for a user
router.route("/history").get(verifyJWT, getWatchHistory);

export default router;
