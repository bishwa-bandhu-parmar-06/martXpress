import productModel from "../models/productModel.js";
import sellerModel from "../models/sellersModel.js";
import { PRODUCT_CATEGORIES } from "../config/constants.js";

/**
 * 🛒 Add new product (Seller only)
 */
export const addProduct = async (req, res) => {
  try {
    const sellerId = req.user?.id; // from verifyToken middleware
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
      return res.status(400).json({
        status: 400,
        message: "Product name and price are required.",
      });
    }

    // 2. Validate Category manually (Optional, but good for custom error handling)
    if (!PRODUCT_CATEGORIES.includes(category)) {
      return res.status(400).json({
        status: 400,
        message: `Invalid Category. Allowed: ${PRODUCT_CATEGORIES.join(", ")}`,
      });
    }
    // Handle uploaded images
    const imageFiles = req.files || [];
    const imagePaths = imageFiles.map((file) => file.path);

    const finalPrice = price - (price * discount) / 100;

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
      message: "✅ Product added successfully.",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error while adding product:", error);
    // Catch Mongoose Validation Error specifically
    if (error.name === "ValidationError") {
      return res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

/**
 * 📦 Get all products by logged-in seller
 */
export const getAllProductsAddedByLoggedInSeller = async (req, res) => {
  try {
    const sellerId = req.user?.id;

    const products = await productModel
      .find({ sellerId })
      .lean()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: 200,
      message: "All products fetched successfully.",
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

/**
 * ✏️ Update a product (Seller only)
 */
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const sellerId = req.user?.id;

    const product = await productModel.findOne({ _id: productId, sellerId });
    if (!product) {
      return res.status(404).json({
        status: 404,
        message: "Product not found or not authorized.",
      });
    }

    const updateData = req.body;

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(
        (file) => `/uploads/products/${file.filename}`
      );
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      { $set: updateData },
      { new: true }
    );

    return res.status(200).json({
      status: 200,
      message: "✅ Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

/**
 * 🗑️ Delete product (Seller only)
 */
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const sellerId = req.user?.id;

    const product = await productModel.findOne({ _id: productId, sellerId });
    if (!product) {
      return res.status(404).json({
        status: 404,
        message: "Product not found or not authorized.",
      });
    }

    await productModel.findByIdAndDelete(productId);

    return res.status(200).json({
      status: 200,
      message: "🗑️ Product deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

/**
 * 📘 Get single product (Seller only)
 */
export const getSingleProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const sellerId = req.user?.id;

    const product = await productModel
      .findOne({ _id: productId, sellerId })
      .lean();

    if (!product) {
      return res.status(404).json({
        status: 404,
        message: "Product not found or not authorized.",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Product fetched successfully.",
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
