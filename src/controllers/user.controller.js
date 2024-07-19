import { asyncHandler } from "../utils/asyncHandler.js";

// asyncHandler is the helper function we created in the utils
const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "ok" });
});


export {registerUser}