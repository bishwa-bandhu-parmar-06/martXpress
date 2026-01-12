import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Slider = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Slide data with images, titles, descriptions, and actions
  const slides = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Summer Collection 2024",
      subtitle: "Up to 50% Off",
      description:
        "Discover the latest fashion trends with our exclusive summer collection",
      buttonText: "Shop Now",
      buttonLink: "/category/fashion",
      backgroundColor: "from-blue-500/20 to-purple-500/20",
      textColor: "text-blue-900 dark:text-blue-100",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Premium Electronics",
      subtitle: "New Arrivals",
      description: "Cutting-edge technology for your everyday life",
      buttonText: "Explore Gadgets",
      buttonLink: "/category/electronics",
      backgroundColor: "from-red-500/20 to-orange-500/20",
      textColor: "text-red-900 dark:text-red-100",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Home & Living",
      subtitle: "Comfort Redefined",
      description: "Transform your space with our premium home collection",
      buttonText: "Browse Collection",
      buttonLink: "/category/home-living",
      backgroundColor: "from-green-500/20 to-teal-500/20",
      textColor: "text-green-900 dark:text-green-100",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Flash Sale",
      subtitle: "Limited Time Offer",
      description: "Don't miss out on our biggest sale of the season",
      buttonText: "Shop Sale",
      buttonLink: "/sale",
      backgroundColor: "from-yellow-500/20 to-pink-500/20",
      textColor: "text-yellow-900 dark:text-yellow-100",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Free Shipping",
      subtitle: "On Orders Over ₹999",
      description: "Enjoy free delivery on all orders above ₹999",
      buttonText: "Learn More",
      buttonLink: "/shipping",
      backgroundColor: "from-indigo-500/20 to-purple-500/20",
      textColor: "text-indigo-900 dark:text-indigo-100",
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        handleNextSlide();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleNextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const handlePrevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const handleSlideClick = (link) => {
    navigate(link);
  };

  return (
    <div className="relative w-full h-[200px] md:h-[200px] lg:h-[500px] overflow-hidden mx-auto shadow-2xl">
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
                    {/* Badge */}
                    <div className="inline-block mb-2 lg:mb-4">
                      <span className="px-3 py-1 lg:px-4 lg:py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs lg:text-sm font-semibold">
                        {slide.subtitle}
                      </span>
                    </div>

                    {/* Title - Responsive sizing */}
                    <h1
                      className={`text-xl md:text-2xl lg:text-4xl xl:text-6xl font-bold mb-2 lg:mb-4 ${slide.textColor}`}
                    >
                      {slide.title}
                    </h1>

                    {/* Description - Hide on very small screens */}
                    <p className="hidden md:block text-sm lg:text-lg text-gray-100 mb-4 lg:mb-8 max-w-md lg:max-w-xl">
                      {slide.description}
                    </p>

                    {/* CTA Button - Responsive sizing */}
                    <button
                      onClick={() => handleSlideClick(slide.buttonLink)}
                      className="group cursor-pointer relative px-4 py-2 lg:px-8 lg:py-4 bg-linear-to-r from-primary to-secondary 
                        text-white font-semibold rounded-lg lg:rounded-xl hover:shadow-xl 
                        transition-all duration-300 transform hover:-translate-y-0.5 lg:hover:-translate-y-1 
                        overflow-hidden text-sm lg:text-base"
                    >
                      <span className="relative z-10 flex items-center gap-2 lg:gap-3">
                        {slide.buttonText}
                        <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 lg:group-hover:translate-x-2 transition-transform" />
                      </span>
                      <div
                        className="absolute inset-0 bg-linear-to-r from-secondary to-primary opacity-0 
                        group-hover:opacity-100 transition-opacity duration-300"
                      />
                    </button>

                    {/* Additional Info - Hide on small screens */}
                    <div className="hidden lg:flex mt-6 items-center gap-6 text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-sm">Limited Time Offer</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                        <span className="text-sm">Free Shipping</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons - Responsive sizing */}
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

      {/* Slide Indicators - Responsive positioning */}
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

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
        <div
          className="h-full bg-linear-to-r from-primary to-secondary transition-all duration-500 ease-linear"
          style={{
            width: isAutoPlaying
              ? `${((currentSlide + 1) / slides.length) * 100}%`
              : "0%",
          }}
        />
      </div>

      {/* Slide Counter - Hide on small screens */}
      <div
        className="hidden md:block absolute bottom-4 right-4 bg-black/30 backdrop-blur-sm 
        text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium z-30"
      >
        <span className="tabular-nums">
          {String(currentSlide + 1).padStart(2, "0")} /{" "}
          {String(slides.length).padStart(2, "0")}
        </span>
      </div>

      {/* Decorative Elements - Hide on small screens */}
      <div className="hidden lg:block absolute top-0 left-0 w-64 h-64 bg-linear-to-br from-primary/20 to-transparent rounded-full -translate-x-32 -translate-y-32 blur-3xl" />
      <div className="hidden lg:block absolute bottom-0 right-0 w-96 h-96 bg-linear-to-tl from-secondary/20 to-transparent rounded-full translate-x-32 translate-y-32 blur-3xl" />
    </div>
  );
};

export default Slider;
