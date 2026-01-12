const backendPort = __ENV.PORT || "3000";
const baseurl = `http://localhost:${backendPort}`;

const sampleProductId = "690297671801b03ffacc8a39";
const sampleSellerId = "68cb9ad1e4db5609e3dcf987";
const addressId = "68cb9ad1e4db5609e3dcf987";
const sellerId = "68cb9ad1e4db5609e3dcf987";
const usersId = "68cb9ad1e4db5609e3dcf987";
let itemName = "Mackbook";
const orderId = "68cb9ad1e4db5609e3dcf987";

export const API_ENDPOINTS = [
  // Auth Routes
  `${baseurl}/api/auth/register-users`,
  `${baseurl}/api/auth/register-admin`,
  `${baseurl}/api/auth/register-seller`,
  `${baseurl}/api/auth/verify-register-users-otp`,
  `${baseurl}/api/auth/login-users`,
  `${baseurl}/api/auth/verify-login-users-otp`,
  `${baseurl}/api/auth/resend-otp`,

  // WEb Routes
  `${baseurl}/api/products`,
  `${baseurl}/api/product/${sampleProductId}`,
  `${baseurl}/api/seller/${sampleSellerId}/products`,
  `${baseurl}/api/search?keyword=${itemName}`,
  `${baseurl}/api/featured`,
  `${baseurl}/api/categories`,
  `${baseurl}/api/brands`,

  //Users Routes
  `${baseurl}/api/users/user-profile`,
  `${baseurl}/api/users/update-user-details`,
  `${baseurl}/api/users/add-user-address`,
  `${baseurl}/api/users/all-user-address`,
  `${baseurl}/api/users/single-address/${addressId}`,
  `${baseurl}/api/users/update-user-address/${addressId}`,
  `${baseurl}/api/users/remove-user-address/${addressId}`,

  // Admin Routes
  `${baseurl}/api/admin/profile`,
  `${baseurl}/api/admin/update`,
  `${baseurl}/api/admin/change-password`,
  `${baseurl}/api/admin/address/add`,
  `${baseurl}/api/admin/address/all`,
  `${baseurl}/api/admin/address/${addressId}`,
  `${baseurl}/api/admin/address/${addressId}`,
  `${baseurl}/api/admin/address/${addressId}`,

  `${baseurl}/api/admin/sellers/approved`,
  `${baseurl}/api/admin/sellers/rejected`,
  `${baseurl}/api/admin/sellers/pending`,
  `${baseurl}/api/admin/sellers/${sellerId}`,
  `${baseurl}/api/admin/sellers/${sellerId}/approve`,
  `${baseurl}/api/admin/sellers/${sellerId}/reject`,
  `${baseurl}/api/admin/sellers/${sellerId}/remove`,

  `${baseurl}/api/admin/get-all-users`,
  `${baseurl}/api/admin/users/${usersId}`,
  `${baseurl}/api/admin/get-all-products`,
  `${baseurl}/api/admin/products/${sampleProductId}`,
  `${baseurl}/api/admin/dashboard/stats`,

  // Seller Routes
  `${baseurl}/api/sellers/seller-profile`,
  `${baseurl}/api/sellers/update-seller-details`,
  `${baseurl}/api/sellers/add-seller-address`,
  `${baseurl}/api/sellers/all-seller-address`,
  `${baseurl}/api/sellers/single-address/${addressId}`,
  `${baseurl}/api/sellers/update-seller-address/${addressId}`,
  `${baseurl}/api/sellers/remove-seller-address/${addressId}`,

  // Wish List Routes
  `${baseurl}/api/wishlist/add-to-wishlist`,
  `${baseurl}/api/wishlist/get-all-wishlist`,
  `${baseurl}/api/wishlist/remove-wishlist/${sampleProductId}`,
  `${baseurl}/api/wishlist/clear/all`,

  // Cart Routes
  `${baseurl}/api/cart/add-to-cart`,
  `${baseurl}/api/cart/get-all-cart-item`,
  `${baseurl}/api/cart/remove/${sampleProductId}`,
  `${baseurl}/api/cart/clear/all`,

  // Order Routes
  `${baseurl}/api/order/place`,
  `${baseurl}/api/order/my-orders`,
  `${baseurl}/api/order/get-order/${orderId}`,

  // Ratings
  `${baseurl}/api/rating/add-rating`,
  `${baseurl}/api/rating/product-all-rating/${sampleProductId}`,
  `${baseurl}/api/rating/product-rating/${sampleProductId}`,
  `${baseurl}/api/rating/delete-rating/${sampleProductId}`,

  // Products Routes
  `${baseurl}/api/sellers/products/add`,
  `${baseurl}/api/sellers/products/my-products`,
  `${baseurl}/api/sellers/products/${sampleProductId}`,
  `${baseurl}/api/sellers/products/update/${sampleProductId}`,
  `${baseurl}/api/sellers/products/delete/${sampleProductId}`,
];
