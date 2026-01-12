import adminModel from "../models/adminModel.js";
import sellerModel from "../models/sellersModel.js";
import userModel from "../models/usersModel.js";
import productModel from "../models/productModel.js";
import bcrypt from "bcryptjs";

/* ---------------------------- GET ADMIN PROFILE ---------------------------- */
export const getAdminProfile = async (req, res) => {
  try {
    const { id } = req.user;


    const admin = await adminModel.findById(id).populate("addresses");
    if (!admin) {
      return res.status(404).json({ status: 404, message: "Admin not found" });
    }

    
    res.status(200).json({
      status: 200,
      message: "Admin profile fetched successfully",
      admin,
    });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({ status: 500, message: error.message });
  }
};

/* -------------------------- UPDATE ADMIN DETAILS --------------------------- */
export const updateAdminDetails = async (req, res) => {
  try {
    const { id } = req.user;
    const body = req.body || {};

    const updateData = {
      ...(body.name && { name: body.name }),
      ...(body.email && { email: body.email }),
      ...(body.mobile && { mobile: body.mobile }),
    };

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ status: 400, message: "No fields provided for update" });
    }

    const updatedAdmin = await adminModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate("addresses");

    if (!updatedAdmin) {
      return res.status(404).json({ status: 404, message: "Admin not found" });
    }

    res.status(200).json({
      status: 200,
      message: "Admin details updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ status: 500, message: error.message });
  }
};

/* ---------------------------- CHANGE PASSWORD ------------------------------ */
export const changeAdminPassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { oldPassword, newPassword } = req.body;

    const admin = await adminModel.findById(id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    admin.password = hashed;
    await admin.save();

    res
      .status(200)
      .json({ status: 200, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ status: 500, message: error.message });
  }
};

/* ------------------------ SELLER MANAGEMENT (CRUD) ------------------------ */
export const getApprovedSellers = async (_, res) => {
  try {
    const sellers = await sellerModel.find({ verified: "approved" });
    res.status(200).json({
      status: 200,
      message: "Approved sellers fetched successfully.",
      count: sellers.length,
      sellers,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

export const getRejectedSellers = async (_, res) => {
  try {
    const sellers = await sellerModel.find({ verified: "rejected" });
    res.status(200).json({
      status: 200,
      message: "Rejected sellers fetched successfully.",
      count: sellers.length,
      sellers,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

export const getPendingSellers = async (_, res) => {
  try {
    const sellers = await sellerModel.find({ verified: "pending" });
    res.status(200).json({
      status: 200,
      message: "Pending sellers fetched successfully.",
      count: sellers.length,
      sellers,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

export const getSellerById = async (req, res) => {
  try {
    const seller = await sellerModel.findById(req.params.id);
    if (!seller)
      return res.status(404).json({ status: 404, message: "Seller not found" });

    res.status(200).json({
      status: 200,
      message: "Seller fetched successfully",
      seller,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

export const approveSeller = async (req, res) => {
  try {
    const seller = await sellerModel.findByIdAndUpdate(
      req.params.id,
      { verified: "approved" },
      { new: true }
    );
    if (!seller)
      return res.status(404).json({ status: 404, message: "Seller not found" });

    res.status(200).json({
      status: 200,
      message: "Seller approved successfully",
      seller,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

export const rejectSeller = async (req, res) => {
  try {
    const seller = await sellerModel.findByIdAndUpdate(
      req.params.id,
      { verified: "rejected" },
      { new: true }
    );
    if (!seller)
      return res.status(404).json({ status: 404, message: "Seller not found" });

    res.status(200).json({
      status: 200,
      message: "Seller rejected successfully",
      seller,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

export const deleteSeller = async (req, res) => {
  try {
    const deleted = await sellerModel.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ status: 404, message: "Seller not found" });

    res.status(200).json({
      status: 200,
      message: "Seller deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

/* -------------------------- USER MANAGEMENT (VIEW) -------------------------- */
export const getAllUsers = async (_, res) => {
  try {
    const users = await userModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: 200,
      message: "All users fetched successfully",
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deleted = await userModel.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ status: 404, message: "User not found" });

    res.status(200).json({
      status: 200,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

/* -------------------------- PRODUCT MANAGEMENT -------------------------- */
export const getAllProducts = async (_, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deleted = await productModel.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ status: 404, message: "Product not found" });

    res.status(200).json({
      status: 200,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

/* -------------------------- DASHBOARD STATS -------------------------- */
export const getDashboardStats = async (_, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};
