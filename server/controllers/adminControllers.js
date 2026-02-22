import adminModel from "../models/adminModel.js";
import sellerModel from "../models/sellersModel.js";
import userModel from "../models/usersModel.js";
import productModel from "../models/productModel.js";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CustomError } from "../utils/customError.js";

/* ---------------------------- GET ADMIN PROFILE ---------------------------- */
export const getAdminProfile = asyncHandler(async (req, res) => {
  const userId = req.user.sub || req.user.id;
  const admin = await adminModel.findById(userId).populate("addresses");
  if (!admin) {
    throw new CustomError("Admin not found", 404);
  }
  res.status(200).json({
    status: 200,
    message: "Admin profile fetched successfully",
    admin,
  });
});

/* -------------------------- UPDATE ADMIN DETAILS --------------------------- */
export const updateAdminDetails = asyncHandler(async (req, res) => {
  const userId = req.user.sub || req.user.id;
  const body = req.body || {};

  const updateData = {
    ...(body.name && { name: body.name }),
    ...(body.email && { email: body.email }),
    ...(body.mobile && { mobile: body.mobile }),
  };

  if (Object.keys(updateData).length === 0) {
    throw new CustomError("No fields provided for update", 400);
  }

  const updatedAdmin = await adminModel
    .findByIdAndUpdate(userId, updateData, { new: true })
    .populate("addresses");

  if (!updatedAdmin) {
    throw new CustomError("Admin not found", 404);
  }

  res.status(200).json({
    status: 200,
    message: "Admin details updated successfully",
    admin: updatedAdmin,
  });
});

/* ---------------------------- CHANGE PASSWORD ------------------------------ */
export const changeAdminPassword = asyncHandler(async (req, res) => {
  const userId = req.user.sub || req.user.id;
  const { oldPassword, newPassword } = req.body;

  const admin = await adminModel.findById(userId);
  if (!admin) throw new CustomError("Admin not found", 404);

  const isMatch = await bcrypt.compare(oldPassword, admin.password);
  if (!isMatch) throw new CustomError("Old password is incorrect", 400);

  const hashed = await bcrypt.hash(newPassword, 10);
  admin.password = hashed;
  await admin.save();

  res
    .status(200)
    .json({ status: 200, message: "Password updated successfully" });
});

/* ------------------------ SELLER MANAGEMENT (CRUD) ------------------------ */
export const getApprovedSellers = asyncHandler(async (_, res) => {
  const sellers = await sellerModel.find({ verified: "approved" });
  res.status(200).json({
    status: 200,
    message: "Approved sellers fetched successfully.",
    count: sellers.length,
    sellers,
  });
});

export const getRejectedSellers = asyncHandler(async (_, res) => {
  const sellers = await sellerModel.find({ verified: "rejected" });
  res.status(200).json({
    status: 200,
    message: "Rejected sellers fetched successfully.",
    count: sellers.length,
    sellers,
  });
});

export const getPendingSellers = asyncHandler(async (_, res) => {
  const sellers = await sellerModel.find({ verified: "pending" });
  res.status(200).json({
    status: 200,
    message: "Pending sellers fetched successfully.",
    count: sellers.length,
    sellers,
  });
});

export const getSellerById = asyncHandler(async (req, res) => {
  const seller = await sellerModel.findById(req.params.id);

  if (!seller) throw new CustomError("Seller not found", 404);

  res.status(200).json({
    status: 200,
    message: "Seller fetched successfully",
    seller,
  });
});

export const approveSeller = asyncHandler(async (req, res) => {
  const { sellerid } = req.params;
  const seller = await sellerModel.findByIdAndUpdate(
    sellerid,
    { verified: "approved" },
    { new: true },
  );

  if (!seller) throw new CustomError("Seller not found", 404);

  res.status(200).json({
    status: 200,
    message: "Seller approved successfully",
    seller,
  });
});

export const rejectSeller = asyncHandler(async (req, res) => {
  const { sellerid } = req.params;
  const seller = await sellerModel.findByIdAndUpdate(
    sellerid,
    { verified: "rejected" },
    { new: true },
  );

  if (!seller) throw new CustomError("Seller not found", 404);

  res.status(200).json({
    status: 200,
    message: "Seller rejected successfully",
    seller,
  });
});

export const deleteSeller = asyncHandler(async (req, res) => {
  const { sellerid } = req.params;
  const deleted = await sellerModel.findByIdAndDelete(sellerid);

  if (!deleted) throw new CustomError("Seller not found", 404);

  res.status(200).json({
    status: 200,
    message: "Seller deleted successfully",
  });
});

/* -------------------------- USER MANAGEMENT (VIEW) -------------------------- */
export const getAllUsers = asyncHandler(async (_, res) => {
  const users = await userModel.find().sort({ createdAt: -1 });
  res.status(200).json({
    status: 200,
    message: "All users fetched successfully",
    count: users.length,
    users,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const deleted = await userModel.findByIdAndDelete(req.params.id);

  if (!deleted) throw new CustomError("User not found", 404);

  res.status(200).json({
    status: 200,
    message: "User deleted successfully",
  });
});

/* -------------------------- PRODUCT MANAGEMENT -------------------------- */
export const getAllProducts = asyncHandler(async (_, res) => {
  const products = await productModel
    .find()
    .populate("sellerId", "shopName email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 200,
    message: "All products fetched successfully",
    count: products.length,
    products,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const deleted = await productModel.findByIdAndDelete(req.params.id);

  if (!deleted) throw new CustomError("Product not found", 404);

  res.status(200).json({
    status: 200,
    message: "Product deleted successfully",
  });
});

/* -------------------------- DASHBOARD STATS -------------------------- */
export const getDashboardStats = asyncHandler(async (_, res) => {
  const [totalUsers, totalSellers, totalProducts, approvedSellers] =
    await Promise.all([
      userModel.countDocuments(),
      sellerModel.countDocuments(),
      productModel.countDocuments(),
      sellerModel.countDocuments({ verified: "approved" }),
    ]);

  res.status(200).json({
    status: 200,
    message: "Dashboard stats fetched successfully",
    stats: {
      totalUsers,
      totalSellers,
      totalProducts,
      approvedSellers,
    },
  });
});
