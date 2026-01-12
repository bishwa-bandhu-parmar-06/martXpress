import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Upload,
  Link as LinkIcon,
  Tag,
  Package,
  DollarSign,
  Hash,
  AlignLeft,
  BarChart3,
  Layers,
  Globe,
  Truck,
  Shield,
  Image as ImageIcon,
  ChevronDown,
  Plus,
  Minus,
  Eye,
  EyeOff
} from 'lucide-react';

const AddEditProduct = ({ product, onSave, onCancel, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    sku: '',
    stock: '',
    category: '',
    subcategory: '',
    tags: [],
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    images: [],
    status: 'draft',
    seoTitle: '',
    seoDescription: '',
    metaKeywords: [],
    shippingClass: 'standard',
    taxClass: 'standard',
    isFeatured: false,
    isVirtual: false,
    isDownloadable: false,
    variations: []
  });

  const [errors, setErrors] = useState({});
  const [newTag, setNewTag] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [imagePreviews, setImagePreviews] = useState([]);

  // Predefined options
  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports & Outdoors' },
    { value: 'books', label: 'Books & Media' },
    { value: 'toys', label: 'Toys & Games' },
    { value: 'beauty', label: 'Beauty & Health' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'food', label: 'Food & Beverages' },
  ];

  const subcategories = {
    electronics: [
      { value: 'smartphones', label: 'Smartphones' },
      { value: 'laptops', label: 'Laptops' },
      { value: 'audio', label: 'Audio Devices' },
      { value: 'wearables', label: 'Wearables' },
    ],
    fashion: [
      { value: 'clothing', label: 'Clothing' },
      { value: 'shoes', label: 'Shoes' },
      { value: 'accessories', label: 'Accessories' },
      { value: 'jewelry', label: 'Jewelry' },
    ],
    // Add more subcategories as needed
  };

  const shippingClasses = [
    { value: 'standard', label: 'Standard Shipping', cost: 'Free', delivery: '3-5 days' },
    { value: 'express', label: 'Express Shipping', cost: '$9.99', delivery: '1-2 days' },
    { value: 'overnight', label: 'Overnight Shipping', cost: '$19.99', delivery: 'Next day' },
    { value: 'free', label: 'Free Shipping', cost: 'Free', delivery: '5-7 days' },
  ];

  const taxClasses = [
    { value: 'standard', label: 'Standard Tax (10%)' },
    { value: 'reduced', label: 'Reduced Tax (5%)' },
    { value: 'zero', label: 'Zero Tax (0%)' },
    { value: 'exempt', label: 'Tax Exempt' },
  ];

  // Load product data if in edit mode
  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData(product);
      // Generate image previews if images exist
      if (product.images && product.images.length > 0) {
        setImagePreviews(product.images);
      }
    } else {
      // Generate SKU for new product
      generateSKU();
    }
  }, [product, mode]);

  // Generate random SKU
  const generateSKU = () => {
    const prefix = 'PROD';
    const random = Math.floor(10000 + Math.random() * 90000);
    const sku = `${prefix}-${random}`;
    setFormData(prev => ({ ...prev, sku }));
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle nested object changes (dimensions)
  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  // Handle tag addition
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle keyword addition
  const handleAddKeyword = () => {
    if (newKeyword.trim() && !formData.metaKeywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        metaKeywords: [...prev.metaKeywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  // Handle keyword removal
  const handleRemoveKeyword = (keywordToRemove) => {
    setFormData(prev => ({
      ...prev,
      metaKeywords: prev.metaKeywords.filter(keyword => keyword !== keywordToRemove)
    }));
  };

  // Handle image upload simulation
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // Simulate image upload by creating preview URLs
    const newPreviews = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
    }));
    
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newPreviews.map(p => p.url)]
    }));
  };

  // Handle image removal
  const handleRemoveImage = (id) => {
    setImagePreviews(prev => prev.filter(img => img.id !== id));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => imagePreviews[index]?.id !== id)
    }));
  };

  // Set main image
  const handleSetMainImage = (id) => {
    const imageIndex = imagePreviews.findIndex(img => img.id === id);
    if (imageIndex > 0) {
      const updatedPreviews = [...imagePreviews];
      const [mainImage] = updatedPreviews.splice(imageIndex, 1);
      updatedPreviews.unshift(mainImage);
      setImagePreviews(updatedPreviews);
      setFormData(prev => ({
        ...prev,
        images: updatedPreviews.map(img => img.url)
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.category) newErrors.category = 'Category is required';
    
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    onSave(formData);
  };

  // Tabs configuration
  const tabs = [
    { id: 'general', label: 'General', icon: Package },
    { id: 'inventory', label: 'Inventory', icon: Layers },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'seo', label: 'SEO', icon: Globe },
    { id: 'advanced', label: 'Advanced', icon: BarChart3 },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm max-w-6xl mx-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'add' ? 'Add New Product' : 'Edit Product'}
          </h2>
          <p className="text-gray-600 mt-1">
            {mode === 'add' ? 'Fill in the details to add a new product' : 'Update product information'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {mode === 'add' ? 'Publish Product' : 'Update Product'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-gray-200">
        <div className="flex space-x-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 border-b-2 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-8">
          {/* General Tab */}
          {activeTab === 'general' && (
            <>
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <div className="border-b border-gray-300 bg-gray-50 px-4 py-2 flex items-center space-x-4">
                    <button type="button" className="p-1 hover:bg-gray-200 rounded">
                      <span className="font-bold">B</span>
                    </button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded">
                      <span className="italic">I</span>
                    </button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded">
                      <span className="underline">U</span>
                    </button>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded">
                      <AlignLeft className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Describe your product in detail..."
                  />
                </div>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        errors.price ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hash className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        errors.sku ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="PROD-12345"
                    />
                    <button
                      type="button"
                      onClick={generateSKU}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      Generate
                    </button>
                  </div>
                  {errors.sku && (
                    <p className="mt-1 text-sm text-red-600">{errors.sku}</p>
                  )}
                </div>
              </div>

              {/* Category and Subcategory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none ${
                        errors.category ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory
                  </label>
                  <div className="relative">
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                      disabled={!formData.category}
                    >
                      <option value="">Select Subcategory</option>
                      {subcategories[formData.category]?.map((subcat) => (
                        <option key={subcat.value} value={subcat.value}>
                          {subcat.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Add tags (press Enter)"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="ml-3 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Add
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images
                </label>
                <div className="space-y-4">
                  {/* Image Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
                    <input
                      type="file"
                      id="image-upload"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">Drop images here or click to upload</p>
                      <p className="text-gray-500 text-sm mt-1">
                        Upload up to 10 images. Recommended size: 800x800px
                      </p>
                    </label>
                  </div>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {imagePreviews.map((image, index) => (
                        <div
                          key={image.id}
                          className={`relative rounded-lg overflow-hidden border-2 ${
                            index === 0 ? 'border-indigo-500' : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={image.url}
                            alt={image.name}
                            className="h-32 w-full object-cover"
                          />
                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded">
                              Main
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleSetMainImage(image.id)}
                              className="p-2 bg-white/90 rounded-full hover:bg-white"
                              title="Set as main"
                            >
                              <Star className="h-4 w-4 text-gray-700" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(image.id)}
                              className="p-2 bg-white/90 rounded-full hover:bg-white"
                              title="Remove"
                            >
                              <X className="h-4 w-4 text-gray-700" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <>
              {/* Stock Management */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Status
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="out-of-stock">Out of Stock</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Physical Properties */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Physical Properties</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Length (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.dimensions.length}
                      onChange={(e) => handleNestedChange('dimensions', 'length', e.target.value)}
                      step="0.1"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Width (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.dimensions.width}
                      onChange={(e) => handleNestedChange('dimensions', 'width', e.target.value)}
                      step="0.1"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="15"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.dimensions.height}
                      onChange={(e) => handleNestedChange('dimensions', 'height', e.target.value)}
                      step="0.1"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="10"
                    />
                  </div>
                </div>
              </div>

              {/* Product Type */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Type</h3>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isVirtual"
                      checked={formData.isVirtual}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-gray-700">Virtual product (no shipping required)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isDownloadable"
                      checked={formData.isDownloadable}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-gray-700">Downloadable product</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-gray-700">Featured product</span>
                  </label>
                </div>
              </div>
            </>
          )}

          {/* Shipping Tab */}
          {activeTab === 'shipping' && (
            <>
              {/* Shipping Class */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Class
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {shippingClasses.map((shipping) => (
                    <label
                      key={shipping.value}
                      className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                        formData.shippingClass === shipping.value
                          ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingClass"
                        value={shipping.value}
                        checked={formData.shippingClass === shipping.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          formData.shippingClass === shipping.value
                            ? 'border-indigo-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.shippingClass === shipping.value && (
                            <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                          )}
                        </div>
                        <div className="ml-3">
                          <span className="block text-sm font-medium text-gray-900">
                            {shipping.label}
                          </span>
                          <div className="mt-1">
                            <span className="text-sm text-gray-600">{shipping.cost}</span>
                            <span className="text-xs text-gray-500 ml-2">• {shipping.delivery}</span>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tax Class */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Class
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {taxClasses.map((tax) => (
                    <label
                      key={tax.value}
                      className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                        formData.taxClass === tax.value
                          ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="taxClass"
                        value={tax.value}
                        checked={formData.taxClass === tax.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          formData.taxClass === tax.value
                            ? 'border-indigo-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.taxClass === tax.value && (
                            <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                          )}
                        </div>
                        <span className="ml-3 text-sm text-gray-900">{tax.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <>
              {/* SEO Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="seoTitle"
                    value={formData.seoTitle}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="SEO-friendly product title (max 60 characters)"
                    maxLength="60"
                  />
                </div>
                <div className="mt-1 text-sm text-gray-500 flex justify-between">
                  <span>Recommended length: 50-60 characters</span>
                  <span>{formData.seoTitle.length}/60</span>
                </div>
              </div>

              {/* SEO Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  name="seoDescription"
                  value={formData.seoDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Brief description for search engines (max 160 characters)"
                  maxLength="160"
                />
                <div className="mt-1 text-sm text-gray-500 flex justify-between">
                  <span>Recommended length: 150-160 characters</span>
                  <span>{formData.seoDescription.length}/160</span>
                </div>
              </div>

              {/* Meta Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Keywords
                </label>
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Add keywords (press Enter)"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="ml-3 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Add
                  </button>
                </div>
                {formData.metaKeywords.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.metaKeywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(keyword)}
                          className="ml-2 text-purple-600 hover:text-purple-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* SEO Preview */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Search Engine Preview</h3>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="space-y-2">
                    <div className="text-blue-600 text-lg hover:underline">
                      {formData.seoTitle || formData.name || 'Product Title'}
                    </div>
                    <div className="text-green-600 text-sm">
                      https://yourstore.com/products/{formData.sku || 'product-slug'}
                    </div>
                    <div className="text-gray-600">
                      {formData.seoDescription || formData.description?.substring(0, 160) || 'Product description...'}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <>
              {/* Product Variations */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Variations</h3>
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No variations added yet</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Add variations like size, color, or other attributes
                    </p>
                    <button
                      type="button"
                      className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      <Plus className="h-4 w-4 mr-2 inline" />
                      Add Variation
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Advanced Settings</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Note
                  </label>
                  <textarea
                    name="purchaseNote"
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Note to send to customers after purchase"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Purchase Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Purchase Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Unlimited"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddEditProduct;