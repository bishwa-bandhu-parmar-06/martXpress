import { useDispatch, useSelector } from "react-redux"; // Added useSelector
import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Share2,
  ShoppingBag,
  Zap,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { toCategorySlug } from "../../utils/categorySlug";
import { addProductToCart } from "../../API/Cart/getAllCartProductApi.js";
import { setCartQuantity } from "../../Features/Cart/CartSlice.js";
import { 
  addProductToWishList, 
  removeASingleWishlistProduct 
} from "../../API/Cart/wishListApi.js"; // Import remove function
import { 
  addToWishlistRedux, 
  removeFromWishlistRedux 
} from "../../Features/Cart/WishlistSlice"; // Import Redux actions

const CATEGORY_STYLE_MAP = {
  Fashion: {
    icon: "👗",
    color: "from-pink-500 to-rose-500",
    bgColor: "from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20",
  },
  Electronics: {
    icon: "💻",
    color: "from-blue-500 to-indigo-500",
    bgColor: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
  },
  "TV & Appliances": {
    icon: "📺",
    color: "from-purple-500 to-violet-500",
    bgColor: "from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20",
  },
  "Mobiles & Tablets": {
    icon: "📱",
    color: "from-cyan-500 to-blue-500",
    bgColor: "from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20",
  },
  "Home & Furniture": {
    icon: "🏠",
    color: "from-emerald-500 to-teal-500",
    bgColor: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
  },
  "Beauty & Personal Care": {
    icon: "💄",
    color: "from-rose-500 to-pink-500",
    bgColor: "from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20",
  },
  Grocery: {
    icon: "🛒",
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
  },
};

