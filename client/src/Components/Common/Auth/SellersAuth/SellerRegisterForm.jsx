import React, { useState } from "react";
import { registerSeller } from "../../../../API/Sellers/SellersApi.js";
import { useNavigate } from "react-router-dom";

const SellerRegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    shopName: "",
    gstNumber: "",
    TermsAndCdn: false,
  });

  const [gstCertificate, setGstCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setGstCertificate(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = new FormData();

      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("mobile", formData.mobile);
      payload.append("shopName", formData.shopName);
      payload.append("gstNumber", formData.gstNumber);
      payload.append("TermsAndCdn", formData.TermsAndCdn);

      if (gstCertificate) {
        payload.append("gstCertificate", gstCertificate);
      }

      const res = await registerSeller(payload);

      if (res.status !== 200) {
        throw new Error(res.message);
      }
      navigate("/verify-otp", {
        state: {
          email: formData.email,
          role: "seller",
          mode: "register",
        },
      });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 py-8">
      <div className="w-full max-w-2xl mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">MartXpress</h1>
          <p className="text-gray-600">Grow your business with us</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-linear-to-r from-primary to-secondary p-6">
            <h2 className="text-2xl font-bold text-white text-center">
              Seller Registration
            </h2>
            <p className="text-white/80 text-center mt-2">
              Join our marketplace and reach millions of customers
            </p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center font-medium">
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm text-center font-medium">
                  {success}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seller Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                      focus:ring-2 focus:ring-primary/30 focus:border-primary
                      outline-none transition-all duration-200"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                      focus:ring-2 focus:ring-primary/30 focus:border-primary
                      outline-none transition-all duration-200"
                    required
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Enter 10-digit mobile number"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                      focus:ring-2 focus:ring-primary/30 focus:border-primary
                      outline-none transition-all duration-200"
                    required
                  />
                </div>

                {/* Shop Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Name *
                  </label>
                  <input
                    type="text"
                    name="shopName"
                    placeholder="Enter your shop name"
                    value={formData.shopName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                      focus:ring-2 focus:ring-primary/30 focus:border-primary
                      outline-none transition-all duration-200"
                    required
                  />
                </div>

                {/* GST Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Number *
                  </label>
                  <input
                    type="text"
                    name="gstNumber"
                    placeholder="Enter GST number"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                      uppercase focus:ring-2 focus:ring-primary/30 focus:border-primary
                      outline-none transition-all duration-200"
                    required
                  />
                </div>

                {/* GST Certificate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Certificate (Optional)
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4
                    hover:border-primary transition-colors"
                  >
                    <input
                      type="file"
                      accept=".pdf,.jpg,.png"
                      onChange={handleFileChange}
                      className="w-full text-sm"
                    />
                    {gstCertificate && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ {gstCertificate.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  name="TermsAndCdn"
                  checked={formData.TermsAndCdn}
                  onChange={handleChange}
                  className="h-5 w-5 mt-0.5 text-primary focus:ring-primary"
                  required
                />
                <span className="text-sm text-gray-600">
                  I agree to the MartXpress Seller Terms & Conditions. I
                  understand that my shop information will be verified before
                  approval.
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !formData.TermsAndCdn}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold 
                  py-3 px-4 rounded-lg transition-all duration-200
                  transform hover:scale-[1.02] active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Registering...
                  </span>
                ) : (
                  "Register as Seller"
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-primary font-semibold hover:text-primary/80 transition-colors"
                >
                  Sign in
                </button>
              </p>
              <p className="text-center text-gray-600 text-sm mt-2">
                Want to shop with us?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/users/auth")}
                  className="text-secondary font-semibold hover:text-secondary/80 transition-colors"
                >
                  Create customer account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRegisterForm;
