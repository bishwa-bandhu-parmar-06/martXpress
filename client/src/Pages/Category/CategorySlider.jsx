import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingBag,
  Loader,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCategoryTopFeaturedProducts } from "@/API/ProductsApi/productsAPI"; // Adjust path

const CategorySlider = ({ categoryName }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      // console.log(response);
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

  const handleAddToCart = (productId, e) => {
    e.stopPropagation();
    // Add to cart logic
    console.log("Added to cart:", productId);
  };

  // Calculate progress bar width
  const progressWidth =
    slides.length > 0 ? ((currentSlide + 1) / slides.length) * 100 : 0;

  // Don't show slider if loading or error or no slides
  if (loading) {
    return (
      <div className="w-full h-125 md:h-150 flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-2xl mb-8">
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
      <div className="w-full h-125 md:h-150 flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-2xl mb-8">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
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
    <div className="relative w-full h-125 md:h-150 overflow-hidden rounded-2xl shadow-2xl mb-8">
      {/* Category Header Overlay */}
      <div className="absolute top-4 left-4 z-20">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full bg-linear-to-r ${getCategoryGradient(categoryName)} flex items-center justify-center text-white`}
          >
            <ShoppingBag size={24} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">
              {categoryName} Collection
            </h2>
            <p className="text-white/90 text-sm">Featured Products</p>
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
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder.jpg";
                  }}
                />
                <div
                  className={`absolute inset-0 bg-linear-to-r ${slide.backgroundColor}`}
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-transparent" />
              </div>

              {/* Featured & Rating Badges */}
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                {slide.isFeatured && (
                  <div className="px-3 py-1 bg-yellow-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                    ⭐ FEATURED
                  </div>
                )}
                {slide.hasHighRating && slide.rating >= 4 && (
                  <div className="px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                    ★ {slide.rating.toFixed(1)} RATING
                  </div>
                )}
              </div>

              {/* Slide Content */}
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-8 md:px-12 lg:px-16">
                  <div className="max-w-lg md:max-w-xl">
                    {/* Product Badge */}
                    <div className="inline-flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold">
                        {slide.subtitle}
                      </span>
                      {slide.discount > 0 && (
                        <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                          -{slide.discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Product Title */}
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                      {slide.title}
                    </h1>

                    {/* Product Description */}
                    <p className="text-white/90 text-sm md:text-base mb-4 max-w-md">
                      {slide.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={`${
                              star <= Math.floor(slide.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-white/80 text-sm">
                        {slide.rating.toFixed(1)} ({slide.reviews} reviews)
                      </span>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center gap-6">
                      <div>
                        <div className="text-3xl md:text-4xl font-bold text-white">
                          ₹{slide.price.toLocaleString()}
                        </div>
                        {slide.originalPrice && (
                          <div className="text-white/60 line-through">
                            ₹{slide.originalPrice.toLocaleString()}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSlideClick(slide.buttonLink);
                          }}
                          className=" cursor-pointer px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 
                            transition-all duration-300 hover:shadow-lg"
                        >
                          View Details
                        </button>
                        <button
                          onClick={(e) => handleAddToCart(slide.id, e)}
                          className="cursor-pointer px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg 
                            transition-all duration-300 hover:shadow-lg flex items-center gap-2"
                        >
                          <ShoppingBag size={18} />
                          Add to Cart
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

      {/* Navigation Buttons (only show if multiple slides) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrevSlide}
            disabled={isTransitioning}
            className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full 
              bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 
              transition-all duration-300 shadow-lg z-30 ${
                isTransitioning ? "opacity-50 cursor-not-allowed" : ""
              }`}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNextSlide}
            disabled={isTransitioning}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full 
              bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 
              transition-all duration-300 shadow-lg z-30 ${
                isTransitioning ? "opacity-50 cursor-not-allowed" : ""
              }`}
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Slide Indicators (only show if multiple slides) */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`group focus:outline-none ${
                isTransitioning ? "cursor-not-allowed" : ""
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              <div className="relative">
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-white scale-125"
                      : "bg-white/50 hover:bg-white/80"
                  } ${isTransitioning ? "opacity-50" : ""}`}
                />
                {index === currentSlide && (
                  <div className="absolute inset-0 animate-ping rounded-full bg-white/30" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
        <div
          className="h-full bg-linear-to-r from-primary to-secondary transition-all duration-4000 ease-linear"
          style={{
            width:
              isAutoPlaying && slides.length > 1 ? `${progressWidth}%` : "0%",
          }}
        />
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-4 right-4 bg-black/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium z-30">
        <span className="tabular-nums">
          {String(currentSlide + 1).padStart(2, "0")} /{" "}
          {String(slides.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};

export default CategorySlider;
