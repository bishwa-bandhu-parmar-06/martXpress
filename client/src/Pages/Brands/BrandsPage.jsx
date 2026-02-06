// pages/BrandsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBrands } from "@/API/Common/brandsApi";
import { toBrandSlug } from "@/utils/brandSlug";

const BrandsPage = () => {
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await getAllBrands();
        if (res?.status === 200) {
          setBrands(res.brands || []);
        }
      } catch (err) {
        console.error("Failed to fetch brands", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleBrandClick = (brand) => {
    const slug = toBrandSlug(brand);
    navigate(`/brand/${slug}`, {
      state: { brand },
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-gray-500 text-lg">
          Loading brands...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          All Brands
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Browse products by your favorite brands
        </p>
      </div>

      {/* Brands Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {brands.map((brand, index) => (
          <div
            key={index}
            onClick={() => handleBrandClick(brand)}
            className="
              group cursor-pointer bg-white dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              rounded-xl p-6 flex items-center justify-center
              text-lg font-semibold text-gray-800 dark:text-gray-100
              transition-all duration-300
              hover:scale-105 hover:border-primary hover:text-primary
              hover:shadow-xl
            "
          >
            <span className="relative">
              {brand}
              <span
                className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 
                group-hover:scale-x-100 transition-transform origin-left"
              />
            </span>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!brands.length && (
        <div className="text-center text-gray-500 mt-20">
          No brands available right now.
        </div>
      )}
    </div>
  );
};

export default BrandsPage;
