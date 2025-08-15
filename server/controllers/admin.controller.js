const adminModel = require("../models/admin.model");
const bcrypt = require("bcrypt");
const sellerModel = require("../models/sellers.model");

const getAdminProfile = async (req, res) => {
  try {
    const admin = await adminModel.findById(req.userId);
    if (!admin) {
      return res
        .status(200)
        .json({ status: 500, success: false, message: "Admin not found" });
    }
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Fetched Successful.",
      admin: admin,
    });
  } catch (error) {
    console.log("While getting Admin Profile : ", error);
    res
      .status(200)
      .json({ status: 500, success: false, message: "Internal Server Error." });
  }
};

const updateAdminDetails = async (req, res) => {
  try {
    const adminId = req.userId;
    const {
      name,
      email,
      mobile,
      password,
      confirmPassword,
      address: { street, city, district, state, country, pincode } = {},
    } = req.body;

    const profileImage = req.file?.path;
    if (password !== confirmPassword) {
      return res.status(200).json({
        status: 500,
        success: false,
        message: "password and confirmPassword does not matched.",
      });
    }

    const updatedData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(mobile && { mobile }),
      ...(profileImage && { profileImage }),
      ...(street || city || district || state || country || pincode
        ? {
            address: {
              ...(street && { street }),
              ...(city && { city }),
              ...(district && { district }),
              ...(state && { state }),
              ...(country && { country }),
              ...(pincode && { pincode }),
            },
          }
        : {}),
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
      updatedData.confirmPassword = hashedPassword;
    }

    const updatedAdmin = await adminModel
      .findByIdAndUpdate(adminId, { $set: updatedData }, { new: true })
      .select("-password -confirmPassword");

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Admin details updated successfully.",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.log("Error while updating Admin Details : ", error);
    res
      .status(200)
      .json({ status: 500, success: false, message: "Internal Server Error" });
  }
};

// approve seller account
const approveSeller = async (req, res) => {
  const { sellerId } = req.body;
  const seller = await sellerModel.findById(sellerId);

  if (!seller) {
    return res.status(200).json({ status: 404, message: "Seller not found." });
  }

  seller.status = "Approved";
  await seller.save();

  res
    .status(200)
    .json({ status: 200, message: "Seller approved successfully." });
};
module.exports = { getAdminProfile, updateAdminDetails, approveSeller };
