const userModel = require("../models/users.model");
const bcrypt = require("bcrypt");
const getUsersProfile = async (req, res) => {
  try {
    // console.log("req.userId : ", req.userId)
    const user = await userModel.findById(req.userId);
    // console.log("Users : ", user)
    if (!user) {
      return res
        .status(200)
        .json({ status: 400, success: false, message: "User not found" });
    }
    res.status(200).json({
      status: 200,
      success: true,
      message: "Fetched Successfully",
      users: user,
    });
  } catch (error) {
    console.log("Error While Getting Users Profile : ", error);
    return res.status(200).json({
      status: 500,
      success: false,
      message: "Internal Server Error from GetingUsersProfile",
    });
  }
};


const updateUsersDetails = async (req, res) => {
  try {
    const usersId = req.userId;

    const {
      name,
      email,
      password,
      confirmPassword,
      mobile,
      address: { street, city, district, state, country, pincode } = {},
    } = req.body;

    const profileImage = req.file?.path; 
    if (password && password !== confirmPassword) {
      return res.status(200).json({
        status: 400,
        success: false,
        message: "Password and Confirm Password do not match.",
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

    const updatedUser = await userModel.findByIdAndUpdate(
      usersId,
      { $set: updatedData },
      { new: true }
    ).select("-password -confirmPassword");

    return res.status(200).json({
      status: 200,
      success: true,
      message: "User details updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error While Updating Users Details : ", error);
    return res.status(200).json({
      status: 500,
      success: false,
      message: "Internal Server Error.",
    });
  }
};



module.exports = { getUsersProfile, updateUsersDetails };
