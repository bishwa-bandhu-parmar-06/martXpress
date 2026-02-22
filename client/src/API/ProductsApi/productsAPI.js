import api from "../axiosInstance";

// ---------------------------------------------
export const getAllProductsOfLoggedInSeller = async (page = 1, limit = 10) => {
  const response = await api.get(
    `/sellers/products/my-products?page=${page}&limit=${limit}`,
  );
  return response.data;
};

export const AddProductsForLoggedInSeller = async (formData) => {
  const response = await api.post("/sellers/products/add", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteProductsForLoggedInSeller = async (productId) => {
  const response = await api.post(`/sellers/products/delete/${productId}`);
  return response.data;
};

export const getAllTypeProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const getSingleProductDetails = async (productId) => {
  const response = await api.get(`/product/${productId}`);
  return response.data;
};

export const editProductDetails = async (formData) => {
  const productId = formData.get("productId");
  const response = await api.post(
    `/sellers/products/update/${productId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const getHomepageGroupedProducts = async () => {
  const response = await api.get("/homepage-grouped");
  return response.data;
};

export const fetchHeroSliderProducts = async () => {
  const response = await api.get("/hero-slider");
  return response.data;
};

export const getProductsByCategory = async (categoryName) => {
  const response = await api.get(`/products/category/${categoryName}`);
  return response.data;
};

export const getAllCategories = async () => {
  const response = await api.get("/all-categories");
  return response.data;
};

export const getTopCategoryProducts = async (categoryName) => {
  const response = await api.get(`/top-category/${categoryName}`);
  return response.data;
};

export const getCategoryTopFeaturedProducts = async (categoryName) => {
  const response = await api.get(`/category/${categoryName}/top-featured`);
  return response.data;
};

export const productService = {
  getProductsByCategory: async (categoryName, page = 1, limit = 20) => {
    const encodedCategory = encodeURIComponent(categoryName);
    const response = await api.get(`/products/category/${encodedCategory}`, {
      params: { page, limit },
    });
    return response.data;
  },

  getFeaturedProducts: async (categoryName, limit = 6) => {
    const encodedCategory = encodeURIComponent(categoryName);
    const response = await api.get(`/products/category/${encodedCategory}`, {
      params: { page: 1, limit: 50 },
    });

    if (response.data.success) {
      const featured = response.data.data
        .filter((product) => product.images && product.images.length > 0)
        .sort((a, b) => {
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
  },
};
