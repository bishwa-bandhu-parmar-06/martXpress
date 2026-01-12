import userModel from "../models/usersModel.js";

// controller to get users profile
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const usersData = await userModel.findById(id).populate("addresses");

    res.status(200).json({
      message: "User profile fetched successfully",
      user: usersData,
    });
  } catch (error) {
    console.error("Error While fetching the users data : ", error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

// ----------------- UPDATE USER DETAILS -----------------
export const updateUsersDetails = async (req, res) => {
  try {
    const { id } = req.user;
    const { name, email, mobile } = req.body;

    const updatedUser = await userModel
      .findByIdAndUpdate(
        id,
        {
          ...(name && { name }),
          ...(email && { email }),
          ...(mobile && { mobile }),
        },
        { new: true }
      )
      .populate("addresses");

    // 🔹 Cache invalidate/update
    const cacheKey = `user:${id}`;
    await deleteCache(cacheKey);
    await setCache(cacheKey, updatedUser, 3600);

    res.status(200).json({
      message: "User details updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: error.message });
  }
};
