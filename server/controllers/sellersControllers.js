import mongoose from "mongoose";
import sellerModel from "../models/sellersModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CustomError } from "../utils/customError.js";
import { clearCachePattern } from "../middleware/redisMiddleware.js";

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

  // 1. Prepare fields to update
  let updateData = {
    ...(body.name && { name: body.name }),
    ...(body.email && { email: body.email }),
    ...(body.mobile && { mobile: body.mobile }),
    ...(body.shopName && { shopName: body.shopName }),
    ...(body.gstNumber && { gstNumber: body.gstNumber }),
    ...(body.udyamNumber && { udyamNumber: body.udyamNumber }),
    ...(body.panNumber && { panNumber: body.panNumber }),
  };

  // 2. Prepare fields to safely unset/delete
  let unsetData = {};

  if (body.removeGst === "true") {
    unsetData.gstCertificate = 1;
  }
  if (body.removeUdyam === "true") {
    unsetData.udyamCertificate = 1;
  }

  // 3. Handle new File uploads (overrides unset logic if a new file is uploaded)
  if (req.files?.gstCertificate?.[0]) {
    updateData.gstCertificate = {
      fileName:
        req.files.gstCertificate[0].originalname ||
        req.files.gstCertificate[0].filename,
      path: req.files.gstCertificate[0].path,
      uploadedAt: new Date(),
    };
    delete unsetData.gstCertificate; // Don't unset if we are uploading a new one
  }

  if (req.files?.udyamCertificate?.[0]) {
    updateData.udyamCertificate = req.files.udyamCertificate[0].path;
    delete unsetData.udyamCertificate; // Don't unset if we are uploading a new one
  }

  if (
    Object.keys(updateData).length === 0 &&
    Object.keys(unsetData).length === 0
  ) {
    throw new CustomError("No fields provided for update", 400);
  }

  // 4. Construct the final MongoDB update query
  const updateQuery = { $set: updateData };
  if (Object.keys(unsetData).length > 0) {
    updateQuery.$unset = unsetData;
  }

  const updatedSeller = await sellerModel
    .findByIdAndUpdate(sellerId, updateQuery, {
      new: true,
      runValidators: true,
    })
    .populate("addresses");

  if (!updatedSeller) {
    throw new CustomError("Seller not found", 404);
  }
  await clearCachePattern("/seller-profile");
await clearCachePattern("/orders");
  await clearCachePattern("/analytics");
  await clearCachePattern("/my-orders"); // Clears the user's order history cache too
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

// ----------------- GET SELLER ANALYTICS -----------------
export const getSellerAnalytics = asyncHandler(async (req, res) => {
  const sellerId = req.user.sub || req.user.id;
  const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

  // 1. Calculate Monthly Revenue & Orders for the current year
  const monthlyDataRaw = await orderModel.aggregate([
    { $match: { createdAt: { $gte: startOfYear, $lte: endOfYear } } },
    { $unwind: "$items" },
    {
      $match: {
        "items.sellerId": sellerObjectId,
        "items.itemStatus": { $ne: "cancelled" },
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        orders: { $addToSet: "$_id" }, // count unique order IDs
      },
    },
    {
      $project: {
        month: "$_id",
        revenue: 1,
        orders: { $size: "$orders" },
        _id: 0,
      },
    },
  ]);

  // Format exactly for Recharts (Ensuring all 12 months exist)
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthlyRevenue = months.map((m, i) => {
    const found = monthlyDataRaw.find((d) => d.month === i + 1);
    const rev = found ? found.revenue : 0;
    return {
      month: m,
      revenue: rev,
      profit: rev * 0.25, // Assuming a 25% profit margin for demo purposes
      orders: found ? found.orders : 0,
    };
  });

  // 2. Calculate Sales by Category
  const categorySalesRaw = await orderModel.aggregate([
    { $unwind: "$items" },
    {
      $match: {
        "items.sellerId": sellerObjectId,
        "items.itemStatus": { $ne: "cancelled" },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $group: {
        _id: "$product.category",
        value: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
      },
    },
    { $project: { name: "$_id", value: 1, _id: 0 } },
    { $sort: { value: -1 } }, // Sort highest sales first
  ]);

  // 3. Calculate Overall Average Rating
  const productsData = await productModel.aggregate([
    { $match: { sellerId: sellerObjectId } },
    { $group: { _id: null, avgRating: { $avg: "$averageRating" } } },
  ]);
  const overallAvgRating = productsData[0]?.avgRating?.toFixed(1) || "0.0";

  // Generate an 8-week trend line based on the average
  const ratingData = Array.from({ length: 8 }).map((_, i) => ({
    week: `W${i + 1}`,
    avg:
      overallAvgRating > 0
        ? parseFloat(overallAvgRating) + (Math.random() * 0.4 - 0.2)
        : 0,
  }));

  // 4. Calculate total KPIs
  const totalRevenue = monthlyRevenue.reduce(
    (sum, item) => sum + item.revenue,
    0,
  );
  const totalOrders = monthlyRevenue.reduce(
    (sum, item) => sum + item.orders,
    0,
  );
  const totalProfit = monthlyRevenue.reduce(
    (sum, item) => sum + item.profit,
    0,
  );

  res.status(200).json({
    success: true,
    monthlyRevenue,
    categorySales: categorySalesRaw,
    ratingData,
    kpis: {
      totalRevenue,
      totalOrders,
      totalProfit,
      avgRating: overallAvgRating,
    },
  });
});
