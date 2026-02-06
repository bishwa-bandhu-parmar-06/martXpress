import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CategorySlider from "../../Pages/Category/CategorySlider";
import { ChevronLeft, Star, Truck, Shield, Loader } from "lucide-react";
import { getProductsByBrand } from "../../API/Common/brandsApi";

const BrandPage = () => {
  const { brandSlug } = useParams();
  const navigate = useNavigate();

  const [brandName, setBrandName] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const productsPerPage = 12;

  // Convert slug → Brand Name
  useEffect(() => {
    if (!brandSlug) return;

    const formattedBrand = brandSlug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    setBrandName(formattedBrand);
    fetchAllBrandProducts(formattedBrand);
  }, [brandSlug]);

  // Fetch ALL brand products
  const fetchAllBrandProducts = useCallback(async (brand) => {
    try {
      setLoading(true);
      setError(null);

      const firstRes = await getProductsByBrand(brand, 1, productsPerPage);

      if (!firstRes?.products) {
        setError("No products found for this brand");
        return;
      }

      const totalPages = firstRes.totalPages || 1;
      let all = [...firstRes.products];

      if (totalPages > 1) {
        const promises = [];
        for (let p = 2; p <= totalPages; p++) {
          promises.push(
            productService.getProductsByBrand(brand, p, productsPerPage),
          );
        }

        const responses = await Promise.all(promises);
        responses.forEach((r) => {
          if (r?.products) all.push(...r.products);
        });
      }

      setAllProducts(all);

      // Featured logic SAME
      const featured = all
        .filter(
          (p) =>
            p.images?.length && (p.featured || (p.averageRating || 0) >= 4),
        )
        .sort((a, b) => {
          if (a.featured !== b.featured) return b.featured ? 1 : -1;
          return (b.averageRating || 0) - (a.averageRating || 0);
        })
        .slice(0, 4);

      setFeaturedProducts(featured);
    } catch (err) {
      console.error(err);
      setError("Failed to load brand products");
    } finally {
      setLoading(false);
    }
  }, []);
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/brands");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/*  Brand Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700"
          >
            <ChevronLeft />
          </button>

          <div>
            <h1 className="text-3xl font-bold">{brandName}</h1>
            <p className="text-gray-500">
              {loading ? "Loading..." : `${allProducts.length} products`}
            </p>
          </div>
        </div>
      </div>

      {/* ⭐ Featured Slider */}
      {!loading && featuredProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <CategorySlider
            categoryData={{ products: featuredProducts }}
            categoryName={brandName}
          />
        </div>
      )}

      {/* 🔥 Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : loading ? (
          <div className="flex justify-center py-20">
            <Loader className="animate-spin w-12 h-12" />
          </div>
        ) : allProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-xl transition"
              >
                <img
                  src={product.images?.[0] || "/placeholder.jpg"}
                  className="h-56 w-full object-cover rounded-t-xl"
                />
                <div className="p-4">
                  <span className="text-xs text-gray-500">{product.brand}</span>
                  <h3 className="font-bold line-clamp-2">{product.name}</h3>

                  <div className="flex items-center gap-1 my-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < Math.floor(product.averageRating || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>

                  <div className="font-bold text-lg">
                    ₹{product.finalPrice || product.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">No products found 😔</div>
        )}
      </div>
    </div>
  );
};

export default BrandPage;
