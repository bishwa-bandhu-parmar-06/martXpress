import sellerModel from "../models/sellersModel.js";

// ----------------- GET SELLER PROFILE -----------------
export const getSellerProfile = async (req, res) => {
  try {
    const { id } = req.user;
    
    // 🔹 2. DB se fetch
    const sellersData = await sellerModel.findById(id).populate("addresses");

    if (!sellersData) {
      return res.status(404).json({
        status: 404,
        message: "Seller not found",
      });
    }

    // Approval check
    if (sellersData.verified === "pending") {
      return res.status(200).json({
        status: 403,
        message: "Your profile is under review by admin. Please wait.",
      });
    }

    if (sellersData.verified === "rejected") {
      return res.status(200).json({
        status: 403,
        message: "Your profile has been rejected. Please contact support.",
      });
    }

    // Only approved sellers get full profile
    if (sellersData.verified === "approved") {
      
      return res.status(200).json({
        status: 200,
        message: "Seller profile fetched successfully",
        seller: sellersData,
      });
    }
  } catch (error) {
    console.error("Error While fetching the Sellers data : ", error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

// ----------------- UPDATE SELLER DETAILS -----------------
export const updateSellerDetails = async (req, res) => {
  try {
    const { id } = req.user;

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

    // ✅ File uploads optional
    if (req.files?.gstCertificate?.[0]) {
      updateData.gstCertificate = req.files.gstCertificate[0].path;
    }
    if (req.files?.udyamCertificate?.[0]) {
      updateData.udyamCertificate = req.files.udyamCertificate[0].path;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No fields provided for update",
      });
    }

    const updatedSeller = await sellerModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate("addresses");

    if (!updatedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json({
      message: "Seller details updated successfully",
      seller: updatedSeller,
    });
  } catch (error) {
    console.error("Error updating seller:", error);
    res.status(500).json({ message: error.message });
  }
};
