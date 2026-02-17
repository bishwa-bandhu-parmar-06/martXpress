// controllers/webController.optimized.js
import productModel from "../models/productModel.js";
import sellerModel from "../models/sellersModel.js";

const toPositiveInt = (v, fallback) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : fallback;
};

export const getAllProducts = async (req, res) => {
  try {
    console.log("MongoDB Query Executed");
    const page = toPositiveInt(req.query.page, 1);
    const limit = toPositiveInt(req.query.limit, 50);
    const skip = (page - 1) * limit;
    const projection = {
      name: 1,
      finalPrice: 1,
      price: 1,
      discount: 1,
      images: 1,
      averageRating: 1,
      sellerId: 1,
      category: 1,
      brand: 1,
      featured: 1,
      createdAt: 1,
      status: 1,
    };

    const [totalProducts, products] = await Promise.all([
      productModel.countDocuments({ status: "active" }),
      productModel
        .find({ status: "active" })
        .select(projection)
        .populate({
          path: "sellerId",
          model: sellerModel,
          select: "name shopName",
          options: { lean: true },
        })
        .lean()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    const responseData = {
      status: 200,
      message: "Products fetched successfully.",
      totalProducts,
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(totalProducts / limit)),
      count: products.length,
      products,
    };
    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await productModel
      .findById(productId)
      .populate({
        path: "sellerId",
        model: sellerModel,
        select: "name email shopName",
        options: { lean: true },
      })
      .lean();

    if (!product) {
      return res
        .status(404)
        .json({ status: 404, message: "Product not found." });
    }

    const responseData = {
      status: 200,
      message: "Product fetched successfully.",
      product,
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const getProductsBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const page = toPositiveInt(req.query.page, 1);
    const limit = toPositiveInt(req.query.limit, 50);
    const skip = (page - 1) * limit;
    const cacheKey = `seller:${sellerId}:page:${page}:limit:${limit}`;

    // confirm seller exists (cheap)
    const seller = await sellerModel
      .findById(sellerId)
      .select("name shopName")
      .lean();
    if (!seller) {
      return res
        .status(404)
        .json({ status: 404, message: "Seller not found." });
    }

    const [totalProducts, products] = await Promise.all([
      productModel.countDocuments({ sellerId, status: "active" }),
      productModel
        .find({ sellerId, status: "active" })
        .select({
          name: 1,
          finalPrice: 1,
          images: 1,
          stock: 1,
          averageRating: 1,
          createdAt: 1,
        })
        .lean()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    const responseData = {
      status: 200,
      message: "Products fetched successfully.",
      seller,
      count: products.length,
      totalProducts,
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(totalProducts / limit)),
      products,
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching seller products:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({ featured: true, status: "active" })
      .select({ name: 1, finalPrice: 1, images: 1, sellerId: 1, createdAt: 1 })
      .lean()
      .sort({ createdAt: -1 })
      .limit(10);

    const responseData = {
      status: 200,
      message: "Featured products fetched successfully.",
      count: products.length,
      products,
    };

    await setCache(cacheKey, responseData, 60);
    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await productModel.distinct("category");

    const responseData = {
      status: 200,
      message: "Categories fetched successfully.",
      categories,
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getBrands = async (req, res) => {
  try {
    const brands = await productModel.distinct("brand");

    const responseData = {
      status: 200,
      message: "Brands fetched successfully.",
      brands,
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching brands:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { keyword = "", page = 1 } = req.query;
    if (!keyword || keyword.trim() === "") {
      return res
        .status(400)
        .json({ status: 400, message: "Please provide a search keyword." });
    }

    const q = keyword.trim();
    const limit = toPositiveInt(req.query.limit, 50);
    const skip = (toPositiveInt(page, 1) - 1) * limit;

    let totalProducts = 0;
    let products = [];

    const useText = true;

    if (useText) {
      const pipeline = [
        { $match: { status: "active", $text: { $search: q } } },
        { $addFields: { score: { $meta: "textScore" } } },
        { $sort: { score: -1, featured: -1, createdAt: -1 } },
        {
          $facet: {
            metadata: [{ $count: "total" }],
            data: [
              { $skip: skip },
              { $limit: limit },
              {
                $project: {
                  name: 1,
                  description: 1,
                  brand: 1,
                  category: 1,
                  finalPrice: 1,
                  images: 1,
                  averageRating: 1,
                  score: 1,
                  createdAt: 1,
                },
              },
            ],
          },
        },
      ];

      const agg = await productModel.aggregate(pipeline).allowDiskUse(true);
      if (agg.length) {
        totalProducts = agg[0].metadata?.[0]?.total || 0;
        products = agg[0].data || [];
      }
    } else {
      // fallback - optimized regex search with projection & indexes on fields
      const regex = new RegExp(q, "i");
      const searchQuery = {
        status: "active",
        $or: [
          { name: regex },
          { description: regex },
          { category: regex },
          { brand: regex },
          { tags: regex },
        ],
      };

      [totalProducts, products] = await Promise.all([
        productModel.countDocuments(searchQuery),
        productModel
          .find(searchQuery)
          .select({
            name: 1,
            brand: 1,
            category: 1,
            finalPrice: 1,
            images: 1,
            averageRating: 1,
            createdAt: 1,
          })
          .lean()
          .sort({ featured: -1, createdAt: -1 })
          .skip(skip)
          .limit(limit),
      ]);
    }

    const responseData = {
      status: 200,
      message: "Search results fetched successfully.",
      totalProducts,
      currentPage: toPositiveInt(page, 1),
      totalPages: Math.max(1, Math.ceil(totalProducts / limit)),
      count: products.length,
      products,
    };

    if (!products.length) {
      return res.status(200).json({
        status: 200,
        message: "No products found for your search.",
        ...responseData,
      });
    }

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error searching products:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

/**
 * Get products grouped by category for Homepage
 * Public Access
 */
export const getGroupedProductsByCategory = async (req, res) => {
  // console.log("Tigger !");
  try {
    // console.log("Tigger 12122");
    const groupedProducts = await productModel.aggregate([
      // 1. Sirf active products lo
      { $match: { status: "active" } },

      // 2. Latest products pehle aayein
      { $sort: { createdAt: -1 } },

      // 3. Category ke basis pe group karo
      {
        $group: {
          _id: "$category",
          products: { $push: "$$ROOT" },
          count: { $sum: 1 },
        },
      },

      // 4. Data format clean karo aur limit lagao
      {
        $project: {
          categoryName: "$_id",
          // Har category ke sirf top 10 products dikhao slider mein
          products: { $slice: ["$products", 10] },
          totalInCategory: "$count",
          _id: 0,
        },
      },

      // 5. Alfabetical order mein categories rakho (optional)
      { $sort: { categoryName: 1 } },
    ]);

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Grouped products fetched successfully.",
      data: groupedProducts,
    });
  } catch (error) {
    console.error("Error in getGroupedProductsByCategory:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

/**
 * Get products for Hero Slider - Prioritizes featured, fills with top-rated
 */
export const getHeroSliderProducts = async (req, res) => {
  try {
    const sliderProducts = await productModel.aggregate([
      // 1. Only active products
      { $match: { status: "active" } },

      // 2. Sort: featured first, then by rating, then by date
      {
        $sort: {
          featured: -1, // Featured products first (true > false)
          averageRating: -1, // Highest rating next
          createdAt: -1, // Newest last
        },
      },

      // 3. Group by category and take the best one
      {
        $group: {
          _id: "$category",
          product: { $first: "$$ROOT" },
        },
      },

      // 4. Clean up the output format
      {
        $project: {
          _id: 0,
          categoryName: "$_id",
          product: 1,
        },
      },

      // 5. Sort categories alphabetically
      { $sort: { categoryName: 1 } },

      // 6. Limit to max 6 categories
      { $limit: 6 },
    ]);

    res.status(200).json({
      success: true,
      data: sliderProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 *  Get products by specific category with pagination
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Decode URL-encoded category name
    const decodedCategoryName = decodeURIComponent(categoryName);

    console.log("Fetching products for category:", decodedCategoryName);

    // First check if category exists by getting distinct categories
    const categories = await productModel.distinct("category");
    if (!categories.includes(decodedCategoryName)) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: `Category "${decodedCategoryName}" not found.`,
        availableCategories: categories,
      });
    }

    // Get total count
    const totalProducts = await productModel.countDocuments({
      category: decodedCategoryName,
      status: "active",
    });

    // Get products with pagination and populate seller info
    const products = await productModel
      .find({
        category: decodedCategoryName,
        status: "active",
      })
      .select({
        _id: 1,
        name: 1,
        description: 1,
        brand: 1,
        category: 1,
        price: 1,
        discount: 1,
        finalPrice: 1,
        images: 1,
        averageRating: 1,
        totalRatings: 1,
        stock: 1,
        featured: 1,
        tags: 1,
        sellerId: 1,
        status: 1,
        createdAt: 1,
      })
      .populate({
        path: "sellerId",
        model: sellerModel,
        select: "name shopName email",
        options: { lean: true },
      })
      .lean()
      .sort({ featured: -1, averageRating: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      status: 200,
      success: true,
      message: `Products for "${decodedCategoryName}" fetched successfully.`,
      data: products,
      total: totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      category: decodedCategoryName,
    });
  } catch (error) {
    console.error("Error in getProductsByCategory:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

/**
 * Get all unique categories
 */
export const getAllCategories = async (req, res) => {
  try {
    const categories = await productModel.distinct("category");

    // Remove null/undefined categories and sort alphabetically
    const cleanCategories = categories
      .filter((cat) => cat && cat.trim() !== "")
      .sort((a, b) => a.localeCompare(b));

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Categories fetched successfully.",
      data: cleanCategories,
    });
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

/**
 * Get top products for a category (for sliders)
 */
export const getTopCategoryProducts = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const decodedCategoryName = decodeURIComponent(categoryName);

    const topProducts = await productModel
      .find({
        category: decodedCategoryName,
        status: "active",
        featured: true,
      })
      .select({
        _id: 1,
        name: 1,
        price: 1,
        finalPrice: 1,
        discount: 1,
        images: 1,
        averageRating: 1,
        brand: 1,
        featured: 1,
      })
      .lean()
      .sort({ averageRating: -1, createdAt: -1 })
      .limit(limit);

    return res.status(200).json({
      status: 200,
      success: true,
      message: `Top products for "${decodedCategoryName}" fetched successfully.`,
      data: topProducts,
      category: decodedCategoryName,
    });
  } catch (error) {
    console.error("Error in getTopCategoryProducts:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

/**
 *  Get category-wise highest rated + featured products
 * Fallback: only featured products of same category
 */
export const getCategoryTopFeaturedProducts = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const limit = Math.min(parseInt(req.query.limit) || 6);

    if (!categoryName) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const decodedCategory = decodeURIComponent(categoryName);

    const baseFilter = {
      status: "active",
      category: decodedCategory,
      featured: true,
    };

    // Highest rated + featured (same category)
    const topRatedFeatured = await productModel
      .find({
        ...baseFilter,
        averageRating: { $gt: 0 },
      })
      .select(
        "_id name price finalPrice discount images averageRating brand featured",
      )
      .sort({ averageRating: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    if (topRatedFeatured.length > 0) {
      return res.status(200).json({
        success: true,
        source: "top-rated-featured",
        category: decodedCategory,
        data: topRatedFeatured,
      });
    }

    //Fallback → only featured (same category)
    const featuredOnly = await productModel
      .find(baseFilter)
      .select(
        "_id name price finalPrice discount images averageRating brand featured",
      )
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    return res.status(200).json({
      success: true,
      source: "featured-only",
      category: decodedCategory,
      data: featuredOnly,
    });
  } catch (error) {
    console.error("getCategoryTopFeaturedProducts error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
