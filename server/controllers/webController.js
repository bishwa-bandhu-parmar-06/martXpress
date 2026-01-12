// controllers/webController.optimized.js
import productModel from "../models/productModel.js";
import sellerModel from "../models/sellersModel.js";

const toPositiveInt = (v, fallback) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : fallback;
};

export const getAllProducts = async (req, res) => {
  try {
    const page = toPositiveInt(req.query.page, 1);
    const limit = toPositiveInt(req.query.limit, 20);
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

    await setCache(cacheKey, responseData, 60); // short TTL
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
 * NOTE: Cache Invalidation
 *
 * Whenever product is created/updated/deleted, call:
 *   deleteCache(`product:${productId}`)
 *   deleteCache(`seller:${sellerId}:*`) // or specific pages
 *   deleteCache('products:page:*')      // easiest: invalidate all pages on write
 *   deleteCache('products:featured:v1')
 *   deleteCache('products:categories:v1')
 *   deleteCache('products:brands:v1')
 *
 * Efficient invalidation strategy:
 * - On product write: delete product:<id> and all product list pages (or update them incrementally)
 * - On seller product write: delete seller:<sellerId>:page:* and affected list pages
 *
 * (Implement a small helper in product create/update/delete controllers that calls deleteCache for relevant keys)
 */
