import React, { useEffect, useState } from "react";
import { getHomepageGroupedProducts } from "../API/ProductsApi/productsAPI.js";
import FileLoader from "../Components/Common/Loader/FileLoader.jsx";
import Slider from "../Components/Home/Slider.jsx";
import CategoryProducts from "../Components/Home/CategoryPoduct.jsx";
import TopBrands from "../Components/Home/TopBrands.jsx";

const Home = () => {
  const [groupedData, setGroupedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getGroupedProducts = async () => {
      try {
        setLoading(true);
        const response = await getHomepageGroupedProducts();
        if (response.success) {
          setGroupedData(response.data);
        } else {
          setError("Failed to fetch categorized products");
        }
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message || "Failed to fetch Products");
      } finally {
        setLoading(false);
      }
    };

    getGroupedProducts();
  }, []);

  if (loading) return <FileLoader size={60} />;

  if (error)
    return (
      <div className="text-red-500 text-center mt-10 font-bold px-4">
        {error}
      </div>
    );

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-12 sm:pb-16 lg:pb-24">
      {/* 1. Hero Slider (Usually full width) */}
      <Slider />

      {/* Main Content Container with Max-Width for Ultrawide screens & Responsive Padding */}
      <div className="max-w-400 mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* 2. Top Brands Section */}
        <div className="py-4 sm:py-6 lg:py-8 mt-2 sm:mt-4">
          <TopBrands />
        </div>

        {/* 3. DYNAMIC Category Sections */}
        {/* Responsive gap between categories: smaller on mobile, larger on desktop */}
        <div className="space-y-6 sm:space-y-8 lg:space-y-12">
          {groupedData.length > 0 ? (
            groupedData.map((group) => (
              <CategoryProducts
                key={group.categoryName}
                categoryName={group.categoryName}
                dbProducts={group.products}
                totalCount={group.totalInCategory}
              />
            ))
          ) : (
            <div className="text-center py-20 text-gray-500 px-4">
              No products found in database.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
