// Category-specific data
const CATEGORY_DATA = {
  Fashion: {
    icon: "👗",
    color: "from-pink-500 to-rose-500",
    bgColor:
      "bg-linear-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20",
    products: [
      {
        id: 1,
        name: "Men's Casual Shirt",
        price: 799,
        image:
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
      },
      {
        id: 2,
        name: "Women's Summer Dress",
        price: 1299,
        image:
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400",
      },
      {
        id: 3,
        name: "Sports Shoes",
        price: 1899,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      },
      {
        id: 4,
        name: "Designer Handbag",
        price: 2599,
        image:
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
      },
      {
        id: 5,
        name: "Winter Jacket",
        price: 3499,
        image:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
      },
      {
        id: 6,
        name: "Formal Suit",
        price: 4599,
        image:
          "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400",
      },
      {
        id: 7,
        name: "Leather Jacket",
        price: 5999,
        image:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
      },
      {
        id: 8,
        name: "Running Shoes",
        price: 2899,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      },
      {
        id: 9,
        name: "Casual T-Shirts",
        price: 499,
        image:
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400",
      },
      {
        id: 10,
        name: "Denim Jeans",
        price: 1299,
        image:
          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
      },
    ],
  },
  Electronics: {
    icon: "💻",
    color: "from-blue-500 to-indigo-500",
    bgColor:
      "bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
    products: [
      {
        id: 11,
        name: "Wireless Earbuds",
        price: 1499,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      },
      {
        id: 12,
        name: "Smart Watch",
        price: 3999,
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      },
      {
        id: 13,
        name: "Laptop",
        price: 45999,
        image:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
      },
      {
        id: 14,
        name: "Gaming Console",
        price: 32999,
        image:
          "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400",
      },
      {
        id: 15,
        name: "4K TV",
        price: 28999,
        image:
          "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
      },
      {
        id: 16,
        name: "Drone Camera",
        price: 18999,
        image:
          "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400",
      },
      {
        id: 17,
        name: "Bluetooth Speaker",
        price: 2499,
        image:
          "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
      },
      {
        id: 18,
        name: "Tablet",
        price: 25999,
        image:
          "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
      },
      {
        id: 19,
        name: "Camera",
        price: 35999,
        image:
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",
      },
      {
        id: 20,
        name: "Headphones",
        price: 2999,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      },
    ],
  },
  "TV & Appliances": {
    icon: "📺",
    color: "from-purple-500 to-violet-500",
    bgColor:
      "bg-linear-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20",
    products: [
      {
        id: 21,
        name: 'Smart TV 55"',
        price: 45999,
        image:
          "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
      },
      {
        id: 22,
        name: "Refrigerator",
        price: 28999,
        image:
          "https://images.unsplash.com/photo-1584568694244-e2e9d4b6e7c5?w=400",
      },
      {
        id: 23,
        name: "Washing Machine",
        price: 21999,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      },
      {
        id: 24,
        name: "Air Conditioner",
        price: 32999,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      },
      {
        id: 25,
        name: "Microwave Oven",
        price: 8999,
        image:
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
      },
      {
        id: 26,
        name: "Home Theater",
        price: 18999,
        image:
          "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
      },
      {
        id: 27,
        name: "Air Purifier",
        price: 8999,
        image:
          "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400",
      },
      {
        id: 28,
        name: "Water Purifier",
        price: 12999,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      },
      {
        id: 29,
        name: "Electric Kettle",
        price: 1499,
        image:
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
      },
      {
        id: 30,
        name: "Induction Cooktop",
        price: 3999,
        image:
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
      },
    ],
  },
  "Mobiles & Tablets": {
    icon: "📱",
    color: "from-cyan-500 to-blue-500",
    bgColor:
      "bg-linear-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20",
    products: [
      {
        id: 61,
        name: "Smartphone 128GB",
        price: 18999,
        image:
          "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400",
      },
      {
        id: 62,
        name: 'Tablet 10" Display',
        price: 25999,
        image:
          "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
      },
      {
        id: 63,
        name: "Wireless Earphones",
        price: 2499,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      },
      {
        id: 64,
        name: "Power Bank 20000mAh",
        price: 1499,
        image:
          "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400",
      },
      {
        id: 65,
        name: "Phone Case & Protector",
        price: 499,
        image:
          "https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=400",
      },
      {
        id: 66,
        name: "Fast Charger 65W",
        price: 899,
        image:
          "https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=400",
      },
      {
        id: 67,
        name: "Smartphone 256GB",
        price: 28999,
        image:
          "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400",
      },
      {
        id: 68,
        name: "Gaming Phone",
        price: 35999,
        image:
          "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400",
      },
      {
        id: 69,
        name: "Tablet with Pen",
        price: 32999,
        image:
          "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
      },
      {
        id: 70,
        name: "Bluetooth Headset",
        price: 1999,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      },
    ],
  },
  "Home & Furniture": {
    icon: "🏠",
    color: "from-emerald-500 to-teal-500",
    bgColor:
      "bg-linear-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
    products: [
      {
        id: 31,
        name: "Sofa Set",
        price: 25999,
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
      },
      {
        id: 32,
        name: "Dining Table",
        price: 18999,
        image:
          "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400",
      },
      {
        id: 33,
        name: "Bed King Size",
        price: 32999,
        image:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400",
      },
      {
        id: 34,
        name: "Wardrobe",
        price: 21999,
        image:
          "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=400",
      },
      {
        id: 35,
        name: "Study Table",
        price: 8999,
        image:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
      },
      {
        id: 36,
        name: "Bookshelf",
        price: 6999,
        image:
          "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=400",
      },
      {
        id: 37,
        name: "Coffee Table",
        price: 5999,
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
      },
      {
        id: 38,
        name: "Office Chair",
        price: 7999,
        image:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
      },
      {
        id: 39,
        name: "Dressing Table",
        price: 11999,
        image:
          "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=400",
      },
      {
        id: 40,
        name: "TV Unit",
        price: 14999,
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
      },
    ],
  },
  "Beauty & Personal Care": {
    icon: "💄",
    color: "from-rose-500 to-pink-500",
    bgColor:
      "bg-linear-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20",
    products: [
      {
        id: 41,
        name: "Skincare Set",
        price: 1299,
        image:
          "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=400",
      },
      {
        id: 42,
        name: "Hair Dryer",
        price: 1999,
        image:
          "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400",
      },
      {
        id: 43,
        name: "Perfume",
        price: 2499,
        image:
          "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
      },
      {
        id: 44,
        name: "Makeup Kit",
        price: 1599,
        image:
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
      },
      {
        id: 45,
        name: "Electric Shaver",
        price: 1799,
        image:
          "https://images.unsplash.com/photo-1523413363575-60c89e5d7172?w=400",
      },
      {
        id: 46,
        name: "Face Cream",
        price: 899,
        image:
          "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400",
      },
      {
        id: 47,
        name: "Body Lotion",
        price: 699,
        image:
          "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=400",
      },
      {
        id: 48,
        name: "Hair Straightener",
        price: 2499,
        image:
          "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400",
      },
      {
        id: 49,
        name: "Lipstick Set",
        price: 1199,
        image:
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
      },
      {
        id: 50,
        name: "Face Wash",
        price: 499,
        image:
          "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400",
      },
    ],
  },
  Grocery: {
    icon: "🛒",
    color: "from-green-500 to-emerald-500",
    bgColor:
      "bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    products: [
      {
        id: 51,
        name: "Organic Rice 5kg",
        price: 399,
        image:
          "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
      },
      {
        id: 52,
        name: "Extra Virgin Olive Oil",
        price: 599,
        image:
          "https://images.unsplash.com/photo-1533050487297-09b450131914?w=400",
      },
      {
        id: 53,
        name: "Assorted Dry Fruits",
        price: 899,
        image:
          "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
      },
      {
        id: 54,
        name: "Organic Honey 1kg",
        price: 349,
        image:
          "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400",
      },
      {
        id: 55,
        name: "Spices Combo Pack",
        price: 299,
        image:
          "https://images.unsplash.com/photo-1596040033221-a1f4f8a6d123?w=400",
      },
      {
        id: 56,
        name: "Premium Tea Leaves",
        price: 249,
        image:
          "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400",
      },
      {
        id: 57,
        name: "Coffee Beans 500g",
        price: 499,
        image:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
      },
      {
        id: 58,
        name: "Pasta & Noodles Pack",
        price: 199,
        image:
          "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400",
      },
      {
        id: 59,
        name: "Cereal Breakfast Pack",
        price: 349,
        image:
          "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400",
      },
      {
        id: 60,
        name: "Cooking Oil 5L",
        price: 699,
        image:
          "https://images.unsplash.com/photo-1533050487297-09b450131914?w=400",
      },
    ],
  },
};
export default CATEGORY_DATA;
