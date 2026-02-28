import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Added useSelector
import { toast } from "sonner";
import CategorySlider from "../../Pages/Category/CategorySlider";
import {
  ChevronLeft,
  Star,
  Loader,
  ShoppingBag,
  Zap,
  Heart,
} from "lucide-react";

// API & Redux Imports
import { getProductsByBrand } from "../../API/Common/brandsApi";
import { addProductToCart } from "../../API/Cart/getAllCartProductApi.js";
import { 
  addProductToWishList, 
  removeASingleWishlistProduct 
} from "../../API/Cart/wishListApi.js"; // Import wishlist APIs
import { setCartQuantity as setGlobalCartQuantity } from "../../Features/Cart/CartSlice.js";
import { 
  addToWishlistRedux, 
  removeFromWishlistRedux 
} from "../../Features/Cart/WishlistSlice"; // Import wishlist actions

const BrandPage = () => {
  const { brandSlug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get global wishlisted IDs from Redux
  const wishlistedIds = useSelector((state) => state.wishlist.wishlistItems);

  const [brandName, setBrandName] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track loading state for individual buttons
  const [addingToCart, setAddingToCart] = useState({});

  const productsPerPage = 12;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!brandSlug) return;

    const formattedBrand = brandSlug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    setBrandName(formattedBrand);
    fetchAllBrandProducts(formattedBrand);
  }, [brandSlug]);

  const fetchAllBrandProducts = useCallback(async (brand) => {
    try {
      setLoading(true);
      setError(null);
      const firstRes = await getProductsByBrand(brand, 1, productsPerPage);

      if (!firstRes?.products || firstRes.products.length === 0) {
        setError("No products found for this brand");
        return;
      }

      const totalPages = firstRes.totalPages || 1;
      let all = [...firstRes.products];

      if (totalPages > 1) {
        const promises = [];
        for (let p = 2; p <= totalPages; p++) {
          promises.push(getProductsByBrand(brand, p, productsPerPage));
        }
        const responses = await Promise.all(promises);
        responses.forEach((r) => {
          if (r?.products) all.push(...r.products);
        });
      }

      setAllProducts(all);

      const featured = all
        .filter((p) => p.images?.length && (p.featured || (p.averageRating || 0) >= 4))
        .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
        .slice(0, 4);

      setFeaturedProducts(featured);
    } catch (err) {
      setError("Failed to load brand products");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleBack = () => {
    window.history.length > 1 ? navigate(-1) : navigate("/brands");
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`, {
      state: { productData: { ...product, category: brandName } },
    });
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    if (product.stock <= 0) return toast.error("Product is out of stock");

    try {
      setAddingToCart((prev) => ({ ...prev, [product._id]: true }));
      const response = await addProductToCart({ productId: product._id, quantity: 1 });
      if (response?.success) {
        dispatch(setGlobalCartQuantity(response.cart.totalQuantity));
        toast.success(`${product.name} added to cart!`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setAddingToCart((prev) => ({ ...prev, [product._id]: false }));
    }
  };

  const handleBuyNow = (e, product) => {
    e.stopPropagation();
    if (product.stock <= 0) return toast.error("Out of stock");
    navigate("/checkout", { state: { buyNowProduct: [{ product, quantity: 1 }] } });
  };

  // --- WISHLIST TOGGLE LOGIC ---
  const handleWishlistToggle = async (e, productId) => {
    e.stopPropagation();
    const isCurrentlyWishlisted = wishlistedIds.includes(productId);

    try {
      if (isCurrentlyWishlisted) {
        // REMOVE FROM WISHLIST
        const response = await removeASingleWishlistProduct(productId);
        if (response?.success) {
          dispatch(removeFromWishlistRedux(productId));
          toast.info("Removed from wishlist");
        }
      } else {
        // ADD TO WISHLIST
        const response = await addProductToWishList(productId);
        if (response?.success || response?.message === "Added to wishlist") {
          dispatch(addToWishlistRedux(productId));
          toast.success("Added to wishlist ❤️");
        }
      }
    } catch (error) {
      toast.error("Wishlist update failed. Please login.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12 transition-colors duration-300">
      <div className="sticky top-0 z-40 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button onClick={handleBack} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
            <ChevronLeft size={24} className="text-gray-700 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{brandName}</h1>
            <p className="text-sm text-gray-500">{loading ? "Loading..." : `${allProducts.length} products`}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {error ? (
          <div className="text-center py-20 text-red-500 font-medium">{error}</div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="animate-spin w-12 h-12 text-primary mb-4" />
            <p className="text-gray-500">Loading {brandName} collection...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allProducts.map((product) => {
              const isAdding = addingToCart[product._id];
              const isWishlisted = wishlistedIds.includes(product._id);

              return (
                <div key={product._id} onClick={() => handleProductClick(product)} className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 overflow-hidden relative cursor-pointer flex flex-col h-full">
                  <div className="relative h-56 sm:h-64 overflow-hidden bg-gray-50 dark:bg-gray-900 shrink-0">
                    <img src={product.images?.[0] || "/placeholder.jpg"} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal" />
                    
                    {/* HEART ICON BUTTON */}
                    <button
                      onClick={(e) => handleWishlistToggle(e, product._id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-700/90 rounded-full shadow-sm z-10 hover:scale-110 transition-all cursor-pointer"
                    >
                      <Heart
                        size={18}
                        fill={isWishlisted ? "#ef4444" : "none"}
                        className={isWishlisted ? "text-red-500" : "text-gray-400"}
                      />
                    </button>

                    {product.discount > 0 && <span className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded shadow-sm">-{product.discount}%</span>}
                    {product.stock <= 0 && <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10"><span className="px-4 py-2 bg-gray-900 text-white font-bold text-sm rounded-lg">Out of Stock</span></div>}
                  </div>

                  <div className="p-5 flex flex-col grow">
                    <span className="text-[10px] text-primary font-bold uppercase tracking-widest">{product.brand}</span>
                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 mt-1">{product.name}</h3>
                    
                    <div className="flex items-center gap-1 my-3">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-bold dark:text-gray-300">{(product.averageRating || 0).toFixed(1)}</span>
                      <span className="text-xs text-gray-500">({product.totalRatings || 0})</span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-end gap-2 mb-4">
                        <span className="text-xl font-bold dark:text-white">₹{(product.finalPrice || product.price).toLocaleString()}</span>
                        {product.discount > 0 && <span className="text-sm text-gray-500 line-through mb-1">₹{product.price.toLocaleString()}</span>}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={(e) => handleAddToCart(e, product)} disabled={product.stock <= 0 || isAdding} className="flex items-center justify-center gap-1 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 transition-all cursor-pointer text-xs font-bold">
                          {isAdding ? <Loader size={14} className="animate-spin" /> : <ShoppingBag size={14} />} Cart
                        </button>
                        <button onClick={(e) => handleBuyNow(e, product)} disabled={product.stock <= 0} className="flex items-center justify-center gap-1 py-2 bg-primary text-white rounded-xl hover:opacity-90 transition-all cursor-pointer text-xs font-bold shadow-sm">
                          <Zap size={14} /> Buy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandPage;