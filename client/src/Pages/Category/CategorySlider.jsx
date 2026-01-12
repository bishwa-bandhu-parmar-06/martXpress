import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CategorySlider = ({ categoryData, categoryName }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Generate slides from category products (top 3-4 products)
  const generateSlidesFromCategory = () => {
    if (!categoryData?.products) return [];
    
    const topProducts = categoryData.products
      .sort((a, b) => b.price - a.price) // Sort by price (highest first)
      .slice(0, 4); // Take top 4 products
    
    return topProducts.map((product, index) => ({
      id: product.id,
      image: product.image,
      title: product.name,
      subtitle: `Best Seller #${index + 1}`,
      description: `Premium ${categoryName.toLowerCase()} product with excellent quality`,
      price: product.price,
      originalPrice: Math.round(product.price * 1.2), // Add 20% for original price
      discount: 20,
      rating: 4.5,
      reviews: 42 + index * 10,
      buttonText: "Shop Now",
      buttonLink: `/product/${product.id}`,
      categoryLink: `/category/${categoryName.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`,
      backgroundColor: getCategoryGradient(categoryName),
      textColor: "text-white",
    }));
  };

  // Get category-specific gradient
  const getCategoryGradient = (category) => {
    const gradients = {
      "Fashion": "from-pink-500/30 to-rose-500/30",
      "Electronics": "from-blue-500/30 to-indigo-500/30",
      "TV & Appliances": "from-purple-500/30 to-violet-500/30",
      "Mobiles & Tablets": "from-cyan-500/30 to-blue-500/30",
      "Home & Furniture": "from-emerald-500/30 to-teal-500/30",
      "Beauty & Personal Care": "from-rose-500/30 to-pink-500/30",
      "Grocery": "from-green-500/30 to-emerald-500/30",
      "default": "from-primary/30 to-secondary/30"
    };
    
    return gradients[category] || gradients.default;
  };

  const slides = generateSlidesFromCategory();
  
  // Don't show slider if no slides
  if (slides.length === 0) return null;

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isAutoPlaying && slides.length > 1) {
      interval = setInterval(() => {
        handleNextSlide();
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

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

  return (
    <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-2xl shadow-2xl mb-8">
      {/* Category Header Overlay */}
      <div className="absolute top-4 left-4 z-20">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full bg-linear-to-r ${getCategoryGradient(categoryName)} flex items-center justify-center text-white`}>
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

      {/* View All Button
      <button
        onClick={() => navigate(slides[0]?.categoryLink || "/")}
        className="absolute top-4 right-4 z-20 px-4 py-2 bg-white/20 backdrop-blur-sm 
          text-white rounded-lg hover:bg-white/30 transition-colors duration-300 text-sm font-medium"
      >
        View All →
      </button> */}

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
          } else if (index === (currentSlide - 1 + slides.length) % slides.length) {
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
                />
                <div className={`absolute inset-0 bg-linear-to-r ${slide.backgroundColor}`} />
                <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-transparent" />
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
                      {slide.discount && (
                        <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                          -{slide.discount}%
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
                            className={`${star <= slide.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-white/80 text-sm">
                        ({slide.reviews} reviews)
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
                          className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 
                            transition-all duration-300 hover:shadow-lg"
                        >
                          View Details
                        </button>
                        <button
                          onClick={(e) => handleAddToCart(slide.id, e)}
                          className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg 
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
            width: isAutoPlaying && slides.length > 1
              ? `${((currentSlide + 1) / slides.length) * 100}%`
              : "0%",
          }}
        />
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-4 right-4 bg-black/30 backdrop-blur-sm 
        text-white px-4 py-2 rounded-full text-sm font-medium z-30">
        <span className="tabular-nums">
          {String(currentSlide + 1).padStart(2, "0")} /{" "}
          {String(slides.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};

export default CategorySlider;