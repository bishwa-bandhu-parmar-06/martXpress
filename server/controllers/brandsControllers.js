import productModel from "../models/productModel.js";
import sellerModel from "../models/sellersModel.js";

const toPositiveInt = (v, fallback) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : fallback;
};

export const getProductsByBrand = async (req, res) => {
  try {
    const { brand } = req.params;

    const page = toPositiveInt(req.query.page, 1);
    const limit = toPositiveInt(req.query.limit, 12);
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

    const filter = {
      status: "active",
      brand: { $regex: `^${brand}$`, $options: "i" }, // 🔥 FIX
    };

    const [totalProducts, products] = await Promise.all([
      productModel.countDocuments(filter),
      productModel
        .find(filter)
        .select(projection)
        .populate({
          path: "sellerId",
          model: sellerModel,
          select: "name shopName",
          options: { lean: true },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return res.status(200).json({
      status: 200,
      message: "Brand products fetched successfully.",
      brand,
      totalProducts,
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(totalProducts / limit)),
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching brand products:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
