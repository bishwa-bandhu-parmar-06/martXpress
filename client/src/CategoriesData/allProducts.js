// src/data/allProducts.js

// Import your CATEGORY_DATA
import CATEGORY_DATA from "./categories.js"; // Adjust the import path as needed

// Flatten all products from all categories
const ALL_PRODUCTS = {};

// Add category information to each product and create additional details
Object.keys(CATEGORY_DATA).forEach((categoryName) => {
  const category = CATEGORY_DATA[categoryName];
  category.products.forEach((product) => {
    // Create enhanced product object with additional details
    ALL_PRODUCTS[product.id] = {
      ...product,
      // Basic product info
      name: product.name,
      price: product.price,
      image: product.image,

      // Category info
      category: categoryName,
      categoryIcon: category.icon,
      categoryColor: category.color,
      categoryBgColor: category.bgColor,

      // Additional details for product page
      brand: getBrandByCategory(categoryName),
      description: `${
        product.name
      } - Premium quality product from ${getBrandByCategory(categoryName)}`,
      longDescription: `Experience premium quality with this ${product.name.toLowerCase()}. Made with care and attention to detail, this product offers excellent value for money. Perfect for daily use and designed to last.`,

      // Multiple images (using same image for all, but in real app you'd have multiple)
      images: [
        product.image,
        product.image.replace("w=400", "w=800"),
        product.image.replace("w=400", "w=800&h=600"),
        product.image.replace("w=400", "w=800&q=90"),
        product.image.replace("w=400", "w=800&fit=crop"),
      ],

      // Product features based on category
      features: getFeaturesByCategory(categoryName, product),

      // Product specifications
      specifications: getSpecificationsByCategory(categoryName, product),

      // Colors and sizes
      colors: getColorsByCategory(categoryName),
      sizes: getSizesByCategory(categoryName),

      // Additional info
      rating: 4.0 + Math.random() * 1.5, // Random rating between 4.0-5.5
      reviews: Math.floor(Math.random() * 200) + 20, // Random reviews 20-220
      inStock: true,
      freeDelivery: product.price > 999,
      warranty: "1 Year",
      returnPolicy: "30 Days",
      discount: Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 10 : 0, // 0-40% discount
      originalPrice: product.price * (1 + Math.random() * 0.5), // Add 0-50% to original price
    };
  });
});

// Helper functions to generate product details
function getBrandByCategory(category) {
  const brands = {
    Fashion: ["UrbanStyle", "FashionHub", "StyleCraft", "TrendyWear"],
    Electronics: ["TechZone", "GadgetPro", "ElectroMax", "SmartTech"],
    "TV & Appliances": ["HomeTech", "AppliancePro", "SmartHome", "LivingStyle"],
    "Mobiles & Tablets": ["PhonePro", "TabTech", "MobileX", "GadgetZone"],
    "Home & Furniture": [
      "HomeStyle",
      "FurnitureCraft",
      "LivingSpace",
      "ComfortZone",
    ],
    "Beauty & Personal Care": [
      "BeautyGlow",
      "CarePlus",
      "PersonalCare",
      "StyleCare",
    ],
    Grocery: ["OrganicFarm", "FreshMart", "HealthyChoice", "Nature'sBest"],
  };

  const categoryBrands = brands[category] || ["PremiumBrand"];
  return categoryBrands[Math.floor(Math.random() * categoryBrands.length)];
}

function getFeaturesByCategory(category, product) {
  const features = {
    Fashion: [
      "Premium Quality Fabric",
      "Comfortable Fit",
      "Machine Washable",
      "Trendy Design",
      "Durable Stitching",
    ],
    Electronics: [
      "Latest Technology",
      "Energy Efficient",
      "Easy to Use",
      "Long Battery Life",
      "Premium Build Quality",
    ],
    "TV & Appliances": [
      "Energy Star Rated",
      "Smart Features",
      "Easy Installation",
      "Quiet Operation",
      "Modern Design",
    ],
    "Mobiles & Tablets": [
      "Fast Performance",
      "Long Battery Life",
      "High Resolution Display",
      "Latest OS",
      "Premium Build",
    ],
    "Home & Furniture": [
      "Premium Material",
      "Easy Assembly",
      "Space Saving",
      "Modern Design",
      "Durable Construction",
    ],
    "Beauty & Personal Care": [
      "Natural Ingredients",
      "Skin Friendly",
      "Long Lasting",
      "Easy to Use",
      "Portable Design",
    ],
    Grocery: [
      "100% Organic",
      "Fresh Quality",
      "Healthy Choice",
      "Premium Grade",
      "Eco-Friendly Packaging",
    ],
  };

  return (
    features[category] || [
      "High Quality",
      "Premium",
      "Durable",
      "Value for Money",
    ]
  );
}