const CategoryProducts = ({ categoryName, dbProducts = [], totalCount = 0 }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get wishlisted IDs from Redux for global consistency
  const wishlistedIds = useSelector((state) => state.wishlist.wishlistItems);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(6);
  const [addingToCart, setAddingToCart] = useState({});

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(2);
      else if (window.innerWidth < 1024) setItemsPerView(3);
      else if (window.innerWidth < 1280) setItemsPerView(4);
      else setItemsPerView(6);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const safeCategoryName = categoryName || "Fashion";
  const style = CATEGORY_STYLE_MAP[safeCategoryName] || {
    icon: "📦",
    color: "from-gray-500 to-slate-500",
    bgColor: "bg-gray-100 dark:bg-gray-800",
  };

  const products = dbProducts;
  const totalSlides = products.length > itemsPerView ? products.length - itemsPerView + 2 : 1;
  const canSlide = products.length > itemsPerView;
  const colorClass = style.color.replace("linear", "gradient");

  const scrollLeft = () => {
    if (currentIndex > 0 && !isTransitioning && canSlide) {
      setIsTransitioning(true);
      setTimeout(() => { setCurrentIndex(currentIndex - 1); setIsTransitioning(false); }, 300);
    }
  };

  const scrollRight = () => {
    if (currentIndex < totalSlides - 1 && !isTransitioning && canSlide) {
      setIsTransitioning(true);
      setTimeout(() => { setCurrentIndex(currentIndex + 1); setIsTransitioning(false); }, 300);
    }
  };

  const handleProductClick = (product) => navigate(`/product/${product._id}`);

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    if (product.stock <= 0) return toast.error("Product is out of stock");
    try {
      setAddingToCart((prev) => ({ ...prev, [product._id]: true }));
      const response = await addProductToCart({ productId: product._id, quantity: 1 });
      if (response?.success) {
        toast.success(`${product.name} added to cart!`);
        dispatch(setCartQuantity(response.cart.totalQuantity));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setAddingToCart((prev) => ({ ...prev, [product._id]: false }));
    }
  };

  const handleBuyNow = (e, product) => {
    e.stopPropagation();
    if (product.stock <= 0) return toast.error("Product is out of stock");
    navigate("/checkout", { state: { buyNowProduct: [{ product, quantity: 1 }] } });
  };

  const handleWishlistToggle = async (e, productId) => {
    e.stopPropagation();
    const isCurrentlyWishlisted = wishlistedIds.includes(productId);

    try {
      if (isCurrentlyWishlisted) {
        // REMOVE LOGIC
        const response = await removeASingleWishlistProduct(productId);
        if (response?.success) {
          dispatch(removeFromWishlistRedux(productId));
          toast.info("Removed from wishlist");
        }
      } else {
        // ADD LOGIC
        const response = await addProductToWishList(productId);
        if (response?.success || response?.message === "Added to wishlist") {
          dispatch(addToWishlistRedux(productId));
          toast.success("Added to wishlist ❤️");
        }
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const handleShare = async (e, product) => {
    e.stopPropagation();
    const productUrl = `${window.location.origin}/product/${product._id}`;
    if (navigator.share) {
      try { await navigator.share({ title: product.name, url: productUrl }); } catch (err) {}
    } else {
      navigator.clipboard.writeText(productUrl);
      toast.success("Link copied!");
    }
  };

  const handleViewAll = () => {
    const categorySlug = toCategorySlug(safeCategoryName);
    navigate(`/category/${categorySlug}`, { state: { categoryName: safeCategoryName } });
  };

  return (
    <div className={`px-4 sm:px-6 md:px-12 lg:px-20 py-6 sm:py-8 bg-linear-to-r ${style.bgColor} dark:bg-gray-900 border border-gray-200 dark:border-gray-800 mb-6 rounded-2xl relative overflow-hidden transition-colors duration-300`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-2xl bg-linear-to-r ${colorClass} text-white shadow-lg`}>{style.icon}</div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{safeCategoryName}</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{totalCount} products available</p>
          </div>
        </div>
        <button onClick={handleViewAll} className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-100 transition-all border border-gray-300 dark:border-gray-700 flex items-center gap-2 cursor-pointer shadow-sm">
          <span>View All</span>
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="relative group/slider">
        {canSlide && currentIndex > 0 && (
          <button onClick={scrollLeft} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg flex items-center justify-center z-20 cursor-pointer hover:scale-110 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <ChevronLeft size={24} className="text-gray-800 dark:text-gray-200" />
          </button>
        )}

        <div className="overflow-hidden px-1 py-2">
          <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}>
            {products.map((product) => {
              const isAdding = addingToCart[product._id];
              const isWishlisted = wishlistedIds.includes(product._id);

              return (
                <div key={product._id} onClick={() => handleProductClick(product)} className="shrink-0 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 group/card flex flex-col mx-2" style={{ width: `calc(${100 / itemsPerView}% - 16px)` }}>
                  <div className="h-36 sm:h-48 overflow-hidden bg-gray-50 dark:bg-gray-900 relative">
                    <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-contain p-2 mix-blend-multiply dark:mix-blend-normal group-hover/card:scale-105 transition-transform duration-500" />
                    
                    {/* HEART TOGGLE */}
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                      <button
                        onClick={(e) => handleWishlistToggle(e, product._id)}
                        className="p-1.5 sm:p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-sm cursor-pointer transition-all hover:scale-110"
                      >
                        <Heart
                          size={16}
                          fill={isWishlisted ? "#ef4444" : "none"}
                          className={isWishlisted ? "text-red-500" : "text-gray-600 dark:text-gray-300"}
                        />
                      </button>
                      <button onClick={(e) => handleShare(e, product)} className="p-1.5 sm:p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full text-gray-600 dark:text-gray-300 shadow-sm cursor-pointer hover:text-primary"><Share2 size={16} /></button>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 flex flex-col flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-2 text-xs sm:text-sm h-8 sm:h-10">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-yellow-400">★ {(product.averageRating || 0).toFixed(1)}</span>
                      <span className="text-[10px] sm:text-xs text-gray-500">({product.totalRatings || 0})</span>
                    </div>
                    <div className="flex items-end gap-2 mb-3 mt-auto">
                      <span className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">₹{(product.finalPrice || product.price).toLocaleString()}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={(e) => handleAddToCart(e, product)} disabled={isAdding || product.stock <= 0} className="flex items-center justify-center gap-1 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-[10px] sm:text-xs font-semibold cursor-pointer">
                        <ShoppingBag size={14} className="hidden sm:block" /> {isAdding ? "..." : "Cart"}
                      </button>
                      <button onClick={(e) => handleBuyNow(e, product)} disabled={product.stock <= 0} className="flex items-center justify-center gap-1 py-1.5 bg-primary text-white rounded-md text-[10px] sm:text-xs font-semibold cursor-pointer shadow-sm">
                        <Zap size={14} className="hidden sm:block" /> Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {canSlide && currentIndex < totalSlides - 1 && (
          <button onClick={scrollRight} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg flex items-center justify-center z-20 cursor-pointer hover:scale-110 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <ChevronRight size={24} className="text-gray-800 dark:text-gray-200" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;