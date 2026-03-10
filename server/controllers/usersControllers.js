import userModel from "../models/usersModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { clearCachePattern } from "../middleware/redisMiddleware.js";
import { CustomError } from "../utils/customError.js";

import bcrypt from "bcryptjs";

export const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.sub || req.user.id;
  const usersData = await userModel.findById(userId).populate("addresses");

  if (!usersData) throw new CustomError("User not found", 404);

  res.status(200).json({
    message: "User profile fetched successfully",
    user: usersData,
  });
});

export const updateUsersDetails = asyncHandler(async (req, res) => {
  const userId = req.user.sub || req.user.id;
  const { name, email, mobile } = req.body;

  const updatedUser = await userModel
    .findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(mobile && { mobile }),
      },
      { new: true, runValidators: true },
    )
    .populate("addresses");

  if (!updatedUser) throw new CustomError("User not found", 404);
await clearCachePattern("/user-profile");
  res.status(200).json({
    message: "User details updated successfully",
    user: updatedUser,
  });
});

export const changeUserPassword = asyncHandler(async (req, res) => {
  const userId = req.user.sub || req.user.id;
  const { currentPassword, newPassword } = req.body;
  const user = await userModel.findById(userId).select("+password");

  if (!user) throw new CustomError("User not found", 404);

  if (user.authProvider === "google") {
    throw new CustomError(
      "Password change is not applicable for accounts created via Google.",
      400,
    );
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new CustomError("Incorrect current password", 401);

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    message: "Password updated successfully",
  });
});

export const deleteUserAccount = asyncHandler(async (req, res) => {
  const userId = req.user.sub || req.user.id;

  const user = await userModel.findById(userId);
  if (!user) throw new CustomError("User not found", 404);

  await userModel.findByIdAndDelete(userId);

  res.clearCookie("token");
await clearCachePattern("/user-profile");
  res.status(200).json({
    message: "Account deleted successfully",
  });
});
