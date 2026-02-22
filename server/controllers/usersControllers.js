import userModel from "../models/usersModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {CustomError} from "../utils/customError.js";

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

  res.status(200).json({
    message: "User details updated successfully",
    user: updatedUser,
  });
});
