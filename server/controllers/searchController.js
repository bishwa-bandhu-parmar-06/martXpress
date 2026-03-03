import Product from "../models/productModel.js";
import { esClient } from "../config/elasticsearch.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ==========================================
// 1. ONE-TIME BULK SYNC (Updated)
// ==========================================
export const syncDatabaseToOpenSearch = asyncHandler(async (req, res) => {
  const indexName = "products";

  // --- NEW: Explicitly Create Index if it doesn't exist ---
  try {
    const { body: indexExists } = await esClient.indices.exists({
      index: indexName,
    });

    if (!indexExists) {
      await esClient.indices.create({ index: indexName });
      console.log(`Successfully created OpenSearch index: [${indexName}]`);
    }
  } catch (error) {
    console.error("Error checking/creating index:", error.message);
    // Continue anyway, sometimes the exists check behaves differently on older cluster versions
  }

  // Fetch all active products from MongoDB
  const products = await Product.find({ status: "active" });

  if (products.length === 0) {
    return res.status(200).json({ message: "No products found to sync." });
  }

  // OpenSearch 'bulk' API requires a specific flat array format
  const body = products.flatMap((doc) => [
    { index: { _index: indexName, _id: doc._id.toString() } },
    {
      name: doc.name,
      description: doc.description,
      brand: doc.brand,
      category: doc.category,
      tags: doc.tags,
      price: doc.price,
      finalPrice: doc.finalPrice,
      images: doc.images,
      status: doc.status,
      averageRating: doc.averageRating,
      featured: doc.featured,
    },
  ]);

  // Send the bulk request to Bonsai
  const response = await esClient.bulk({ refresh: true, body });

  // Handle OpenSearch JS Client v2 vs v3 response differences safely
  const errors = response.body ? response.body.errors : response.errors;

  if (errors) {
    // Extract exact errors for debugging if it fails again
    const items = response.body ? response.body.items : response.items;
    const errorDetails = items.filter((item) => item.index && item.index.error);

    return res.status(500).json({
      error: "Some documents failed to sync",
      details: errorDetails,
    });
  }

  res.status(200).json({
    success: true,
    message: `Successfully synced ${products.length} products to Bonsai OpenSearch!`,
  });
});

// ==========================================
// 2. THE SEARCH-AS-YOU-TYPE API (Remains the same)
// ==========================================
export const getSearchSuggestions = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.length < 2) {
    return res.status(200).json({ success: true, suggestions: [] });
  }

  // Query Bonsai OpenSearch
  const response = await esClient.search({
    index: "products",
    body: {
      query: {
        multi_match: {
          query: q,
          fields: ["name^3", "brand^2", "category", "tags"],
          type: "best_fields",
          fuzziness: "AUTO",
        },
      },
      _source: ["name", "images", "finalPrice", "category"],
      size: 5,
    },
  });

  const hitsBody = response.body ? response.body.hits : response.hits;

  const suggestions = hitsBody.hits.map((hit) => ({
    id: hit._id,
    ...hit._source,
  }));

  res.status(200).json({
    success: true,
    suggestions,
  });
});
