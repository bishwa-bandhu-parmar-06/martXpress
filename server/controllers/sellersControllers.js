import sellerModel from "../models/sellersModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CustomError } from "../utils/customError.js";

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

// ----------------- GET SELLER SPECIFIC ORDERS -----------------
export const getSellerOrders = asyncHandler(async (req, res) => {
  const sellerId = req.user.sub || req.user.id;

  // Since we added sellerId to the items array, we can query orders directly!
  // No need to query products first. This is O(1) instead of O(N).
  const orders = await orderModel
    .find({ "items.sellerId": sellerId })
    .populate("items.productId", "name images price brand")
    .sort({ createdAt: -1 });

  const sellerOrders = orders.map((order) => {
    const orderObj = order.toObject();

    // Filter items to ONLY show this seller's items
    const sellerItems = orderObj.items.filter(
      (item) => item.sellerId.toString() === sellerId.toString(),
    );

    orderObj.items = sellerItems;

    // Calculate total amount ONLY for this seller
    orderObj.sellerTotalAmount = sellerItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // Set the display status based on the first item (or you can calculate an aggregate)
    orderObj.displayStatus =
      sellerItems.length > 0 ? sellerItems[0].itemStatus : "pending";

    return orderObj;
  });

  res.status(200).json({
    status: 200,
    message: "Seller orders fetched successfully",
    count: sellerOrders.length,
    orders: sellerOrders,
  });
});

// ----------------- UPDATE ORDER STATUS -----------------
export const updateSellerOrderStatus = asyncHandler(async (req, res) => {
  const sellerId = req.user.sub || req.user.id;
  const { orderId } = req.params;
  const { status } = req.body; // e.g., "shipped"

  const validStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  if (!validStatuses.includes(status.toLowerCase())) {
    throw new CustomError("Invalid order status", 400);
  }

  const order = await orderModel.findById(orderId);
  if (!order) throw new CustomError("Order not found", 404);

  let updatedCount = 0;

  // Update ONLY the items belonging to this specific seller
  order.items.forEach((item) => {
    if (item.sellerId.toString() === sellerId.toString()) {
      item.itemStatus = status.toLowerCase();
      updatedCount++;
    }
  });

  if (updatedCount === 0) {
    throw new CustomError(
      "Unauthorized: No items in this order belong to you",
      403,
    );
  }

  const allStatuses = order.items.map((i) => i.itemStatus);
  const allDelivered = allStatuses.every((s) => s === "delivered");
  const allShipped = allStatuses.every(
    (s) => s === "shipped" || s === "delivered",
  );

  if (allDelivered) order.orderStatus = "delivered";
  else if (allShipped) order.orderStatus = "shipped";
  // ----------------------------------------------------------------------------

  await order.save();

  res.status(200).json({
    status: 200,
    message: `Updated ${updatedCount} items to ${status}`,
    newStatus: status,
  });
});
