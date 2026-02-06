import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Heart,
  Share2,
  Check,
  ArrowRight,
  ShoppingBag,
  Plus,
  Minus,
  Image,
} from "lucide-react";
import { getSingleProductDetails } from "@/API/ProductsApi/productsAPI";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProductData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching product with ID:", productId);

        const response = await getSingleProductDetails(productId);
        console.log("API Response:", response);

        if (response && response.status === 200 && response.product) {
          const productData = response.product;
          console.log("Product data received:", productData);

          setProduct(productData);
          setSelectedColor(productData.colors?.[0] || "#000000");
          setSelectedSize(productData.sizes?.[0] || "Standard");
          setRelatedProducts([]);
        } else {
          console.error("Product not found in API response:", response);
          setError("Product not found");
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError(error.message || "Failed to load product");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  const getSafeImages = () => {
    if (!product) return [];

    if (product.images && product.images.length > 0) {
      return product.images;
    }

    if (product.image) {
      return [product.image];
    }

    return ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"];
  };

  const getSafeColors = () => {
    if (!product) return ["#000000"];
    if (product.colors && product.colors.length > 0) {
      return product.colors;
    }
    return ["#000000"];
  };

  const getSafeSizes = () => {
    if (!product) return ["Standard"];
    if (product.sizes && product.sizes.length > 0) {
      return product.sizes;
    }
    return ["Standard"];
  };

  const handleImageSelect = (index) => {
    const images = getSafeImages();
    if (index >= 0 && index < images.length) {
      setSelectedImage(index);
    }
  };

  const handleNextImage = () => {
    const images = getSafeImages();
    if (images.length > 1) {
      setSelectedImage((prev) => (prev + 1) % images.length);
    }
  };

  const handlePrevImage = () => {
    const images = getSafeImages();
    if (images.length > 1) {
      setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    console.log("Added to cart:", {
      productId: product._id,
      name: product.name,
      quantity,
      color: selectedColor,
      size: selectedSize,
      price: product.price,
      total: product.price * quantity,
    });

    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    handleAddToCart();
    navigate("/checkout");
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    alert(isWishlisted ? "Removed from wishlist" : "Added to wishlist!");
  };

  const handleShare = () => {
    if (!product) return;

    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error || "Product Not Found"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Product ID: {productId} not found in our catalog.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const images = getSafeImages();
  const colors = getSafeColors();
  const sizes = getSafeSizes();
  const currentColor = selectedColor || colors[0];
  const currentSize = selectedSize || sizes[0];

  const displayPrice = product.finalPrice || product.price;
  const originalPrice = product.price; // Original price is in the price field
  const discount = product.discount || 0;

  // Extract seller name safely
  const sellerName =
    product.sellerId?.shopName || product.sellerId?.name || "Seller";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <ChevronLeft size={16} />
              Back
            </button>
            <span className="mx-2">/</span>
            <button
              onClick={() => navigate("/")}
              className="hover:text-primary transition-colors"
            >
              Home
            </button>
            <span className="mx-2">/</span>
            <button
              onClick={() =>
                navigate(
                  `/category/${(product.category || "")
                    .toLowerCase()
                    .replace(/ /g, "-")
                    .replace(/&/g, "and")}`,
                )
              }
              className="hover:text-primary transition-colors"
            >
              {product.category || "Category"}
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-900 dark:text-white truncate">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Product Images */}
          <div>
            {/* Main Image */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg mb-4">
              <div className="aspect-square relative">
                {images.length > 0 ? (
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                    <Image size={64} className="text-gray-400" />
                  </div>
                )}

                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-lg"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-lg"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Discount Badge */}
                {discount > 0 && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                    -{discount}% OFF
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={handleWishlist}
                  className={`absolute top-4 right-4 p-2 rounded-full ${
                    isWishlisted
                      ? "bg-red-500 text-white"
                      : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700"
                  } transition-colors shadow-lg`}
                >
                  <Heart
                    size={20}
                    fill={isWishlisted ? "currentColor" : "none"}
                  />
                </button>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageSelect(index)}
                  className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} - View ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800";
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div>
            {/* Product Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                  {product.brand || "Premium Brand"}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className={`${
                        star <= Math.floor(product.averageRating || 4)
                          ? "text-yellow-400 fill-yellow-400"
                          : star <= (product.averageRating || 4)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {(product.averageRating || 4).toFixed(1)} (
                    {product.totalRatings || 50} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  ₹{displayPrice?.toLocaleString() || "N/A"}
                </span>
                {originalPrice && originalPrice > displayPrice && (
                  <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                    ₹{originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {discount > 0 && originalPrice && (
                <div className="text-green-600 dark:text-green-400 font-medium">
                  You save ₹
                  {Math.round(originalPrice - displayPrice).toLocaleString()} (
                  {discount}%)
                </div>
              )}
            </div>

            {/* Product Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {product.description ||
                  `${product.name} - Premium quality product`}
              </p>
            </div>

            {/* Color Selection */}
            {colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Color
                </h3>
                <div className="flex gap-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        currentColor === color
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Size
                </h3>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        currentSize === size
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Quantity
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="text-xl font-semibold w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {product.stock > 0 ? (
                    <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <Check size={18} /> In Stock ({product.stock} available)
                    </span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 px-8 py-4 bg-primary text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 ${
                  product.stock <= 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02]"
                }`}
              >
                <ShoppingBag size={22} />
                {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className={`flex-1 px-8 py-4 bg-gray-900 dark:bg-gray-800 text-white font-semibold rounded-xl transition-all duration-300 ${
                  product.stock <= 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-black dark:hover:bg-gray-900 hover:shadow-lg hover:scale-[1.02]"
                }`}
              >
                Buy Now
              </button>
            </div>

            {/* Product Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Product Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Specifications */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Product Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { key: "Brand", value: product.brand || "Not specified" },
              { key: "Category", value: product.category || "Not specified" },
              {
                key: "Stock",
                value:
                  product.stock > 0
                    ? `${product.stock} units available`
                    : "Out of Stock",
              },
              { key: "Seller", value: sellerName },
              {
                key: "Status",
                value: product.status === "active" ? "Active" : "Inactive",
              },
              { key: "Featured", value: product.featured ? "Yes" : "No" },
              {
                key: "Rating",
                value: `${(product.averageRating || 0).toFixed(1)} (${product.totalRatings || 0} reviews)`,
              },
              {
                key: "Discount",
                value: discount > 0 ? `${discount}% OFF` : "No Discount",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="border-b border-gray-200 dark:border-gray-700 pb-4"
              >
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {item.key}
                </div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              ₹{displayPrice?.toLocaleString() || "N/A"}
            </div>
            {originalPrice && originalPrice > displayPrice && (
              <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                ₹{originalPrice.toLocaleString()}
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`px-6 py-3 bg-primary text-white font-semibold rounded-lg transition-colors ${
                product.stock <= 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-primary/90"
              }`}
            >
              {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className={`px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white font-semibold rounded-lg transition-colors ${
                product.stock <= 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-black dark:hover:bg-gray-900"
              }`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
