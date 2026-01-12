import userModel from "../models/usersModel.js";
import sellerModel from "../models/sellersModel.js";
import adminModel from "../models/adminModel.js";
import addressModel from "../models/addressModel.js";

// add address controller
export const addAddress = async (req, res) => {
  try {
    const { id, role } = req.user; // token se id aur role dono aayenge
    const {
      fullName,
      mobile,
      house,
      street,
      city,
      district,
      state,
      pincode,
      landmark,
    } = req.body;

    const newAddress = await addressModel.create({
      userId: id,
      role,
      fullName,
      mobile,
      house,
      street,
      city,
      district,
      state,
      pincode,
      landmark,
    });

    // role ke basis pe update
    if (role === "user") {
      await userModel.findByIdAndUpdate(id, {
        $push: { addresses: newAddress._id },
      });
    } else if (role === "seller") {
      await sellerModel.findByIdAndUpdate(id, {
        $push: { addresses: newAddress._id },
      });
    } else if (role === "admin") {
      await adminModel.findByIdAndUpdate(id, {
        $push: { addresses: newAddress._id },
      });
    }

    res.status(201).json({
      message: `${role} address added successfully`,
      address: newAddress,
    });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ message: error.message });
  }
};

// get all addresses for logged-in user
export const getAllAddresses = async (req, res) => {
  try {
    const { id, role } = req.user;

    const addresses = await addressModel.find({ userId: id, role });

    res.status(200).json({
      message: `${role} addresses fetched successfully`,
      count: addresses.length,
      addresses,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: error.message });
  }
};

// get single address by id
export const getSingleAddress = async (req, res) => {
  try {
    const { id, role } = req.user;
    const { addressId } = req.params;

    const address = await addressModel.findOne({
      _id: addressId,
      userId: id,
      role,
    });

    if (!address) {
      return res.status(404).json({ message: `${role} address not found` });
    }

    res.status(200).json({
      message: `${role} address fetched successfully`,
      address,
    });
  } catch (error) {
    console.error("Error fetching single address:", error);
    res.status(500).json({ message: error.message });
  }
};

// update address controllers '
export const updateAddress = async (req, res) => {
  try {
    const { id, role } = req.user; // token se id aur role dono
    const { addressId } = req.params;

    const updatedAddress = await addressModel.findOneAndUpdate(
      { _id: addressId, userId: id, role }, // role check bhi add
      req.body,
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ message: `${role} address not found` });
    }

    res.status(200).json({
      message: `${role} address updated successfully`,
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id, role } = req.user;
    const { addressId } = req.params;

    const deleted = await addressModel.findOneAndDelete({
      _id: addressId,
      userId: id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (role === "user") {
      await userModel.findByIdAndUpdate(id, {
        $pull: { addresses: addressId },
      });
    } else if (role === "seller") {
      await sellerModel.findByIdAndUpdate(id, {
        $pull: { addresses: addressId },
      });
    } else if (role === "admin") {
      await adminModel.findByIdAndUpdate(id, {
        $pull: { addresses: addressId },
      });
    }

    res.status(200).json({ message: `${role} address deleted successfully` });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: error.message });
  }
};
