import { useDispatch } from "react-redux";

import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingBag,
  Loader,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getCategoryTopFeaturedProducts } from "@/API/ProductsApi/productsAPI"; // Adjust path
import { addProductToCart } from "../../API/Cart/getAllCartProductApi.js"; // Adjust path
import { setCartQuantity } from "../../Features/Cart/CartSlice.js";


const CategorySlider = ({ categoryName }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});

  // Get category-specific gradient
  const getCategoryGradient = (category) => {
    const gradients = {
      Fashion: "from-pink-500/30 to-rose-500/30",
      Electronics: "from-blue-500/30 to-indigo-500/30",
      "TV & Appliances": "from-purple-500/30 to-violet-500/30",
      "Mobiles & Tablets": "from-cyan-500/30 to-blue-500/30",
      "Home & Furniture": "from-emerald-500/30 to-teal-500/30",
      "Beauty & Personal Care": "from-rose-500/30 to-pink-500/30",
      Grocery: "from-green-500/30 to-emerald-500/30",
      default: "from-primary/30 to-secondary/30",
    };

    return gradients[category] || gradients.default;
  };

  // Fetch top featured products from API
  const fetchTopFeaturedProducts = useCallback(async () => {
    if (!categoryName) return;

    try {
      setLoading(true);
      setError(null);

      const response = await getCategoryTopFeaturedProducts(categoryName);
      if (response.success) {
        const products = response.data || [];

        // Transform products into slides
        const generatedSlides = products.map((product, index) => {
          const actualDiscount =
            product.discount > 0 ? product.discount : product.featured ? 20 : 0;
          const actualRating =
            product.averageRating || (product.featured ? 4.5 : 4.0);
          const actualReviews = product.totalRatings || 42 + index * 10;

          // Calculate original price if there's a discount
          const originalPrice =
            actualDiscount > 0 && product.price
              ? Math.round(product.price * (100 / (100 - actualDiscount)))
              : null;

          // Determine subtitle based on product status
          let subtitle;
          if (product.featured === true && (product.averageRating || 0) >= 4) {
            subtitle = "Featured & Top Rated";
          } else if (product.featured === true) {
            subtitle = "Featured Product";
          } else if ((product.averageRating || 0) >= 4) {
            subtitle = "Top Rated";
          } else {
            subtitle = `Best Seller #${index + 1}`;
          }

          // Use actual description if available, otherwise create one
          let description = product.description;
          if (!description || description.trim() === "") {
            if (
              product.featured === true &&
              (product.averageRating || 0) >= 4
            ) {
              description = `Premium featured ${categoryName.toLowerCase()} with excellent customer ratings`;
            } else if (product.featured === true) {
              description = `Featured ${categoryName.toLowerCase()} product with premium quality`;
            } else if ((product.averageRating || 0) >= 4) {
              description = `Highly rated ${categoryName.toLowerCase()} product loved by customers`;
            } else {
              description = `High-quality ${categoryName.toLowerCase()} product`;
            }
          }

          return {
            id: product._id,
            image: product.images?.[0] || "/placeholder.jpg",
            title: product.name,
            subtitle: subtitle,
            description: description,
            price: product.finalPrice || product.price,
            originalPrice: originalPrice,
            discount: actualDiscount,
            rating: actualRating,
            reviews: actualReviews,
            buttonText: "Shop Now",
            buttonLink: `/product/${product._id}`,
            categoryLink: `/category/${categoryName.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`,
            backgroundColor: getCategoryGradient(categoryName),
            textColor: "text-white",
            isFeatured: product.featured === true,
            hasHighRating: (product.averageRating || 0) >= 4,
            stock: product.stock !== undefined ? product.stock : 10, // Assuming in stock if undefined
          };
        });

        setSlides(generatedSlides);
      } else {
        setError(response.message || "Failed to fetch featured products");
      }
    } catch (err) {
      console.error("Error in fetchTopFeaturedProducts:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load featured products. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [categoryName]);

  // Fetch products when category changes
  useEffect(() => {
    if (categoryName) {
      fetchTopFeaturedProducts();
    }
  }, [categoryName, fetchTopFeaturedProducts]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;

    const interval = setInterval(() => {
      if (!isTransitioning) {
        handleNextSlide();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length, isTransitioning]);

  const handleNextSlide = () => {
    if (isTransitioning || slides.length <= 1) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handlePrevSlide = () => {
    if (isTransitioning || slides.length <= 1) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide || slides.length <= 1) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleSlideClick = (link) => {
    navigate(link);
  };

  const handleAddToCart = async (productId, productName, e) => {
    e.stopPropagation(); // Prevent navigating to the product page when clicking the button

    try {
      setAddingToCart((prev) => ({ ...prev, [productId]: true }));
      const response = await addProductToCart({
        productId,
        quantity: 1,
      });

      if (response?.success) {
        toast.success(`${productName} added to cart!`);
        dispatch(setCartQuantity(response.cart.totalQuantity));
      } else {
        toast.success("Added to cart successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Calculate progress bar width
  const progressWidth =
    slides.length > 0 ? ((currentSlide + 1) / slides.length) * 100 : 0;

  // Don't show slider if loading or error or no slides
  if (loading) {
    return (
      <div className="w-full h-87.5 sm:h-100 md:h-125 flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-2xl mb-8">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading featured products...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-87.5 sm:h-100 md:h-125 flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-2xl mb-8">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Unable to Load Featured Products
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return null; // Don't show slider if no slides
  }

  return (
    <div
      className="relative w-full h-100 sm:h-112.5 md:h-125 lg:h-150 overflow-hidden rounded-2xl shadow-2xl mb-8"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Category Header Overlay */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-r ${getCategoryGradient(categoryName)} flex items-center justify-center text-white shadow-md`}
          >
            <ShoppingBag size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-md line-clamp-1">
              {categoryName} Collection
            </h2>
            <p className="text-white/90 text-xs sm:text-sm drop-shadow-sm">
              Featured Products
            </p>
          </div>
        </div>
      </div>

      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => {
          let translateX = "0%";
          let scale = 1;
          let opacity = 0;
          let zIndex = 1;

          if (index === currentSlide) {
            translateX = "0%";
            scale = 1;
            opacity = 1;
            zIndex = 20;
          } else if (index === (currentSlide + 1) % slides.length) {
            translateX = "100%";
            scale = 0.95;
            opacity = 0.3;
            zIndex = 10;
          } else if (
            index ===
            (currentSlide - 1 + slides.length) % slides.length
          ) {
            translateX = "-100%";
            scale = 0.95;
            opacity = 0.3;
            zIndex = 10;
          } else {
            translateX = index < currentSlide ? "-150%" : "150%";
            scale = 0.9;
            opacity = 0;
            zIndex = 1;
          }

          const isAdding = addingToCart[slide.id];

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-500 ease-out cursor-pointer`}
              style={{
                transform: `translateX(${translateX}) scale(${scale})`,
                opacity: opacity,
                zIndex: zIndex,
              }}
              onClick={() => handleSlideClick(slide.buttonLink)}
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 bg-black">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover opacity-80"
                  onError={(e) => {
                    e.target.src = "/placeholder.jpg";
                  }}
                />
                <div
                  className={`absolute inset-0 bg-linear-to-r ${slide.backgroundColor}`}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent sm:bg-linear-to-r sm:from-black/80 sm:via-black/50 sm:to-transparent" />
              </div>

              {/* Featured & Rating Badges (Hidden on very small screens to save space) */}
              <div className="hidden sm:flex absolute top-4 right-4 z-10 flex-col gap-2 items-end">
                {slide.isFeatured && (
                  <div className="px-3 py-1 bg-yellow-500/90 backdrop-blur-sm text-white text-[10px] sm:text-xs font-bold rounded-full shadow-sm">
                    ⭐ FEATURED
                  </div>
                )}
                {slide.hasHighRating && slide.rating >= 4 && (
                  <div className="px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white text-[10px] sm:text-xs font-bold rounded-full shadow-sm">
                    ★ {slide.rating.toFixed(1)} RATING
                  </div>
                )}
              </div>

              {/* Slide Content */}
              <div className="relative h-full flex items-end sm:items-center pb-16 sm:pb-0">
                <div className="container mx-auto px-6 sm:px-12 lg:px-16 w-full">
                  <div className="max-w-full sm:max-w-lg md:max-w-xl">
                    {/* Mobile Badges (Shown only on small screens) */}
                    <div className="flex sm:hidden gap-2 mb-3 flex-wrap">
                      {slide.isFeatured && (
                        <span className="px-2 py-0.5 bg-yellow-500/90 text-white text-[10px] font-bold rounded-sm">
                          FEATURED
                        </span>
                      )}
                      {slide.discount > 0 && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-sm">
                          -{slide.discount}%
                        </span>
                      )}
                    </div>

                    {/* Product Badge */}
                    <div className="hidden sm:inline-flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold border border-white/10">
                        {slide.subtitle}
                      </span>
                      {slide.discount > 0 && (
                        <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold shadow-sm">
                          -{slide.discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Product Title */}
                    <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-2 leading-tight drop-shadow-md line-clamp-2">
                      {slide.title}
                    </h1>

                    {/* Product Description */}
                    <p className="text-gray-200 text-xs sm:text-sm md:text-base mb-4 max-w-md line-clamp-2 sm:line-clamp-3 drop-shadow-sm">
                      {slide.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={`sm:w-4 sm:h-4 ${
                              star <= Math.floor(slide.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-400/50"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-white/80 text-xs sm:text-sm font-medium">
                        {slide.rating.toFixed(1)}{" "}
                        <span className="hidden sm:inline">
                          ({slide.reviews} reviews)
                        </span>
                      </span>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                      <div className="flex items-end sm:flex-col sm:items-start gap-3 sm:gap-0">
                        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-md">
                          ₹{slide.price.toLocaleString()}
                        </div>
                        {slide.originalPrice && (
                          <div className="text-gray-300 line-through text-sm font-medium">
                            ₹{slide.originalPrice.toLocaleString()}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSlideClick(slide.buttonLink);
                          }}
                          className="flex-1 sm:flex-none cursor-pointer px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 flex justify-center items-center"
                        >
                          Details
                        </button>
                        <button
                          onClick={(e) =>
                            handleAddToCart(slide.id, slide.title, e)
                          }
                          disabled={slide.stock <= 0 || isAdding}
                          className="flex-2 sm:flex-none cursor-pointer px-4 sm:px-6 py-2.5 sm:py-3 bg-primary hover:bg-primary/90 text-white text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isAdding ? (
                            <Loader size={18} className="animate-spin" />
                          ) : (
                            <ShoppingBag size={18} />
                          )}
                          <span className="whitespace-nowrap">
                            {slide.stock <= 0
                              ? "Out of Stock"
                              : isAdding
                                ? "Adding..."
                                : "Add to Cart"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons (Desktop only) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevSlide();
            }}
            disabled={isTransitioning}
            className={`hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full 
              bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-black/40 
              transition-all duration-300 shadow-xl z-30 cursor-pointer ${
                isTransitioning ? "opacity-50 cursor-not-allowed" : ""
              }`}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextSlide();
            }}
            disabled={isTransitioning}
            className={`hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full 
              bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-black/40 
              transition-all duration-300 shadow-xl z-30 cursor-pointer ${
                isTransitioning ? "opacity-50 cursor-not-allowed" : ""
              }`}
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              disabled={isTransitioning}
              className={`group focus:outline-none cursor-pointer p-1 ${
                isTransitioning ? "cursor-not-allowed" : ""
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              <div className="relative flex items-center justify-center">
                <div
                  className={`rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-4 h-2 sm:w-6 sm:h-2 bg-white"
                      : "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/50 hover:bg-white/80"
                  } ${isTransitioning ? "opacity-50" : ""}`}
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 sm:h-1.5 bg-black/20 z-30">
        <div
          className="h-full bg-primary transition-all duration-4000 ease-linear"
          style={{
            width:
              isAutoPlaying && slides.length > 1 ? `${progressWidth}%` : "0%",
          }}
        />
      </div>

      {/* Slide Counter */}
      <div className="absolute top-4 right-4 sm:top-auto sm:bottom-6 sm:right-6 bg-black/40 backdrop-blur-md text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium z-30 border border-white/10 shadow-sm">
        <span className="tabular-nums">
          {String(currentSlide + 1).padStart(2, "0")} /{" "}
          {String(slides.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};

export default CategorySlider;
