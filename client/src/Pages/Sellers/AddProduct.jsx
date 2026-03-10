import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import {
  Upload,
  X,
  Plus,
  Image as ImageIcon,
  DollarSign,
  Tag,
  Package,
  BookOpen,
  Hash,
  Percent,
  Star,
  Zap,
  AlertCircle,
  Check,
  Loader2,
  TrendingUp,
  BarChart,
  Award,
  Shield,
  FileSpreadsheet,
  Download,
  UploadCloud,
  CheckCircle2,
} from "lucide-react";

// You would import this from your constants
export const PRODUCT_CATEGORIES = [
  "Fashion",
  "Electronics",
  "TV & Appliances",
  "Home & Furniture",
  "Beauty & Personal Care",
  "Grocery",
  "Mobiles & Tablets",
];

// Ensure addBulkProductsApi is imported from your API file
import {
  AddProductsForLoggedInSeller,
  addBulkProductsApi,
} from "../../API/ProductsApi/productsAPI.js";

const AddProduct = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // --- UI STATE ---
  const [uploadMode, setUploadMode] = useState("single"); // 'single' | 'bulk'
  const [isLoading, setIsLoading] = useState(false);

  // ==========================================
  // SINGLE PRODUCT UPLOAD STATE & LOGIC
  // ==========================================
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    discount: "",
    stock: "",
    tags: "",
    status: "active",
    featured: false,
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageErrors, setImageErrors] = useState([]);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const MAX_IMAGES = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.stock || parseInt(formData.stock) < 0)
      newErrors.stock = "Valid stock quantity is required";
    const discount = parseFloat(formData.discount);
    if (discount < 0 || discount > 100)
      newErrors.discount = "Discount must be between 0-100%";
    return newErrors;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newErrors = [];

    if (images.length + files.length > MAX_IMAGES) {
      toast.error(`You can only upload up to ${MAX_IMAGES} images`);
      return;
    }

    files.forEach((file, index) => {
      if (!file.type.startsWith("image/")) {
        newErrors[index] = "File must be an image";
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        newErrors[index] = "File size must be less than 5MB";
        return;
      }
    });

    setImageErrors((prev) => [...prev, ...newErrors]);
    const validFiles = files.filter((_, index) => !newErrors[index]);

    if (validFiles.length === 0) {
      toast.error("No valid images to upload. Check requirements.");
      return;
    }

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the highlighted errors.");
      return;
    }
    if (images.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("price", Number(formData.price));
      formDataToSend.append("discount", Number(formData.discount) || 0);
      formDataToSend.append("stock", Number(formData.stock) || 0);

      formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .forEach((tag) => formDataToSend.append("tags[]", tag));

      images.forEach((image) => formDataToSend.append("images", image));

      await AddProductsForLoggedInSeller(formDataToSend);
      toast.success("Product Added Successfully!");
      resetSingleForm();
      onClose();
    } catch (error) {
      toast.error(error?.message || "Failed to add product.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetSingleForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      brand: "",
      price: "",
      discount: "",
      stock: "",
      tags: "",
      status: "active",
      featured: false,
    });
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImages([]);
    setImagePreviews([]);
    setErrors({});
  };

  const calculatedFinalPrice =
    (Number(formData.price) || 0) -
    ((Number(formData.price) || 0) * (Number(formData.discount) || 0)) / 100;

  // ==========================================
  // BULK UPLOAD STATE & LOGIC
  // ==========================================
  const [bulkFile, setBulkFile] = useState(null);
  const bulkFileInputRef = useRef(null);

  const handleBulkFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.ms-excel", // .xls
        "text/csv", // .csv
      ];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error("Please upload a valid Excel (.xlsx, .xls) or CSV file.");
        return;
      }
      setBulkFile(selectedFile);
    }
  };

  const handleDownloadTemplate = () => {
    const headers =
      "Name,Description,Category,Brand,Price,Discount,Stock,Tags,ImageURLs,Status,Featured\n";
    const sampleData =
      'Sample T-Shirt,High quality cotton,Fashion,Nike,999,10,50,"shirt, summer, fashion","https://example.com/img1.jpg",active,FALSE\n';

    const blob = new Blob([headers + sampleData], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "MartXpress_Bulk_Upload_Template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkSubmit = async () => {
    if (!bulkFile) {
      toast.error("Please select a file first.");
      return;
    }

    setIsLoading(true);
    const fd = new FormData();
    fd.append("file", bulkFile);

    try {
      const res = await addBulkProductsApi(fd);
      toast.success(res.message || "Bulk upload successful!");
      if (res.errors && res.errors.length > 0) {
        toast.warning(`Some rows skipped: ${res.errors.join(", ")}`);
      }
      setBulkFile(null);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to upload bulk products.");
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // UTILS & EFFECTS
  // ==========================================
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // STYLING CLASSES
  const inputClasses = (hasError = false) => `
    w-full px-4 py-2.5 rounded-lg border transition-all duration-200 bg-white dark:bg-gray-800 text-sm
    ${hasError ? "border-red-500 focus:ring-red-500/20" : "border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/20"}
    text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:outline-none disabled:opacity-50
  `;
  const labelClasses = `block mb-1.5 text-sm font-bold text-gray-700 dark:text-gray-300`;
  const cardClasses = `bg-white dark:bg-[#1A1D2E] border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm p-6 transition-colors duration-200`;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`relative w-full ${uploadMode === "bulk" ? "max-w-3xl" : "max-w-6xl"} max-h-[92vh] overflow-y-auto bg-gray-50 dark:bg-[#131520] rounded-2xl shadow-2xl mx-4 custom-scrollbar transition-all duration-300`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2.5 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 cursor-pointer shadow-sm border border-gray-100 dark:border-white/5"
        >
          <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>

        <div className="p-6 md:p-8">
          {/* Header & Mode Switcher */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
                  <Package className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {uploadMode === "single"
                    ? "Add New Product"
                    : "Bulk Upload Products"}
                </h1>
              </div>

              {/* Toggle Switch */}
              <div className="flex bg-gray-200 dark:bg-[#1A1D2E] p-1 rounded-xl w-fit border border-gray-300 dark:border-white/10 shadow-inner">
                <button
                  type="button"
                  onClick={() => setUploadMode("single")}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${uploadMode === "single" ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"}`}
                >
                  Single Product
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode("bulk")}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${uploadMode === "bulk" ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"}`}
                >
                  Bulk Upload
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
              {uploadMode === "single"
                ? "Ensure your product details are clear, accurate, and appealing to maximize conversions."
                : "Upload multiple products at once using our Excel/CSV template. Great for migrating large inventories."}
            </p>
          </div>

          {/* ========================================== */}
          {/* SINGLE PRODUCT FORM */}
          {/* ========================================== */}
          {uploadMode === "single" && (
            <form
              onSubmit={handleSingleSubmit}
              className="space-y-6 animate-in fade-in slide-in-from-bottom-2"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT COLUMN: Details & Images */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Basic Info */}
                  <div className={cardClasses}>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                      <Tag className="h-5 w-5 text-indigo-500" /> Basic
                      Information
                    </h2>
                    <div className="space-y-5">
                      <div>
                        <label className={labelClasses}>
                          Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={inputClasses(errors.name)}
                          placeholder="e.g., Sony WH-1000XM5 Wireless Headphones"
                        />
                        {errors.name && (
                          <p className="mt-1.5 text-xs font-semibold text-red-500">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className={labelClasses}>
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows="5"
                          className={`${inputClasses(errors.description)} resize-none`}
                          placeholder="Highlight the key features and benefits..."
                        />
                        {errors.description && (
                          <p className="mt-1.5 text-xs font-semibold text-red-500">
                            {errors.description}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className={labelClasses}>
                            Category <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={`${inputClasses(errors.category)} cursor-pointer appearance-none`}
                          >
                            <option value="">Select Category</option>
                            {PRODUCT_CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                          {errors.category && (
                            <p className="mt-1.5 text-xs font-semibold text-red-500">
                              {errors.category}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className={labelClasses}>Brand</label>
                          <input
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            className={inputClasses()}
                            placeholder="e.g., Sony"
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelClasses}>Search Tags</label>
                        <div className="relative">
                          <Hash className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            className={`${inputClasses()} pl-9`}
                            placeholder="headphones, wireless, audio (comma separated)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className={cardClasses}>
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-indigo-500" />{" "}
                        Product Gallery
                      </h2>
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-md">
                        {images.length} / {MAX_IMAGES} limit
                      </span>
                    </div>

                    <div className="space-y-5">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${images.length === 0 ? "border-indigo-300 dark:border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-500/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10" : "border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500"}`}
                      >
                        <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-500/20 mb-3">
                          <Upload className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                          Click or drag images to upload
                        </p>
                        <p className="text-xs text-gray-500">
                          Max 5MB per image (JPG, PNG)
                        </p>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          multiple
                          className="hidden"
                        />
                      </div>

                      {images.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                          {imagePreviews.map((preview, index) => (
                            <div
                              key={index}
                              className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                            >
                              <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                              {index === 0 && (
                                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold rounded-md">
                                  Main
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1.5 right-1.5 p-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Price, Stock, Actions */}
                <div className="space-y-6">
                  {/* Pricing & Stock */}
                  <div className={cardClasses}>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-emerald-500" />{" "}
                      Inventory & Pricing
                    </h2>
                    <div className="space-y-5">
                      <div>
                        <label className={labelClasses}>
                          Base Price (₹) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                            ₹
                          </span>
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            min="1"
                            className={`${inputClasses(errors.price)} pl-8`}
                            placeholder="0.00"
                          />
                        </div>
                        {errors.price && (
                          <p className="mt-1.5 text-xs font-semibold text-red-500">
                            {errors.price}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className={labelClasses}>Discount (%)</label>
                        <div className="relative">
                          <Percent className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="number"
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            className={`${inputClasses(errors.discount)} pl-9`}
                            placeholder="0"
                          />
                        </div>
                        {errors.discount && (
                          <p className="mt-1.5 text-xs font-semibold text-red-500">
                            {errors.discount}
                          </p>
                        )}
                      </div>
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl">
                        <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 mb-0.5">
                          Final Selling Price
                        </p>
                        <p className="text-2xl font-black text-emerald-600 dark:text-emerald-300">
                          ₹{calculatedFinalPrice.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <label className={labelClasses}>
                          Stock Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="stock"
                          value={formData.stock}
                          onChange={handleChange}
                          min="0"
                          className={inputClasses(errors.stock)}
                          placeholder="0"
                        />
                        {errors.stock && (
                          <p className="mt-1.5 text-xs font-semibold text-red-500">
                            {errors.stock}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status & Featured */}
                  <div className={cardClasses}>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-amber-500" /> Visibility
                    </h2>
                    <div className="space-y-5">
                      <div>
                        <label className={labelClasses}>Store Status</label>
                        <div className="grid grid-cols-3 gap-2">
                          {["active", "inactive", "out of stock"].map(
                            (status) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() =>
                                  setFormData({ ...formData, status })
                                }
                                className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer capitalize ${formData.status === status ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20" : "bg-white dark:bg-transparent border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-500/50"}`}
                              >
                                {status}
                              </button>
                            ),
                          )}
                        </div>
                      </div>
                      <div
                        className={`p-4 rounded-xl border transition-colors ${formData.featured ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30" : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-gray-700"}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Star
                              className={`h-5 w-5 ${formData.featured ? "text-amber-500 fill-amber-500" : "text-gray-400"}`}
                            />
                            <div>
                              <p className="text-sm font-bold text-gray-900 dark:text-white">
                                Feature Product
                              </p>
                              <p className="text-[10px] text-gray-500">
                                Highlight on homepage
                              </p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="featured"
                              checked={formData.featured}
                              onChange={handleChange}
                              className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Final Actions */}
                  <div className="flex flex-col gap-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Check className="h-5 w-5" />
                      )}
                      {isLoading ? "Publishing..." : "Publish Product"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        resetSingleForm();
                        onClose();
                      }}
                      className="w-full py-3.5 bg-white dark:bg-transparent border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* ========================================== */}
          {/* BULK UPLOAD FORM */}
          {/* ========================================== */}
          {uploadMode === "bulk" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Step 1: Download Template */}
                <div
                  className={`${cardClasses} flex flex-col items-center justify-center text-center p-8 border-dashed border-2`}
                >
                  <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
                    <FileSpreadsheet className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Step 1: Download Template
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Download our required CSV layout format to structure your
                    bulk product data.
                  </p>
                  <button
                    onClick={handleDownloadTemplate}
                    className="px-6 py-2.5 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-bold rounded-lg border border-indigo-200 dark:border-indigo-800 shadow-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="h-4 w-4" /> Download CSV Template
                  </button>
                </div>

                {/* Step 2: Upload File */}
                <div
                  className={`${cardClasses} flex flex-col items-center justify-center text-center p-8 border-dashed border-2 ${bulkFile ? "border-emerald-500 bg-emerald-50/20 dark:bg-emerald-900/5" : "hover:border-indigo-400 dark:hover:border-indigo-500"}`}
                  onClick={() => bulkFileInputRef.current?.click()}
                >
                  {bulkFile ? (
                    <>
                      <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-3" />
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[200px]">
                        {bulkFile.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(bulkFile.size / 1024).toFixed(1)} KB
                      </p>
                      <button className="mt-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">
                        Click to change file
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                        <UploadCloud className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        Step 2: Upload File
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Click or drag your filled CSV or Excel file here.
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    ref={bulkFileInputRef}
                    onChange={handleBulkFileChange}
                    accept=".csv, .xlsx, .xls"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Note / Tip */}
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800 dark:text-amber-400">
                  <p className="font-bold mb-1">Important formatting notes:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>
                      Image URLs must be publicly accessible links (separated by
                      commas).
                    </li>
                    <li>
                      Category must match exactly with the provided store
                      categories.
                    </li>
                    <li>Status should be "active" or "inactive".</li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkSubmit}
                  disabled={!bulkFile || isLoading}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UploadCloud className="h-4 w-4" />
                  )}
                  {isLoading ? "Processing..." : "Start Bulk Upload"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
