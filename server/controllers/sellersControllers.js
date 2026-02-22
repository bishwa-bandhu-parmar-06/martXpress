import sellerModel from "../models/sellersModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {CustomError} from "../utils/customError.js";

// ----------------- GET SELLER PROFILE -----------------
export const getSellerProfile = asyncHandler(async (req, res) => {
  // Use sub (JWT standard) or fallback to id
  const sellerId = req.user.sub || req.user.id;

  // Fetch from DB
  const sellersData = await sellerModel
    .findById(sellerId)
    .populate("addresses");

  if (!sellersData) {
    throw new CustomError("Seller not found", 404);
  }

  if (sellersData.verified === "pending") {
    return res.status(200).json({
      status: 403,
      message: "Your profile is under review by admin. Please wait.",
      seller: sellersData,
    });
  }

  if (sellersData.verified === "rejected") {
    return res.status(200).json({
      status: 403,
      message: "Your profile has been rejected. Please contact support.",
      seller: sellersData,
    });
  }

  // Only approved sellers get here
  res.status(200).json({
    status: 200,
    message: "Seller profile fetched successfully",
    seller: sellersData,
  });
});

// ----------------- UPDATE SELLER DETAILS -----------------
export const updateSellerDetails = asyncHandler(async (req, res) => {
  const sellerId = req.user.sub || req.user.id;
  const body = req.body || {};

  const updateData = {
    ...(body.name && { name: body.name }),
    ...(body.email && { email: body.email }),
    ...(body.mobile && { mobile: body.mobile }),
    ...(body.shopName && { shopName: body.shopName }),
    ...(body.gstNumber && { gstNumber: body.gstNumber }),
    ...(body.udyamNumber && { udyamNumber: body.udyamNumber }),
    ...(body.panNumber && { panNumber: body.panNumber }),
  };

  // File uploads handling
  if (req.files?.gstCertificate?.[0]) {
    updateData.gstCertificate = {
      fileName:
        req.files.gstCertificate[0].originalname ||
        req.files.gstCertificate[0].filename,
      path: req.files.gstCertificate[0].path,
      uploadedAt: new Date(),
    };
  }

  if (req.files?.udyamCertificate?.[0]) {
    updateData.udyamCertificate = req.files.udyamCertificate[0].path;
  }

  if (Object.keys(updateData).length === 0) {
    throw new CustomError("No fields provided for update", 400);
  }

  const updatedSeller = await sellerModel
    .findByIdAndUpdate(sellerId, updateData, { new: true, runValidators: true })
    .populate("addresses");

  if (!updatedSeller) {
    throw new CustomError("Seller not found", 404);
  }

  res.status(200).json({
    status: 200,
    message: "Seller details updated successfully",
    seller: updatedSeller,
  });
});
