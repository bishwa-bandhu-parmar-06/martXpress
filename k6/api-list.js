const backendPort = __ENV.PORT || "3000";
const baseurl = `http://localhost:${backendPort}`;

// Dummy IDs and params for testing
const sampleProductId = "690297671801b03ffacc8a39";
const sampleSellerId = "68cb9ad1e4db5609e3dcf987";
const addressId = "68cb9ad1e4db5609e3dcf987";
const sellerId = "68cb9ad1e4db5609e3dcf987";
const usersId = "68cb9ad1e4db5609e3dcf987";
const orderId = "68cb9ad1e4db5609e3dcf987";
const itemName = "Macbook";
const categoryName = "Electronics";
const brandName = "Apple";

export const API_ENDPOINTS = [
  /* ================= AUTH (MUTATIONS) ================= */
  // ❌ NEVER load test register / otp / login
  // `${baseurl}/api/auth/register-users`,
  // `${baseurl}/api/auth/register-admin`,
  // `${baseurl}/api/auth/register-seller`,
  // `${baseurl}/api/auth/verify-otp`,
  // `${baseurl}/api/auth/resend-otp`,
  // `${baseurl}/api/auth/login`,
  // `${baseurl}/api/auth/logout`,
  // `${baseurl}/api/auth/google`,
  // `${baseurl}/api/auth/forgot-password`,
  // `${baseurl}/api/auth/reset-password/sample-token`,

  /* ================= PUBLIC / WEB (READ ONLY) ================= */
  `${baseurl}/api/products`,
  `${baseurl}/api/product/${sampleProductId}`,
  `${baseurl}/api/seller/${sampleSellerId}/products`,
  `${baseurl}/api/search?keyword=${itemName}`,
  `${baseurl}/api/search/suggestions?q=${itemName}`,
  `${baseurl}/api/featured`,
  `${baseurl}/api/categories`,
  `${baseurl}/api/all-brands`,
  `${baseurl}/api/products/brand/${brandName}`,
  `${baseurl}/api/homepage-grouped`,
  `${baseurl}/api/hero-slider`,
  `${baseurl}/api/products/category/${categoryName}`,
  `${baseurl}/api/all-categories`,
  `${baseurl}/api/top-category/${categoryName}`,
  `${baseurl}/api/category/${categoryName}/top-featured`,
  `${baseurl}/health`, // System Health Check

  /* ================= USER (READ ONLY) ================= */
  `${baseurl}/api/users/user-profile`,
  `${baseurl}/api/users/all-user-address`,
  `${baseurl}/api/users/single-address/${addressId}`,

  // ❌ update / add / delete = no load test
  // `${baseurl}/api/users/update-user-details`,
  // `${baseurl}/api/users/add-user-address`,
  // `${baseurl}/api/users/update-user-address/${addressId}`,
  // `${baseurl}/api/users/remove-user-address/${addressId}`,
  // `${baseurl}/api/users/change-password`,
  // `${baseurl}/api/users/delete-account`,

  /* ================= SELLER (READ ONLY) ================= */
  `${baseurl}/api/sellers/seller-profile`,
  `${baseurl}/api/sellers/all-seller-address`,
  `${baseurl}/api/sellers/single-address/${addressId}`,
  `${baseurl}/api/sellers/products/my-products`,
  `${baseurl}/api/sellers/products/${sampleProductId}`,
  `${baseurl}/api/sellers/orders`,
  `${baseurl}/api/sellers/analytics`, // Seller Dashboard Stats

  // ❌ seller mutations
  // `${baseurl}/api/sellers/update-seller-details`,
  // `${baseurl}/api/sellers/add-seller-address`,
  // `${baseurl}/api/sellers/update-seller-address/${addressId}`,
  // `${baseurl}/api/sellers/remove-seller-address/${addressId}`,
  // `${baseurl}/api/sellers/orders/${orderId}/status`,
  // `${baseurl}/api/sellers/products/add`,
  // `${baseurl}/api/sellers/products/bulk-add`,
  // `${baseurl}/api/sellers/products/update/${sampleProductId}`,
  // `${baseurl}/api/sellers/products/delete/${sampleProductId}`,

  /* ================= ADMIN (READ ONLY) ================= */
  `${baseurl}/api/admin/profile`,
  `${baseurl}/api/admin/dashboard/stats`,
  `${baseurl}/api/admin/get-all-users`,
  `${baseurl}/api/admin/get-all-products`,
  `${baseurl}/api/admin/address/all`,
  `${baseurl}/api/admin/address/${addressId}`,
  `${baseurl}/api/admin/sellers/approved`,
  `${baseurl}/api/admin/sellers/rejected`,
  `${baseurl}/api/admin/sellers/pending`,
  `${baseurl}/api/admin/sellers/${sellerId}`,

  // ❌ NEVER load test admin mutations
  // `${baseurl}/api/admin/update`,
  // `${baseurl}/api/admin/change-password`,
  // `${baseurl}/api/admin/address/add`,
  // `${baseurl}/api/admin/address/update/${addressId}`,
  // `${baseurl}/api/admin/address/remove/${addressId}`,
  // `${baseurl}/api/admin/sellers/${sellerId}/approve`,
  // `${baseurl}/api/admin/sellers/${sellerId}/reject`,
  // `${baseurl}/api/admin/sellers/${sellerId}/remove`,
  // `${baseurl}/api/admin/users/${usersId}`,
  // `${baseurl}/api/admin/products/${sampleProductId}`,

  /* ================= CART (READ ONLY) ================= */
  `${baseurl}/api/cart/get-all-cart-item`,

  // ❌ mutation
  // `${baseurl}/api/cart/add-to-cart`,
  // `${baseurl}/api/cart/update/${sampleProductId}`,
  // `${baseurl}/api/cart/remove/${sampleProductId}`,
  // `${baseurl}/api/cart/clear`,

  /* ================= WISHLIST (READ ONLY) ================= */
  `${baseurl}/api/wishlist/get-all-wishlist`,

  // ❌ mutation
  // `${baseurl}/api/wishlist/add-to-wishlist`,
  // `${baseurl}/api/wishlist/remove/${sampleProductId}`,
  // `${baseurl}/api/wishlist/clear/all`,

  /* ================= ORDERS (READ ONLY) ================= */
  `${baseurl}/api/order/my-orders`,
  `${baseurl}/api/order/get-order/${orderId}`,

  // ❌ mutation
  // `${baseurl}/api/order/place`,
  // `${baseurl}/api/order/cancel-order/${orderId}`,
  // `${baseurl}/api/order/return-order/${orderId}`,

  /* ================= PAYMENT ================= */
  // ❌ mutation
  // `${baseurl}/api/payment/create-order`,
  // `${baseurl}/api/payment/verify-payment`,

  /* ================= RATINGS (READ ONLY) ================= */
  `${baseurl}/api/rating/product-all-rating/${sampleProductId}`,
  `${baseurl}/api/rating/product-rating/${sampleProductId}`,

  // ❌ mutation
  // `${baseurl}/api/rating/add-rating`,
  // `${baseurl}/api/rating/delete-rating/${sampleProductId}`,
];
