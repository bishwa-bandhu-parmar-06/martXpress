import api from "../axiosInstance"; // Adjust path to your axiosInstance

/**
 * Request the backend to create a Razorpay Order ID
 * @param {number} amount - The final total amount in INR
 */
export const createRazorpayOrderApi = async (amount) => {
  const res = await api.post("/payment/create-order", { amount });
  // Returning the actual order object from the response
  console.log("Create Order : ", res.data.order);
  return res.data.order;
};

/**
 * Send the Razorpay success details to the backend for mathematical verification and database saving
 * @param {Object} paymentData - The signature, order ID, and cart details
 */
export const verifyRazorpayPaymentApi = async (paymentData) => {
  const res = await api.post("/payment/verify-payment", paymentData);
  console.log("Verify Order : ", res.data);
  return res.data;
};
