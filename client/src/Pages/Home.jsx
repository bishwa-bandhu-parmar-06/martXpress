import React, { useEffect, useState } from "react";
import { getHomepageGroupedProducts } from "../API/ProductsApi/productsAPI.js"; // Aapka naya API function
import FileLoader from "../Components/Common/Loader/FileLoader.jsx";
import Slider from "../Components/Home/Slider.jsx";
import CategoryProducts from "../Components/Home/CategoryPoduct.jsx"; // Iska naam CategoryProduct hi rehne dete hain
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
        console.log("Response from Hiome : ", response);
        // Backend JSON structure: response.data.data (array of category groups)
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
      <div className="text-red-500 text-center mt-10 font-bold">{error}</div>
    );

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* 1. Hero Slider */}
      <Slider />

      {/* 2. Top Brands Section */}
      <div className="mx-auto w-full py-4">
        <TopBrands />
      </div>

      {/* 3. DYNAMIC Category Sections */}
      {/* Ab ye loop wahi sections dikhayega jo DB se aaye hain */}
      <div className="mx-auto w-full py-1 space-y-4">
        {groupedData.length > 0 ? (
          groupedData.map((group) => (
            <CategoryProducts
              key={group.categoryName}
              categoryName={group.categoryName}
              dbProducts={group.products} // Saare products jo us category mein hain
              totalCount={group.totalInCategory}
            />
          ))
        ) : (
          <div className="text-center py-20 text-gray-500">
            No products found in database.
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
