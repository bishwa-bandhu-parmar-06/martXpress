const productModel = require("../models/product.models.js");

const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discount = 0,
      category,
      brand,
      stock = 0,
      tags = "",
      isFeatured = false,
    } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const slug = slugify(name);
    const existingProduct = await productModel.findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product with this name already exists.",
      });
    }

    // Process uploaded images from Cloudinary
    const images = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    const priceNum = Number(price);
    const discountNum = Number(discount);
    const finalPrice = Math.round(priceNum - (priceNum * discountNum) / 100);

    const newProduct = await productModel.create({
      name,
      slug,
      description,
      price: priceNum,
      discount: discountNum,
      finalPrice,
      category,
      brand,
      stock: Number(stock),
      images,
      tags: tags.split(",").map((tag) => tag.trim()),
      isFeatured,
    });

    return res.status(201).json({
      success: true,
      message: "Product Added Successfully!",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error while adding product:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server error while adding product.",
    });
  }
};

module.exports = { createProduct };
