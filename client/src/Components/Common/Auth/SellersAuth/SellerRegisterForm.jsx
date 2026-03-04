import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { registerSeller } from "../../../../API/Sellers/SellersApi.js";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Store,
  FileText,
  Hash,
  X,
  Lock,
} from "lucide-react";

const SellerRegisterForm = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    shopName: "",
    gstNumber: "",
    password: "",
    TermsAndCdn: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [gstCertificate, setGstCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      // 1. Validate File Type
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
      if (!validTypes.includes(file.type)) {
        setError("Only PDF, JPG, JPEG, and PNG files are allowed.");
        return handleRemoveFile();
      }

      // 2. Validate File Size (5MB = 5 * 1024 * 1024 bytes)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB.");
        return handleRemoveFile();
      }

      // 3. Clear errors and set file
      setError("");
      setGstCertificate(file);
    }
  };

  const handleRemoveFile = () => {
    setGstCertificate(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const payload = new FormData();
      Object.keys(formData).forEach((key) =>
        payload.append(key, formData[key]),
      );
      if (gstCertificate) payload.append("gstCertificate", gstCertificate);

      const response = await registerSeller(payload);
      if (response.success) {
        onSwitchToLogin();
      }
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold text-center border border-red-100">
          {error}
        </div>
      )}

      {/* SINGLE UNIFIED GRID FOR PERFECT ALIGNMENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 tracking-wider">
            Full Name
          </label>
          <div className="relative group">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              name="name"
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:border-primary transition-all"
              placeholder="John Doe"
            />
          </div>
        </div>

        {/* Business Email */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 tracking-wider">
            Business Email
          </label>
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              name="email"
              type="email"
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:border-primary transition-all"
              placeholder="john@shop.com"
            />
          </div>
        </div>

        {/* Shop Name */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 tracking-wider">
            Shop Name
          </label>
          <div className="relative group">
            <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              name="shopName"
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:border-primary transition-all"
              placeholder="Electro Hub"
            />
          </div>
        </div>

        {/* GST Number */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 tracking-wider">
            GST Number
          </label>
          <div className="relative group">
            <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              name="gstNumber"
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:border-primary transition-all uppercase"
              placeholder="22AAAAA0000A1Z5"
            />
          </div>
        </div>

        {/* GST File - Spans across both columns on desktop */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 tracking-wider">
            GST Certificate (PDF/Image)
          </label>
          <div className="relative group cursor-pointer flex items-center">
            <FileText className="absolute left-3.5 h-4 w-4 text-gray-400" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".jpg, .pdf, .jpeg, .png"
              className="w-full pl-10 cursor-pointer pr-12 py-2.5 text-sm text-gray-500 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all"
            />
            {gstCertificate && (
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute cursor-pointer right-3 p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors shadow-sm"
                title="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {gstCertificate && (
            <p className="text-[10px] text-primary font-medium ml-2 mt-1 truncate max-w-[90%]">
              Selected: {gstCertificate.name}
            </p>
          )}
        </div>

        {/* Password (Now wrapped properly with a label!) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 tracking-wider">
            Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              onChange={handleChange}
              required
              className="w-full pl-10 pr-10 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:border-primary transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
            >
              {showPass ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Number */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 tracking-wider">
            Mobile Number
          </label>
          <div className="relative group">
            <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              name="mobile"
              type="tel"
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:border-primary transition-all"
              placeholder="9876543210"
            />
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="flex items-center gap-2 px-1 pt-2">
        <input
          type="checkbox"
          name="TermsAndCdn"
          id="terms"
          onChange={handleChange}
          required
          className="h-4 w-4 rounded text-primary border-gray-300 focus:ring-primary cursor-pointer transition-colors"
        />
        <label
          htmlFor="terms"
          className="text-[13px] font-medium text-gray-500 dark:text-gray-400 select-none cursor-pointer"
        >
          I agree to the Seller Terms & Conditions
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-2 cursor-pointer bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? "Creating Account..." : "Register as Seller"}
      </button>
    </form>
  );
};

export default SellerRegisterForm;
