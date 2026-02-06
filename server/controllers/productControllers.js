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
// export const getAllProductsAddedByLoggedInSeller = async (req, res) => {
//   try {
//     const sellerId = req.user?.id;

//     const products = await productModel
//       .find({ sellerId })
//       .lean()
//       .sort({ createdAt: -1 });

//     return res.status(200).json({
//       status: 200,
//       message: "All products fetched successfully.",
//       count: products.length,
//       products,
//     });
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return res.status(500).json({
//       status: 500,
//       message: "Internal server error.",
//       error: error.message,
//     });
//   }
// };

export const getAllProductsAddedByLoggedInSeller = async (req, res) => {
  try {
    const sellerId = req.user?.id;

    // 1️⃣ Read query params
    const page = parseInt(req.query.page) || 1; // current page
    const limit = parseInt(req.query.limit) || 10; // items per page
    const skip = (page - 1) * limit;

    // 2️⃣ Fetch total count
    const totalProducts = await productModel.countDocuments({ sellerId });

    // 3️⃣ Fetch paginated products
    const products = await productModel
      .find({ sellerId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // 4️⃣ Response
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
 *  Update a product (Seller only)
 */
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const sellerId = req.user?.id;

    // Check if product exists and belongs to seller
    const product = await productModel.findOne({ _id: productId, sellerId });
    if (!product) {
      return res.status(404).json({ message: "Product not found or unauthorized." });
    }

    // 1. Prepare Update Object from req.body
    const { name, description, category, brand, price, discount, stock, status, featured } = req.body;

    const updateData = {
      name,
      description,
      category,
      brand,
      status,
      featured: featured === 'true' || featured === true, // handle string boolean from formData
      price: Number(price),
      discount: Number(discount),
      stock: Number(stock),
    };

    // 2. Recalculate Final Price
    updateData.finalPrice = updateData.price - (updateData.price * (updateData.discount || 0)) / 100;

    // 3. Handle Tags
    if (req.body["tags[]"]) {
      updateData.tags = Array.isArray(req.body["tags[]"]) 
        ? req.body["tags[]"] 
        : [req.body["tags[]"]];
    }

    // 4. Handle Images Merge
    let updatedImagesArray = [];

    // Purani images jo user ne delete nahi ki (frontend se "existingImages[]" mein aayengi)
    if (req.body["existingImages[]"]) {
      updatedImagesArray = Array.isArray(req.body["existingImages[]"])
        ? req.body["existingImages[]"]
        : [req.body["existingImages[]"]];
    }

    // Nayi images jo Multer/Cloudinary ne upload ki
    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map((file) => file.path);
      updatedImagesArray = [...updatedImagesArray, ...newImagePaths];
    }

    // Safety: Agar user ne sab delete kar diya aur nayi bhi nahi dali, toh purani hi rehne do
    updateData.images = updatedImagesArray.length > 0 ? updatedImagesArray : product.images;

    // 5. Save to DB
    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      status: 200,
      message: "Product updated successfully.",
      product: updatedProduct,
    });

  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({ 
      status: 500, 
      message: "Internal server error.", 
      error: error.message 
    });
  }
};

/**
 *  Delete product (Seller only)
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
 * Get single product (Seller only)
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



