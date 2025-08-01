const sellerModel = require("../models/sellers.model");
const bcrypt = require("bcrypt");

const getSellersProfile = async (req, res) => {
  try {
    const sellers = await sellerModel.findById(req.userId);
    if (!sellers) {
      return res
        .status(200)
        .json({ status: 500, success: false, message: "Sellers not found" });
    }
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Fetched Successful.",
      sellers: sellers,
    });
  } catch (error) {
    console.log("While getting Sellers Profile : ", error);
    res
      .status(200)
      .json({ status: 500, success: false, message: "Internal Server Error." });
  }
};

const updateSellersDetails = async (req, res) => {
  try {
    const sellersId = req.userId;
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

    const updatedSeller = await sellerModel
      .findByIdAndUpdate(sellersId, { $set: updatedData }, { new: true })
      .select("-password -confirmPassword");

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Seller details updated successfully.",
      sellers: updatedSeller,
    });
  } catch (error) {
    console.log("Error while updating Sellers Details : ", error);
    res
      .status(200)
      .json({ status: 500, success: false, message: "Internal Server Error" });
  }
};
module.exports = { getSellersProfile, updateSellersDetails };