function getSpecificationsByCategory(category, product) {
  const baseSpecs = {
    Fashion: {
      Material: "Premium Fabric",
      Fit: "Regular",
      "Care Instructions": "Machine Wash",
      Color: "As Shown",
      Size: "Available in multiple sizes",
    },
    Electronics: {
      Brand: getBrandByCategory(category),
      Model: "Pro Series",
      Warranty: "1 Year",
      Power: "Energy Efficient",
      Connectivity: "Multiple Options",
    },
    "TV & Appliances": {
      Brand: getBrandByCategory(category),
      Warranty: "2 Years",
      "Energy Rating": "A++",
      Installation: "Professional Required",
      Features: "Smart Features Included",
    },
    "Mobiles & Tablets": {
      Brand: getBrandByCategory(category),
      Storage: "128GB",
      Display: "Full HD",
      Battery: "5000mAh",
      Camera: "Multiple Lenses",
    },
    "Home & Furniture": {
      Material: "Premium Wood/Metal",
      Assembly: "Required",
      "Weight Capacity": "High",
      Dimensions: "Standard",
      Finish: "Premium",
    },
    "Beauty & Personal Care": {
      Ingredients: "Natural",
      Volume: "Standard",
      "Skin Type": "All Types",
      Fragrance: "Mild",
      Expiry: "2 Years",
    },
    Grocery: {
      Type: "Organic",
      Weight: product.name.includes("kg") ? "As per pack" : "Standard",
      "Shelf Life": "6 Months",
      Storage: "Cool Dry Place",
      Certification: "Quality Certified",
    },
  };

  return (
    baseSpecs[category] || {
      Quality: "Premium",
      Warranty: "1 Year",
      Brand: getBrandByCategory(category),
    }
  );
}

function getColorsByCategory(category) {
  const colors = {
    Fashion: ["#000000", "#3B82F6", "#DC2626", "#059669", "#7C3AED"],
    Electronics: ["#000000", "#6B7280", "#1E40AF", "#0F766E"],
    "TV & Appliances": ["#000000", "#FFFFFF", "#6B7280", "#1E293B"],
    "Mobiles & Tablets": ["#000000", "#3B82F6", "#10B981", "#EF4444"],
    "Home & Furniture": ["#000000", "#78350F", "#1E40AF", "#0F766E"],
    "Beauty & Personal Care": ["#FFFFFF", "#FBBF24", "#EC4899", "#8B5CF6"],
    Grocery: ["#FFFFFF", "#F59E0B", "#10B981", "#3B82F6"],
  };

  return colors[category] || ["#000000"];
}

function getSizesByCategory(category) {
  const sizes = {
    Fashion: ["XS", "S", "M", "L", "XL", "XXL"],
    Electronics: ["Standard", "Large", "Extra Large"],
    "TV & Appliances": ["Standard", "Large", "Extra Large"],
    "Mobiles & Tablets": ["Standard", "Plus", "Pro"],
    "Home & Furniture": ["Small", "Medium", "Large", "Extra Large"],
    "Beauty & Personal Care": ["50ml", "100ml", "200ml", "500ml"],
    Grocery: ["500g", "1kg", "2kg", "5kg"],
  };

  return sizes[category] || ["Standard"];
}

// Function to get related products (same category, different products)
export function getRelatedProducts(productId, category) {
  if (!category) return [];

  // Get all products from the same category
  const categoryProducts = Object.values(ALL_PRODUCTS).filter(
    (p) => p.category === category && p.id !== parseInt(productId)
  );

  // Return 4 random products from same category
  return categoryProducts.sort(() => Math.random() - 0.5).slice(0, 4);
}

export { ALL_PRODUCTS };
