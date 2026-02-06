import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchHeroSliderProducts } from "@/API/ProductsApi/productsAPI";

const Slider = () => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to map product data to slide format
  const mapProductToSlide = (productData) => {
    const { product, categoryName } = productData;

    // Create different color schemes based on category
    const categoryColorSchemes = {
      "Mobiles & Tablets": {
        backgroundColor: "from-blue-500/20 to-purple-500/20",
        textColor: "text-blue-900 dark:text-blue-100",
        badgeColor: "bg-blue-500/20",
      },
      "Beauty & Personal Care": {
        backgroundColor: "from-pink-500/20 to-rose-500/20",
        textColor: "text-pink-900 dark:text-pink-100",
        badgeColor: "bg-pink-500/20",
      },
      Electronics: {
        backgroundColor: "from-red-500/20 to-orange-500/20",
        textColor: "text-red-900 dark:text-red-100",
        badgeColor: "bg-red-500/20",
      },
      Fashion: {
        backgroundColor: "from-green-500/20 to-teal-500/20",
        textColor: "text-green-900 dark:text-green-100",
        badgeColor: "bg-green-500/20",
      },
      "Home & Furniture": {
        backgroundColor: "from-amber-500/20 to-yellow-500/20",
        textColor: "text-amber-900 dark:text-amber-100",
        badgeColor: "bg-amber-500/20",
      },
      Grocery: {
        backgroundColor: "from-emerald-500/20 to-green-500/20",
        textColor: "text-emerald-900 dark:text-emerald-100",
        badgeColor: "bg-emerald-500/20",
      },
    };

    const colorScheme = categoryColorSchemes[categoryName] || {
      backgroundColor: "from-indigo-500/20 to-purple-500/20",
      textColor: "text-indigo-900 dark:text-indigo-100",
      badgeColor: "bg-indigo-500/20",
    };

    return {
      id: product._id,
      image: product.images[0],
      title: product.name,
      subtitle: product.brand,
      category: categoryName,
      description: product.description,
      price: product.price,
      discount: product.discount,
      finalPrice: product.finalPrice,
      rating: product.averageRating,
      stock: product.stock,
      buttonText: "View Product",
      buttonLink: `/product/${product._id}`,
      backgroundColor: colorScheme.backgroundColor,
      textColor: colorScheme.textColor,
      badgeColor: colorScheme.badgeColor,
      tags: product.tags,
      featured: product.featured,
    };
  };

  useEffect(() => {
    const loadSlides = async () => {
      try {
        setLoading(true);
        // console.log("Fetching hero slider products...");

        const response = await fetchHeroSliderProducts();
        // console.log("Full API Response:", response);

        // IMPORTANT: Check the actual response structure
        // Based on your logs, it's {success: true, data: [...]}
        if (response && response.success) {
          // console.log("Response data received:", response.data);

          // Access the data directly from response.data
          const productsData = response.data;
          // console.log("Products data:", productsData);

          if (!productsData || !Array.isArray(productsData)) {
            console.error("productsData is not an array:", productsData);
            setSlides([]);
            return;
          }

          // Check if there are any featured products
          const featuredProducts = productsData.filter((item) => {
            // Debug: Log each item to check structure
            // console.log("Product item:", item);
            // console.log("Is featured?", item.product?.featured);
            return item.product?.featured === true;
          });

          // console.log(
          //   "Featured products found:",
          //   featuredProducts.length,
          //   featuredProducts,
          // );

          // Always use products even if no featured ones
          let productsToUse = [];

          if (featuredProducts.length > 0) {
            productsToUse = featuredProducts;
            // console.log("Using featured products");
          } else {
            // If no featured products, use all products
            productsToUse = productsData.slice(0, 5); // Limit to 5 slides
            // console.log("Using all products (no featured)");
          }

          // Map products to slide format
          const mappedSlides = productsToUse.map(mapProductToSlide);
          // console.log("Mapped slides:", mappedSlides);
          setSlides(mappedSlides);
        } else {
          console.error(
            "Invalid response structure - no success flag:",
            response,
          );
          // Fallback to showing all products if response doesn't have success flag
          if (response && Array.isArray(response)) {
            // console.log("Response is an array, using as products data");
            const productsToUse = response.slice(0, 5);
            const mappedSlides = productsToUse.map(mapProductToSlide);
            setSlides(mappedSlides);
          }
        }
      } catch (error) {
        console.error("Error loading slider products:", error);
        console.error("Error details:", error.message, error.stack);
      } finally {
        setLoading(false);
      }
    };

    loadSlides();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isAutoPlaying && slides.length > 0) {
      interval = setInterval(() => {
        handleNextSlide();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const handleNextSlide = () => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const handlePrevSlide = () => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide || slides.length === 0)
      return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const handleSlideClick = (link) => {
    navigate(link);
  };

  // Debug: Log current slides state
  useEffect(() => {
    // ("Current slides state:", slides);
    // console.log("Slides length:", slides.length);
  }, [slides]);

  // Show loading state
  if (loading) {
    return (
      <div className="relative w-full h-50 md:h-50 lg:h-125 overflow-hidden mx-auto shadow-2xl animate-pulse">
        <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading featured products...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (slides.length === 0) {
    return (
      <div className="relative w-full h-50 md:h-50 lg:h-125 overflow-hidden mx-auto shadow-2xl">
        <div className="w-full h-full bg-linear-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
          <div className="text-center p-8">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Could not load products. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
            >
              Refresh Pageconsole.log
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-50 md:h-50 lg:h-125 overflow-hidden mx-auto shadow-2xl">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => {
          let translateX = "0%";

          if (index < currentSlide) {
            translateX = "-100%"; // Slide to left
          } else if (index > currentSlide) {
            translateX = "100%"; // Slide to right
          }

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out`}
              style={{
                transform: `translateX(${translateX})`,
                opacity: index === currentSlide ? 1 : 0,
                zIndex:
                  index === currentSlide ? 10 : index < currentSlide ? 5 : 1,
              }}
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    console.error(`Failed to load image: ${slide.image}`);
                    e.target.src =
                      "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";
                  }}
                />
                <div
                  className={`absolute inset-0 bg-linear-to-r ${slide.backgroundColor}`}
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/40 via-black/20 to-transparent" />
              </div>

              {/* Slide Content - Responsive for smaller height */}
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-4 md:px-8 lg:px-12">
                  <div className="max-w-xl lg:max-w-2xl">
                    {/* Category Badge with Featured tag */}
                    <div className="inline-flex items-center gap-2 mb-2 lg:mb-4">
                      <span
                        className={`px-3 py-1 lg:px-4 lg:py-2 ${slide.badgeColor} backdrop-blur-sm text-white rounded-full text-xs lg:text-sm font-semibold`}
                      >
                        {slide.category}
                      </span>
                      {slide.featured && (
                        <span className="px-2 py-1 bg-yellow-500/20 backdrop-blur-sm text-yellow-200 rounded-full text-xs lg:text-sm font-semibold">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Product Title - Responsive sizing */}
                    <h1
                      className={`text-xl md:text-2xl lg:text-4xl xl:text-6xl font-bold mb-2 lg:mb-4 ${slide.textColor}`}
                    >
                      {slide.title}
                    </h1>

                    {/* Product Description - Hide on very small screens */}
                    <p className="hidden md:block text-sm lg:text-lg text-gray-100 mb-4 lg:mb-8 max-w-md lg:max-w-xl line-clamp-2">
                      {slide.description}
                    </p>

                    {/* Price and Rating Info */}
                    <div className="flex flex-wrap items-center gap-4 mb-4 lg:mb-8">
                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="text-lg lg:text-2xl font-bold text-white">
                          ₹
                          {slide.finalPrice?.toLocaleString() ||
                            slide.price?.toLocaleString()}
                        </span>
                        {slide.discount > 0 && (
                          <>
                            <span className="text-sm lg:text-lg line-through text-gray-300">
                              ₹{slide.price?.toLocaleString()}
                            </span>
                            <span className="px-2 py-1 bg-red-500/20 text-red-200 text-xs lg:text-sm rounded-full">
                              {slide.discount}% OFF
                            </span>
                          </>
                        )}
                      </div>

                      {/* Brand */}
                      <div className="text-sm lg:text-base text-gray-300">
                        by {slide.subtitle}
                      </div>

                      {/* Rating - Show only if rating exists */}
                      {slide.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 lg:w-5 lg:h-5 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm lg:text-base text-white font-medium">
                            {slide.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Stock Info */}
                    <div className="hidden lg:flex items-center gap-2 mb-4">
                      <div
                        className={`w-2 h-2 rounded-full ${slide.stock > 10 ? "bg-green-400" : slide.stock > 0 ? "bg-yellow-400" : "bg-red-400"}`}
                      />
                      <span className="text-sm text-gray-200">
                        {slide.stock > 10
                          ? "In Stock"
                          : slide.stock > 0
                            ? `Only ${slide.stock} left`
                            : "Out of Stock"}
                      </span>
                    </div>

                    {/* CTA Button - Responsive sizing */}
                    <button
                      onClick={() => handleSlideClick(slide.buttonLink)}
                      disabled={slide.stock === 0}
                      className={`group relative px-4 py-2 lg:px-8 lg:py-4 bg-linear-to-r from-primary to-secondary 
                        text-white font-semibold rounded-lg lg:rounded-xl hover:shadow-xl 
                        transition-all duration-300 transform hover:-translate-y-0.5 lg:hover:-translate-y-1 
                        overflow-hidden text-sm lg:text-base ${slide.stock === 0 ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <span className="relative z-10 flex items-center gap-2 lg:gap-3">
                        {slide.stock === 0 ? "Out of Stock" : slide.buttonText}
                        {slide.stock > 0 && (
                          <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 lg:group-hover:translate-x-2 transition-transform" />
                        )}
                      </span>
                      <div
                        className="absolute inset-0 bg-linear-to-r from-secondary to-primary opacity-0 
                        group-hover:opacity-100 transition-opacity duration-300"
                      />
                    </button>

                    {/* Product Tags - Hide on small screens */}
                    <div className="hidden lg:flex flex-wrap gap-2 mt-6">
                      {slide.tags &&
                        slide.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons - Show only if we have slides */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrevSlide}
            disabled={isTransitioning}
            className={`absolute cursor-pointer left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full 
              bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 
              transition-all duration-300 transform hover:-translate-x-0.5 md:hover:-translate-x-1 
              active:scale-95 shadow-lg z-30 ${
                isTransitioning ? "opacity-50 cursor-not-allowed" : ""
              }`}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={handleNextSlide}
            disabled={isTransitioning}
            className={`absolute cursor-pointer right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full 
              bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 
              transition-all duration-300 transform hover:translate-x-0.5 md:hover:translate-x-1 
              active:scale-95 shadow-lg z-30 ${
                isTransitioning ? "opacity-50 cursor-not-allowed" : ""
              }`}
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </>
      )}

      {/* Auto-play Toggle - Responsive positioning */}
      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute cursor-pointer top-2 md:top-4 right-2 md:right-4 p-2 md:p-3 rounded-full 
          bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 
          transition-all duration-300 z-30"
        aria-label={isAutoPlaying ? "Pause autoplay" : "Play autoplay"}
      >
        {isAutoPlaying ? (
          <Pause className="w-4 h-4 md:w-5 md:h-5" />
        ) : (
          <Play className="w-4 h-4 md:w-5 md:h-5" />
        )}
      </button>

      {/* Slide Indicators - Show only if we have multiple slides */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-30">
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
                {/* Background circle */}
                <div
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-white scale-125"
                      : "bg-white/50 hover:bg-white/80"
                  } ${isTransitioning ? "opacity-50" : ""}`}
                />
                {/* Active indicator animation */}
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
          className="h-full bg-linear-to-r from-primary to-secondary transition-all duration-500 ease-linear"
          style={{
            width:
              isAutoPlaying && slides.length > 0
                ? `${((currentSlide + 1) / slides.length) * 100}%`
                : "0%",
          }}
        />
      </div>

      {/* Slide Counter - Hide on small screens */}
      {slides.length > 0 && (
        <div
          className="hidden md:block absolute bottom-4 right-4 bg-black/30 backdrop-blur-sm 
            text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium z-30"
        >
          <span className="tabular-nums">
            {String(currentSlide + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>
      )}

      {/* Decorative Elements - Hide on small screens */}
      <div className="hidden lg:block absolute top-0 left-0 w-64 h-64 bg-linear-to-br from-primary/20 to-transparent rounded-full -translate-x-32 -translate-y-32 blur-3xl" />
      <div className="hidden lg:block absolute bottom-0 right-0 w-96 h-96 bg-linear-to-tl from-secondary/20 to-transparent rounded-full translate-x-32 translate-y-32 blur-3xl" />
    </div>
  );
};

export default Slider;
