import React, { useState, useRef, useEffect } from "react";
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
  Trash2,
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

import { editProductDetails } from "../../../API/ProductsApi/productsAPI.js";

const EditProduct = ({ isOpen, onClose, productData: initialProductData }) => {
  if (!isOpen) return null;

  // Form state
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

  // Image handling state
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageErrors, setImageErrors] = useState([]);
  const fileInputRef = useRef(null);
  const MAX_IMAGES = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form when product data is provided
  useEffect(() => {
    if (isOpen && initialProductData) {
      setFormData({
        name: initialProductData.name || "",
        description: initialProductData.description || "",
        category: initialProductData.category || "",
        brand: initialProductData.brand || "",
        price: initialProductData.price || "",
        discount: initialProductData.discount || "",
        stock: initialProductData.stock || "",
        tags: initialProductData.tags
          ? Array.isArray(initialProductData.tags)
            ? initialProductData.tags.join(", ")
            : initialProductData.tags
          : "",
        status: initialProductData.status || "active",
        featured: initialProductData.featured || false,
      });

      // Set existing images if available
      if (initialProductData.images && initialProductData.images.length > 0) {
        setImagePreviews(initialProductData.images);
        setImages([]);
      }
    }
  }, [isOpen, initialProductData]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
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

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newErrors = [];

    // Check if adding these files would exceed max limit
    if (imagePreviews.length + files.length > MAX_IMAGES) {
      alert(`You can only have up to ${MAX_IMAGES} images`);
      return;
    }

    files.forEach((file, index) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        newErrors[index] = "File must be an image";
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        newErrors[index] = "File size must be less than 5MB";
        return;
      }

      // Validate dimensions (optional)
      const img = new Image();
      img.onload = function () {
        if (this.width < 300 || this.height < 300) {
          newErrors[index] = "Image should be at least 300x300 pixels";
        }
      };
      img.src = URL.createObjectURL(file);
    });

    // Filter valid files
    const validFiles = files.filter((_, index) => !newErrors[index]);

    if (validFiles.length === 0 && files.length > 0) {
      alert("No valid images to upload. Please check file requirements.");
      return;
    }

    // Create previews for valid files
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

    // Update states
    setImages((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setImageErrors((prev) => [...prev, ...newErrors]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove image
  const removeImage = (index) => {
    // Check if it's a newly uploaded image or existing image
    const isNewImage = index >= imagePreviews.length - images.length;

    if (isNewImage) {
      // Revoke object URL for new images
      URL.revokeObjectURL(imagePreviews[index]);
      const newImageIndex = index - (imagePreviews.length - images.length);
      setImages((prev) => prev.filter((_, i) => i !== newImageIndex));
      setImageErrors((prev) => prev.filter((_, i) => i !== newImageIndex));
    }

    // Remove from previews
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      // Revoke URLs for newly uploaded images
      images.forEach((_, index) => {
        if (imagePreviews[index]) {
          URL.revokeObjectURL(imagePreviews[index]);
        }
      });
    };
  }, [images, imagePreviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      alert("Please fix the errors in the form");
      return;
    }

    if (imagePreviews.length === 0) {
      alert("Please keep or upload at least one product image");
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      // 1. TEXT FIELDS (Hamesha pehle append karo)
      formDataToSend.append("productId", initialProductData._id);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("price", Number(formData.price));
      formDataToSend.append("discount", Number(formData.discount) || 0);
      formDataToSend.append("stock", Number(formData.stock) || 0);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("featured", formData.featured);

      // 2. TAGS (Backend expects an array)
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      tagsArray.forEach((tag) => formDataToSend.append("tags[]", tag));

      // 3. EXISTING IMAGES (Identify which ones to keep)
      const existingImageUrls = initialProductData.images || [];
      const keptExistingImages = imagePreviews.filter((url) =>
        existingImageUrls.includes(url),
      );

      keptExistingImages.forEach((url) => {
        formDataToSend.append("existingImages[]", url);
      });

      // 4. NEW IMAGES (Append actual File objects last)
      images.forEach((file) => {
        formDataToSend.append("images", file);
      });

      // API Call
      const response = await editProductDetails(formDataToSend);
      console.log("Update Success:", response);
      onClose();

      // Optional: Refresh parent state or window
      // window.location.reload();
    } catch (error) {
      console.error("Update Error:", error);
      alert(error?.message || "Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  // Input field styling with theme support
  const inputClasses = (hasError = false) => `
    w-full px-4 py-3 rounded-lg border transition-all duration-200
    bg-white dark:bg-gray-800
    ${
      hasError
        ? "border-red-500 dark:border-red-500 focus:ring-red-500/20"
        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500/20"
    }
    text-gray-900 dark:text-gray-100
    placeholder-gray-500 dark:placeholder-gray-400
    focus:ring-2 focus:border-transparent focus:outline-none
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const labelClasses = `
    block mb-2 text-sm font-medium
    text-gray-700 dark:text-gray-300
  `;

  const cardClasses = `
    bg-white dark:bg-gray-800
    border border-gray-200 dark:border-gray-700
    rounded-xl shadow-sm
    p-6 transition-colors duration-200
  `;

  const buttonPrimaryClasses = `
    px-6 py-3 bg-blue-600 hover:bg-blue-700
    text-white font-medium rounded-lg 
    transition-all duration-200 
    hover:shadow-lg hover:-translate-y-0.5
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    dark:focus:ring-offset-gray-900
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
    flex items-center justify-center gap-2 cursor-pointer
  `;

  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Calculate final price for display
  const calculateFinalPrice = () => {
    const price = parseFloat(formData.price) || 0;
    const discount = parseFloat(formData.discount) || 0;
    return price - (price * discount) / 100;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-7xl max-h-[90vh] overflow-y-auto bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 rounded-2xl shadow-2xl mx-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-3 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 cursor-pointer shadow-lg"
          aria-label="Close modal"
        >
          <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Content Container */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10">
                <Package className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Edit Product
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {initialProductData
                    ? `Editing: ${initialProductData.name}`
                    : "Edit Product"}
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
              Update your product details below. All fields marked with * are
              required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Product Details & Images */}
              <div className="lg:col-span-2 space-y-6">
                {/* Product Information Card */}
                <div className={cardClasses}>
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <Package className="h-5 w-5 text-blue-500" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Product Information
                    </h2>
                    <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 font-medium">
                      Required *
                    </span>
                  </div>

                  <div className="space-y-6">
                    {/* Product Name */}
                    <div>
                      <label className={labelClasses}>Product Name *</label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className={`${inputClasses(errors.name)} pl-10`}
                          placeholder="e.g., Wireless Bluetooth Headphones"
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label className={labelClasses}>Description *</label>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          required
                          rows="5"
                          className={`${inputClasses(errors.description)} pl-10`}
                          placeholder="Describe your product features, specifications, and benefits..."
                        />
                      </div>
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.description}
                        </p>
                      )}
                    </div>

                    {/* Category and Brand */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={labelClasses}>Category *</label>
                        <div className="relative">
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className={`${inputClasses(errors.category)} cursor-pointer`}
                          >
                            <option value="">Select a category</option>
                            {PRODUCT_CATEGORIES.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                        {errors.category && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.category}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className={labelClasses}>Brand Name</label>
                        <input
                          type="text"
                          name="brand"
                          value={formData.brand}
                          onChange={handleChange}
                          className={inputClasses()}
                          placeholder="e.g., Sony, Nike, Apple"
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className={labelClasses}>Tags & Keywords</label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="tags"
                          value={formData.tags}
                          onChange={handleChange}
                          className={`${inputClasses()} pl-10`}
                          placeholder="wireless, bluetooth, noise-cancelling, headphones"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Separate tags with commas. Tags help customers find your
                        product.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Product Images Card */}
                <div className={cardClasses}>
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <ImageIcon className="h-5 w-5 text-blue-500" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Product Images
                    </h2>
                    <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                      {imagePreviews.length}/{MAX_IMAGES} images
                    </span>
                  </div>

                  <div className="space-y-6">
                    {/* Image Upload Area */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 hover:border-blue-500/50
                        ${
                          imagePreviews.length === 0
                            ? "border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10"
                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                        }`}
                    >
                      <div className="max-w-sm mx-auto">
                        <div className="p-3 rounded-full bg-blue-500/10 inline-flex mb-4">
                          <Upload className="h-8 w-8 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          {imagePreviews.length === 0
                            ? "Upload Product Images"
                            : "Add More Images"}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Drag & drop images here or click to browse
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                          <p>• Maximum {MAX_IMAGES} images</p>
                          <p>• Max 5MB per image</p>
                          <p>• JPG, PNG, WebP formats</p>
                        </div>
                      </div>
                    </div>

                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Product Images ({imagePreviews.length})
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {imagePreviews.map((preview, index) => {
                            const isExistingImage =
                              initialProductData?.images?.includes(preview);
                            return (
                              <div
                                key={index}
                                className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer"
                              >
                                <img
                                  src={preview}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                                {index === 0 && (
                                  <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
                                    Main
                                  </div>
                                )}
                                {isExistingImage && (
                                  <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
                                    Existing
                                  </div>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute bottom-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110 cursor-pointer"
                                  title="Remove image"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                                {imageErrors[index] && (
                                  <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs p-2">
                                    {imageErrors[index]}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Add More Button */}
                        {imagePreviews.length < MAX_IMAGES && (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-4 py-2.5 text-blue-500 hover:text-blue-600 font-medium rounded-lg border border-blue-500/30 hover:border-blue-500/50 transition-colors cursor-pointer"
                          >
                            <Plus className="h-4 w-4" />
                            Add More Images
                          </button>
                        )}
                      </div>
                    )}

                    {/* Image Tips */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                            Image Guidelines:
                          </p>
                          <ul className="text-blue-700 dark:text-blue-400 space-y-1">
                            <li>
                              • Green "Existing" label shows current product
                              images
                            </li>
                            <li>• Remove images by clicking the trash icon</li>
                            <li>
                              • First image is used as main product display
                            </li>
                            <li>• Keep at least one image for the product</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Pricing, Inventory & Actions */}
              <div className="space-y-6">
                {/* Pricing Card */}
                <div className={cardClasses}>
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <DollarSign className="h-5 w-5 text-blue-500" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Pricing
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Price */}
                    <div>
                      <label className={labelClasses}>Price (₹) *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          ₹
                        </span>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          required
                          min="1"
                          step="0.01"
                          className={`${inputClasses(errors.price)} pl-8`}
                          placeholder="0.00"
                        />
                      </div>
                      {errors.price && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.price}
                        </p>
                      )}
                    </div>

                    {/* Discount */}
                    <div>
                      <label className={labelClasses}>Discount (%)</label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          name="discount"
                          value={formData.discount}
                          onChange={handleChange}
                          min="0"
                          max="100"
                          step="0.1"
                          className={`${inputClasses(errors.discount)} pl-10`}
                          placeholder="0"
                        />
                      </div>
                      {errors.discount && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.discount}
                        </p>
                      )}
                    </div>

                    {/* Final Price Display */}
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Final Price After Discount
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ₹{calculateFinalPrice().toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Inventory & Status Card */}
                <div className={cardClasses}>
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <BarChart className="h-5 w-5 text-blue-500" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Inventory & Status
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Stock */}
                    <div>
                      <label className={labelClasses}>Stock Quantity *</label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                        min="0"
                        className={`${inputClasses(errors.stock)}`}
                        placeholder="0"
                      />
                      {errors.stock && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.stock}
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <div>
                      <label className={labelClasses}>Product Status</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["active", "inactive", "out of stock"].map(
                          (status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, status }))
                              }
                              className={`py-2.5 px-3 text-sm font-medium rounded-lg border transition-all duration-200 cursor-pointer
                              ${
                                formData.status === status
                                  ? "border-blue-500 bg-blue-500/10 text-blue-500"
                                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                              }`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Featured Toggle */}
                    <div
                      className={`p-4 rounded-lg border transition-colors duration-200
                      ${
                        formData.featured
                          ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/30"
                          : "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              formData.featured
                                ? "bg-yellow-100 dark:bg-yellow-900/30"
                                : "bg-gray-100 dark:bg-gray-800"
                            }`}
                          >
                            <Star
                              className={`h-5 w-5 ${
                                formData.featured
                                  ? "text-yellow-500 dark:text-yellow-400"
                                  : "text-gray-400"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Featured Product
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
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
                          <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-500/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500 cursor-pointer"></div>
                        </label>
                      </div>
                      {formData.featured && (
                        <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                          This product will be prominently displayed on the
                          homepage
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons Card */}
                <div className={cardClasses}>
                  <div className="space-y-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`${buttonPrimaryClasses} w-full`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Updating Product...
                        </>
                      ) : (
                        <>
                          <Check className="h-5 w-5" />
                          Update Product
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        // Reset form to original values
                        if (initialProductData) {
                          setFormData({
                            name: initialProductData.name || "",
                            description: initialProductData.description || "",
                            category: initialProductData.category || "",
                            brand: initialProductData.brand || "",
                            price: initialProductData.price || "",
                            discount: initialProductData.discount || "",
                            stock: initialProductData.stock || "",
                            tags: initialProductData.tags
                              ? Array.isArray(initialProductData.tags)
                                ? initialProductData.tags.join(", ")
                                : initialProductData.tags
                              : "",
                            status: initialProductData.status || "active",
                            featured: initialProductData.featured || false,
                          });
                          setImagePreviews(initialProductData.images || []);
                          setImages([]);
                          setImageErrors([]);
                        }
                        setErrors({});
                      }}
                      className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      Reset to Original
                    </button>

                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="h-4 w-4 text-gray-400" />
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Product Details
                      </h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      {initialProductData && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">
                              Product ID:
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {initialProductData._id?.substring(0, 8)}...
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">
                              Original Price:
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              ₹
                              {initialProductData.price?.toLocaleString() ||
                                "0"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">
                              Status:
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                initialProductData.status === "active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : initialProductData.status === "inactive"
                                    ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              }`}
                            >
                              {initialProductData.status || "active"}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tips Card */}
                <div className="p-5 rounded-xl bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-800/30">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">
                        Editing Tips
                      </h4>
                      <ul className="text-sm text-purple-700 dark:text-purple-400 space-y-2">
                        <li className="flex items-start gap-2">
                          <Award className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>Update outdated information regularly</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>Adjust pricing based on performance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Star className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>Keep images fresh and appealing</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
