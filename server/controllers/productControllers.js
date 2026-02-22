import productModel from "../models/productModel.js";
import sellerModel from "../models/sellersModel.js";
import { PRODUCT_CATEGORIES } from "../config/constants.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {CustomError} from "../utils/customError.js";

/**
 * 🛒 Add new product (Seller only)
 */
export const addProduct = asyncHandler(async (req, res) => {
  const sellerId = req.user.sub || req.user.id;
  const {
    name,
    description,
    category,
    brand,
    price,
    discount = 0,
    stock = 0,
    tags = [],
  } = req.body;

  if (!name || !price) {
    throw new CustomError("Product name and price are required.", 400);
  }

  if (!PRODUCT_CATEGORIES.includes(category)) {
    throw new CustomError(
      `Invalid Category. Allowed: ${PRODUCT_CATEGORIES.join(", ")}`,
      400,
    );
  }

  // Handle uploaded images
  const imageFiles = req.files || [];
  const imagePaths = imageFiles.map((file) => file.path);

  const finalPrice = Number(price) - (Number(price) * Number(discount)) / 100;

  const newProduct = await productModel.create({
    sellerId,
    name,
    description,
    category,
    brand,
    price,
    discount,
    finalPrice,
    stock,
    images: imagePaths,
    tags,
  });

  return res.status(201).json({
    status: 201,
    message: "Product added successfully.",
    product: newProduct,
  });
});

/**
 * 📦 Get all products by logged-in seller
 */
export const getAllProductsAddedByLoggedInSeller = asyncHandler(
  async (req, res) => {
    const sellerId = req.user.sub || req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalProducts = await productModel.countDocuments({ sellerId });

    const products = await productModel
      .find({ sellerId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      status: 200,
      message: "All products fetched successfully.",
      products,
      pagination: {
        totalProducts,
        page,
        limit,
        totalPages: Math.ceil(totalProducts / limit),
        hasNextPage: page * limit < totalProducts,
        hasPrevPage: page > 1,
      },
    });
  },
);

/**
 * ✏️ Update a product (Seller only)
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const sellerId = req.user.sub || req.user.id;

  const product = await productModel.findOne({ _id: productId, sellerId });
  if (!product) {
    throw new CustomError("Product not found or unauthorized.", 404);
  }

  const {
    name,
    description,
    category,
    brand,
    price,
    discount,
    stock,
    status,
    featured,
  } = req.body;

  const updateData = {
    name,
    description,
    category,
    brand,
    status,
    featured: featured === "true" || featured === true,
    price: Number(price),
    discount: Number(discount),
    stock: Number(stock),
  };

  updateData.finalPrice =
    updateData.price - (updateData.price * (updateData.discount || 0)) / 100;

  if (req.body["tags[]"]) {
    updateData.tags = Array.isArray(req.body["tags[]"])
      ? req.body["tags[]"]
      : [req.body["tags[]"]];
  }

  let updatedImagesArray = [];

  if (req.body["existingImages[]"]) {
    updatedImagesArray = Array.isArray(req.body["existingImages[]"])
      ? req.body["existingImages[]"]
      : [req.body["existingImages[]"]];
  }

  if (req.files && req.files.length > 0) {
    const newImagePaths = req.files.map((file) => file.path);
    updatedImagesArray = [...updatedImagesArray, ...newImagePaths];
  }

  updateData.images =
    updatedImagesArray.length > 0 ? updatedImagesArray : product.images;

  const updatedProduct = await productModel.findByIdAndUpdate(
    productId,
    { $set: updateData },
    { new: true, runValidators: true },
  );

  return res.status(200).json({
    status: 200,
    message: "Product updated successfully.",
    product: updatedProduct,
  });
});

/**
 * 🗑️ Delete product (Seller only)
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const sellerId = req.user.sub || req.user.id;

  const product = await productModel.findOne({ _id: productId, sellerId });
  if (!product) {
    throw new CustomError("Product not found or not authorized.", 404);
  }

  await productModel.findByIdAndDelete(productId);

  return res.status(200).json({
    status: 200,
    message: "🗑️ Product deleted successfully.",
  });
});

/**
 * 🔍 Get single product (Seller only)
 */
export const getSingleProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const sellerId = req.user.sub || req.user.id;

  const product = await productModel
    .findOne({ _id: productId, sellerId })
    .lean();

  if (!product) {
    throw new CustomError("Product not found or not authorized.", 404);
  }

  return res.status(200).json({
    status: 200,
    message: "Product fetched successfully.",
    product,
  });
});
