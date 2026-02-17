const backendPort = __ENV.PORT || "3000";
const baseurl = `http://localhost:${backendPort}`;

const sampleProductId = "690297671801b03ffacc8a39";
const sampleSellerId = "68cb9ad1e4db5609e3dcf987";
const addressId = "68cb9ad1e4db5609e3dcf987";
const sellerId = "68cb9ad1e4db5609e3dcf987";
const usersId = "68cb9ad1e4db5609e3dcf987";
const orderId = "68cb9ad1e4db5609e3dcf987";
const itemName = "Macbook";

export const API_ENDPOINTS = [
  /* ================= AUTH ================= */
  // ❌ NEVER load test register / otp
  // `${baseurl}/api/auth/register-users`,
  // `${baseurl}/api/auth/register-admin`,
  // `${baseurl}/api/auth/register-seller`,
  // `${baseurl}/api/auth/verify-otp`,
  // `${baseurl}/api/auth/resend-otp`,

  // ✅ LOGIN ko alag auth.js se test kar rahe ho
  // `${baseurl}/api/auth/login`,

  /* ================= PUBLIC / WEB (MOST IMPORTANT) ================= */
  `${baseurl}/api/products`,
  `${baseurl}/api/product/${sampleProductId}`,
  `${baseurl}/api/seller/${sampleSellerId}/products`,
  `${baseurl}/api/search?keyword=${itemName}`,
  `${baseurl}/api/featured`,
  `${baseurl}/api/categories`,
  `${baseurl}/api/all-brands`,
  `${baseurl}/api/products/brand/Apple`,
  `${baseurl}/api/homepage-grouped`,
  `${baseurl}/api/hero-slider`,
  `${baseurl}/api/products/category/Electronics`,
  `${baseurl}/api/all-categories`,
  `${baseurl}/api/top-category/Electronics`,
  `${baseurl}/api/category/Electronics/top-featured`,

  /* ================= USER (READ ONLY) ================= */
  `${baseurl}/api/users/user-profile`,
  `${baseurl}/api/users/all-user-address`,
  `${baseurl}/api/users/single-address/${addressId}`,

  // ❌ update / add / delete = no load test
  // `${baseurl}/api/users/update-user-details`,
  // `${baseurl}/api/users/add-user-address`,
  // `${baseurl}/api/users/update-user-address/${addressId}`,
  // `${baseurl}/api/users/remove-user-address/${addressId}`,

  /* ================= ADMIN (SAFE READ ONLY) ================= */
  `${baseurl}/api/admin/profile`,
  `${baseurl}/api/admin/dashboard/stats`,
  `${baseurl}/api/admin/get-all-users`,
  `${baseurl}/api/admin/get-all-products`,
  `${baseurl}/api/admin/products/${sampleProductId}`,

  // ❌ NEVER load test admin mutations
  // `${baseurl}/api/admin/update`,
  // `${baseurl}/api/admin/change-password`,
  // `${baseurl}/api/admin/address/add`,
  // `${baseurl}/api/admin/sellers/${sellerId}/approve`,
  // `${baseurl}/api/admin/sellers/${sellerId}/reject`,
  // `${baseurl}/api/admin/sellers/${sellerId}/remove`,

  /* ================= SELLER (READ ONLY) ================= */
  `${baseurl}/api/sellers/seller-profile`,
  `${baseurl}/api/sellers/all-seller-address`,
  `${baseurl}/api/sellers/single-address/${addressId}`,
  `${baseurl}/api/sellers/products/my-products`,
  `${baseurl}/api/sellers/products/${sampleProductId}`,

  // ❌ seller mutations
  // `${baseurl}/api/sellers/products/add`,
  // `${baseurl}/api/sellers/products/update/${sampleProductId}`,
  // `${baseurl}/api/sellers/products/delete/${sampleProductId}`,

  /* ================= WISHLIST (READ ONLY) ================= */
  `${baseurl}/api/wishlist/get-all-wishlist`,

  // ❌ mutation
  // `${baseurl}/api/wishlist/add-to-wishlist`,
  // `${baseurl}/api/wishlist/remove-wishlist/${sampleProductId}`,
  // `${baseurl}/api/wishlist/clear/all`,

  /* ================= CART (READ ONLY) ================= */
  `${baseurl}/api/cart/get-all-cart-item`,

  // ❌ mutation
  // `${baseurl}/api/cart/add-to-cart`,
  // `${baseurl}/api/cart/remove/${sampleProductId}`,
  // `${baseurl}/api/cart/clear/all`,

  /* ================= ORDERS ================= */
  `${baseurl}/api/order/my-orders`,
  `${baseurl}/api/order/get-order/${orderId}`,

  // ❌ place order = NEVER
  // `${baseurl}/api/order/place`,

  /* ================= RATINGS ================= */
  `${baseurl}/api/rating/product-all-rating/${sampleProductId}`,
  `${baseurl}/api/rating/product-rating/${sampleProductId}`,

  // ❌ mutation
  // `${baseurl}/api/rating/add-rating`,
  // `${baseurl}/api/rating/delete-rating/${sampleProductId}`,
];
