import productModel from "../models/productModel.js";
import sellerModel from "../models/sellersModel.js";
import { PRODUCT_CATEGORIES } from "../config/constants.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CustomError } from "../utils/customError.js";
import { clearCachePattern } from "../middleware/redisMiddleware.js";
import xlsx from "xlsx";
import fs from "fs";

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
  // --- CLEAR CACHE ---
  await clearCachePattern("/products");
  await clearCachePattern("/categories");
  await clearCachePattern("/brands");
  await clearCachePattern("/homepage-grouped");
  await clearCachePattern("/hero-slider");
  await clearCachePattern("/top-category");
  await clearCachePattern("/search");
  await clearCachePattern("/dashboard/stats");
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
  // --- CLEAR CACHE ---
  await clearCachePattern("/products");
  await clearCachePattern("/categories");
  await clearCachePattern("/brands");
  await clearCachePattern("/homepage-grouped");
  await clearCachePattern("/hero-slider");
  await clearCachePattern("/top-category");
  await clearCachePattern("/search");
  await clearCachePattern("/dashboard/stats");
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
  // --- CLEAR CACHE ---
  await clearCachePattern("/products");
  await clearCachePattern("/categories");
  await clearCachePattern("/brands");
  await clearCachePattern("/homepage-grouped");
  await clearCachePattern("/hero-slider");
  await clearCachePattern("/top-category");
  await clearCachePattern("/search");
  await clearCachePattern("/dashboard/stats");
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

/**
 * 📦 Bulk Add Products via Excel (Seller only)
 */
export const addBulkProducts = asyncHandler(async (req, res) => {
  const sellerId = req.user.sub || req.user.id;

  if (!req.file) {
    throw new CustomError("Please upload an Excel or CSV file.", 400);
  }

  try {
    // 1. Read the uploaded Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (sheetData.length === 0) {
      throw new CustomError("The uploaded file is empty.", 400);
    }

    const productsToInsert = [];
    const errors = [];

    // 2. Process and map each row to your schema
    sheetData.forEach((row, index) => {
      // Validate strictly required fields
      if (!row.Name || !row.Price || !row.Category) {
        errors.push(`Row ${index + 2}: Missing Name, Price, or Category.`);
        return;
      }

      if (!PRODUCT_CATEGORIES.includes(row.Category)) {
        errors.push(`Row ${index + 2}: Invalid Category '${row.Category}'.`);
        return;
      }

      // Parse arrays safely
      const tagsArray = row.Tags
        ? String(row.Tags)
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];
      const imagesArray = row.ImageURLs
        ? String(row.ImageURLs)
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean)
        : [];

      // Safely parse status to match your enum
      let parsedStatus = "active";
      if (row.Status) {
        const s = String(row.Status).toLowerCase();
        if (["active", "inactive", "out of stock"].includes(s)) {
          parsedStatus = s;
        }
      }

      productsToInsert.push({
        sellerId,
        name: String(row.Name),
        description: row.Description
          ? String(row.Description)
          : "No description provided.",
        category: String(row.Category),
        brand: row.Brand ? String(row.Brand) : "",
        price: Number(row.Price),
        discount: Number(row.Discount) || 0,
        stock: Number(row.Stock) || 0,
        tags: tagsArray,
        images: imagesArray,
        status: parsedStatus,
        featured: String(row.Featured).toLowerCase() === "true",
      });
    });

    if (productsToInsert.length === 0) {
      throw new CustomError(
        `No valid products found. Errors: ${errors.join(" | ")}`,
        400,
      );
    }

    await productModel.create(productsToInsert);

    fs.unlinkSync(req.file.path);
    // --- CLEAR CACHE ---
    await clearCachePattern("/products");
    await clearCachePattern("/categories");
    await clearCachePattern("/brands");
    await clearCachePattern("/homepage-grouped");
    await clearCachePattern("/hero-slider");
    await clearCachePattern("/top-category");
    await clearCachePattern("/search");
    await clearCachePattern("/dashboard/stats");
    return res.status(201).json({
      status: 201,
      message: `Successfully added ${productsToInsert.length} products.`,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    // Ensure file is deleted if something crashes
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    throw new CustomError(
      error.message || "Failed to process Excel file.",
      500,
    );
  }
});
