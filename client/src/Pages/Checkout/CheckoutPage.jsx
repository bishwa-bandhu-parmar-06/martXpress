import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";

import { AddressesTab } from "../../Pages/Users/AddressesTab";
import { AddressModal } from "../../Pages/Users/AddressModal";
import {
  createRazorpayOrderApi,
  verifyRazorpayPaymentApi,
} from "../../API/Payment/paymentApi.js";
import { getCart } from "../../API/Cart/getAllCartProductApi";
import {
  getAllUserAddresses,
  addUserAddress,
  updateUserAddress,
  removeUserAddress,
} from "../../API/users/usersApi";

const initialAddressState = {
  fullName: "",
  mobile: "",
  house: "",
  street: "",
  landmark: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
};

// Extracted outside the component for cleaner code
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [totals, setTotals] = useState({ subtotal: 0, shipping: 0, final: 0 });

  // Address State
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressFormData, setAddressFormData] = useState(initialAddressState);
  const [isAddressSubmitting, setIsAddressSubmitting] = useState(false);

  // Payment State
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // --- 1. LOAD DATA ON MOUNT ---
  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        setLoading(true);

        // Fetch Addresses
        const addressRes = await getAllUserAddresses();
        const fetchedAddresses = addressRes.addresses || [];
        setAddresses(fetchedAddresses);

        // Auto-select the first address if available
        if (fetchedAddresses.length > 0) {
          setSelectedAddressId(fetchedAddresses[0]._id);
        }

        // Determine what we are buying (Buy Now vs Full Cart)
        if (location.state?.buyNowProduct) {
          // User clicked "Buy Now" for a single item
          const item = location.state.buyNowProduct[0];
          setCheckoutItems([item]);

          const subtotal = item.product.price * item.quantity;
          const shipping = subtotal > 500 ? 0 : 50;
          setTotals({ subtotal, shipping, final: subtotal + shipping });
        } else {
          // User clicked "Proceed to Checkout" from the Cart page
          const cartRes = await getCart();
          if (cartRes.success && cartRes.cart.items.length > 0) {
            setCheckoutItems(cartRes.cart.items);

            const subtotal = cartRes.cart.totalPrice;
            const shipping = subtotal > 500 ? 0 : 50;
            setTotals({ subtotal, shipping, final: subtotal + shipping });
          } else {
            // Cart is empty, send them back
            toast.error("Your cart is empty");
            navigate("/cart");
            return;
          }
        }
      } catch (error) {
        toast.error("Failed to load checkout details");
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [location.state, navigate]);

  // Pre-load the Razorpay script in the background
  useEffect(() => {
    loadRazorpayScript();
  }, []);

  // --- 2. ADDRESS HANDLERS ---
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setIsAddressSubmitting(true);
    try {
      if (editingAddressId) {
        const res = await updateUserAddress(editingAddressId, addressFormData);
        setAddresses(
          addresses.map((a) =>
            a._id === editingAddressId ? res.address || res.data : a,
          ),
        );
        toast.success("Address updated");
      } else {
        const res = await addUserAddress(addressFormData);
        const newAddress = res.address || res.data;
        setAddresses([...addresses, newAddress]);
        setSelectedAddressId(newAddress._id); // Auto-select the newly added address
        toast.success("Address added");
      }
      setIsAddressModalOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save address");
    } finally {
      setIsAddressSubmitting(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await removeUserAddress(id);
      const filtered = addresses.filter((a) => a._id !== id);
      setAddresses(filtered);
      if (selectedAddressId === id) {
        setSelectedAddressId(filtered.length > 0 ? filtered[0]._id : null);
      }
      toast.success("Address removed");
    } catch (err) {
      toast.error("Failed to delete address");
    }
  };

  // --- 3. PROCEED TO PAYMENT LOGIC ---
  const handleProceedToPayment = async () => {
    if (!selectedAddressId) {
      return toast.error("Please select a delivery address to continue.");
    }

    const selectedAddress = addresses.find((a) => a._id === selectedAddressId);
    const isBuyNow = !!location.state?.buyNowProduct;

    try {
      setIsProcessingPayment(true);

      // 1. Ensure Razorpay script is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setIsProcessingPayment(false);
        return;
      }

      // 2. Create Order using your new API Layer
      const orderData = await createRazorpayOrderApi(totals.final);

      // 3. Configure Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Add this to your frontend .env file!
        amount: orderData.amount,
        currency: orderData.currency,
        name: "martXpress",
        description: "Secure Order Payment",
        order_id: orderData.id,
        handler: async function (response) {
          // 4. Verify Payment using your new API Layer
          try {
            toast.loading("Verifying your payment...", {
              id: "payment-verify",
            });

            const verifyRes = await verifyRazorpayPaymentApi({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              checkoutItems,
              shippingAddress: selectedAddress,
              totalAmount: totals.final,
              isBuyNow,
            });

            toast.dismiss("payment-verify");

            if (verifyRes.success) {
              toast.success("Payment Successful! Order Placed.");
              navigate("/users/dashboard"); // Navigate to their order history
            }
          } catch (err) {
            toast.dismiss("payment-verify");
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: selectedAddress.fullName,
          contact: selectedAddress.mobile,
        },
        theme: {
          color: "#2563eb", // Tailwind Blue-600 to match primary theme
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on("payment.failed", function (response) {
        toast.error("Payment failed or was cancelled.");
      });

      paymentObject.open();
    } catch (error) {
      toast.error("Could not initiate payment. Please try again.");
      console.error("Payment Error:", error);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">
            Secure Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left Column: Items & Address Selection */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Review Items Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border dark:border-gray-700">
              <h2 className="text-xl font-bold dark:text-white mb-4">
                1. Review Items
              </h2>
              <div className="space-y-4">
                {checkoutItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 border-b dark:border-gray-700 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden shrink-0 border border-gray-100 dark:border-gray-700">
                      <img
                        src={item.product?.images?.[0] || item.image}
                        alt={item.product?.name || item.name}
                        className="w-full h-full object-contain p-2 mix-blend-multiply dark:mix-blend-normal"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold dark:text-white line-clamp-2 text-sm sm:text-base">
                        {item.product?.name || item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Qty:{" "}
                        <strong className="text-gray-700 dark:text-gray-300">
                          {item.quantity}
                        </strong>
                      </p>
                    </div>
                    <div className="font-bold text-primary sm:shrink-0 text-left sm:text-right">
                      ₹
                      {(
                        (item.product?.price || item.price) * item.quantity
                      ).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Address Selection Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border dark:border-gray-700">
              <AddressesTab
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                onSelectAddress={setSelectedAddressId}
                onAdd={() => {
                  setAddressFormData(initialAddressState);
                  setEditingAddressId(null);
                  setIsAddressModalOpen(true);
                }}
                onEdit={(addr) => {
                  setAddressFormData({
                    ...addr,
                    landmark: addr.landmark || "",
                  });
                  setEditingAddressId(addr._id);
                  setIsAddressModalOpen(true);
                }}
                onDelete={handleDeleteAddress}
              />
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border dark:border-gray-700 sticky top-24">
              <h2 className="text-xl font-bold dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Items ({checkoutItems.length})</span>
                  <span className="font-medium dark:text-white">
                    ₹{totals.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Shipping</span>
                  <span className="font-bold text-green-500">
                    {totals.shipping === 0 ? "Free" : `₹${totals.shipping}`}
                  </span>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 pt-4 mb-6 flex justify-between items-end">
                <span className="text-lg font-bold dark:text-white">
                  Total Amount
                </span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary">
                    ₹{totals.final.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 p-3 rounded-lg flex items-start gap-2 text-sm font-medium mb-6 border border-blue-100 dark:border-blue-900/50">
                <ShieldCheck size={20} className="shrink-0" />
                <p>Safe and secure payments powered by Razorpay.</p>
              </div>

              <button
                onClick={handleProceedToPayment}
                disabled={isProcessingPayment}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-lg transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    Proceed to Payment <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        formData={addressFormData}
        onChange={(e) =>
          setAddressFormData({
            ...addressFormData,
            [e.target.name]: e.target.value,
          })
        }
        onSubmit={handleAddressSubmit}
        isSubmitting={isAddressSubmitting}
        isEditing={!!editingAddressId}
      />
    </div>
  );
};

export default CheckoutPage;
