import api from "../axiosInstance";
import { getAuthToken } from "../../utils/auth.js";
import { readonly } from "zod";

const token = getAuthToken("authToken");

// ? Function  get All Products of Logged in Seller
// export const getAllProductsOfLoggedInSeller = async () => {
//   try {
//     const response = await api.get("/sellers/products/my-products", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     console.log("Response Product : ", response);
//     return response.data;
//   } catch (error) {
//     throw error.response ? error.response.data : new Error("Network Error");
//   }
// };

// productsAPI.js
export const getAllProductsOfLoggedInSeller = async (page = 1, limit = 10) => {
  try {
    // Pass page and limit as query parameters
    const response = await api.get(
      `/sellers/products/my-products?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    // console.log("Response Product : ", response);
    // Based on your JSON log, the data is inside response.data
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// TODO Function for Adding the Products
export const AddProductsForLoggedInSeller = async (formData) => {
  const response = await api.post("/sellers/products/add", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// TODO Function for Deleting the Products
export const deleteProductsForLoggedInSeller = async (productId) => {
  try {
    const response = await api.post(
      `/sellers/products/delete/${productId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("Response for Delete Product :", response);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// ? Get All Products For All Users or Public
export const getAllTypeProducts = async () => {
  try {
    const response = await api.get("/products");
    console.log("Res: ", response);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// ? Get single products details
export const getSingleProductDetails = async (productId) => {
  try {
    const response = await api.get(`/product/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// ? edit product for edit the  products details
export const editProductDetails = async (formData) => {
  try {
    const productId = formData.get("productId");
    // Token ko yahan fetch karo taaki expire na ho
    const currentToken = getAuthToken("authToken");
    const response = await api.post(
      `/sellers/products/update/${productId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${currentToken}`,
          // YE SABSE JARURI HAI:
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("API Error Details:", error.response?.data);
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Get grouped products for homepage
export const getHomepageGroupedProducts = async () => {
  try {
    const response = await api.get("/homepage-grouped");
    // console.log("Grouped Data : ", response);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// productsAPI.js
export const fetchHeroSliderProducts = async () => {
  const response = await api.get("/hero-slider"); // Apne route ke according change karein
  // console.log("Cheking Re: ", response)
  return response.data;
};

// productsAPI.js
export const getProductsByCategory = async (categoryName) => {
  const response = await api.get(`/products/category/${categoryName}`); // Apne route ke according change karein
  // console.log("Cheking Re: ", response);
  return response.data;
};

// productsAPI.js
export const getAllCategories = async () => {
  const response = await api.get("/all-categories"); // Apne route ke according change karein
  // console.log("Cheking Re: ", response)
  return response.data;
};

// productsAPI.js
export const getTopCategoryProducts = async (categoryName) => {
  const response = await api.get(`/top-category/${categoryName}`); // Apne route ke according change karein
  // console.log("Cheking Re: ", response)
  return response.data;
};

export const getCategoryTopFeaturedProducts = async (categoryName) => {
  const response = await api.get(`/category/${categoryName}/top-featured`);
  // console.log("Cheking getCategoryTopFeaturedProducts: ", response)
  return response.data;
};

export const productService = {
  // Get products by category with pagination
  getProductsByCategory: async (categoryName, page = 1, limit = 20) => {
    try {
      const encodedCategory = encodeURIComponent(categoryName);
      const response = await api.get(`/products/category/${encodedCategory}`, {
        params: { page, limit },
      });
      // console.log("Response from The Get Products By category : ", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching category products:", error);
      throw error;
    }
  },

  // Get featured products for slider (top 4 by rating/discount)
  getFeaturedProducts: async (categoryName, limit = 6) => {
    try {
      const encodedCategory = encodeURIComponent(categoryName);
      const response = await api.get(`/products/category/${encodedCategory}`, {
        params: { page: 1, limit: 50 },
      });
      // console.log("Response from The Get Products By category2 : ", response);

      if (response.data.success) {
        // Filter and sort on client side for featured products
        const featured = response.data.data
          .filter((product) => product.images && product.images.length > 0)
          .sort((a, b) => {
            // Sort by featured flag, then rating, then discount
            if (a.featured !== b.featured) {
              return b.featured ? 1 : -1;
            }
            const ratingDiff = (b.averageRating || 0) - (a.averageRating || 0);
            if (ratingDiff !== 0) return ratingDiff;
            return (b.discount || 0) - (a.discount || 0);
          })
          .slice(0, limit);

        return {
          ...response.data,
          data: featured,
          total: featured.length,
        };
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching featured products:", error);
      throw error;
    }
  },
};
