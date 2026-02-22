import userModel from "../models/usersModel.js";
import sellerModel from "../models/sellersModel.js";
import adminModel from "../models/adminModel.js";
import addressModel from "../models/addressModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {CustomError} from "../utils/customError.js";

export const addAddress = asyncHandler(async (req, res) => {
  const userId = req.user.sub || req.user.id;
  const role = req.user.role;
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
    userId,
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

  if (role === "user") {
    await userModel.findByIdAndUpdate(userId, {
      $push: { addresses: newAddress._id },
    });
  } else if (role === "seller") {
    await sellerModel.findByIdAndUpdate(userId, {
      $push: { addresses: newAddress._id },
    });
  } else if (role === "admin") {
    await adminModel.findByIdAndUpdate(userId, {
      $push: { addresses: newAddress._id },
    });
  }

  res.status(201).json({
    message: `${role} address added successfully`,
    address: newAddress,
  });
});

export const getAllAddresses = asyncHandler(async (req, res) => {
  const userId = req.user.sub || req.user.id;
  const role = req.user.role;

  const addresses = await addressModel.find({ userId, role });

  res.status(200).json({
    message: `${role} addresses fetched successfully`,
    count: addresses.length,
    addresses,
  });
});

export const getSingleAddress = asyncHandler(async (req, res) => {
  const userId = req.user.sub || req.user.id;
  const role = req.user.role;
  const { addressId } = req.params;

  const address = await addressModel.findOne({ _id: addressId, userId, role });
  if (!address) throw new CustomError(`${role} address not found`, 404);

  res.status(200).json({
    message: `${role} address fetched successfully`,
    address,
  });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const userId = req.user.sub || req.user.id;
  const role = req.user.role;
  const { addressId } = req.params;

  const updatedAddress = await addressModel.findOneAndUpdate(
    { _id: addressId, userId, role },
    req.body,
    { new: true, runValidators: true },
  );

  if (!updatedAddress) throw new CustomError(`${role} address not found`, 404);

  res.status(200).json({
    message: `${role} address updated successfully`,
    address: updatedAddress,
  });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const userId = req.user.sub || req.user.id;
  const role = req.user.role;
  const { addressId } = req.params;

  const deleted = await addressModel.findOneAndDelete({
    _id: addressId,
    userId,
  });
  if (!deleted) throw new CustomError("Address not found", 404);

  if (role === "user") {
    await userModel.findByIdAndUpdate(userId, {
      $pull: { addresses: addressId },
    });
  } else if (role === "seller") {
    await sellerModel.findByIdAndUpdate(userId, {
      $pull: { addresses: addressId },
    });
  } else if (role === "admin") {
    await adminModel.findByIdAndUpdate(userId, {
      $pull: { addresses: addressId },
    });
  }

  res.status(200).json({ message: `${role} address deleted successfully` });
});
