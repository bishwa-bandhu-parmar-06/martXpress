import React, { useEffect, useState } from "react";
import { fetchAllProductsForHomePage } from "../API/Home/fetchAllProductApi.js";
import FileLoader from "../Components/Common/Loader/FileLoader.jsx";
import Slider from "../Components/Home/Slider.jsx";
import CategoryProduct from "../Components/Home/CategoryPoduct.jsx";
import TopBrands from "../Components/Home/TopBrands.jsx";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const categories = [
    "Electronics",
    "TV & Appliances",
    "Mobiles & Tablets",
    "Fashion",
    "Beauty & Personal Care",
    "Home & Furniture",
    "Grocery",
  ];
  // useEffect(() => {
  //   const getProducts = async () => {
  //     try {
  //       const data = await fetchAllProductsForHomePage();
  //       console.log("API Data:", data);
  //       setProducts(Array.isArray(data) ? data : data.products || []);
  //     } catch (err) {
  //       setError(err.message || "Failed to fetch Products");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   getProducts();
  // }, []);

  // if (loading) return <FileLoader size={60} />;
  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div>
      <Slider />
      {/* <HomeProductsList products={products} /> */}

      <div className=" mx-auto w-full py-4">
        <TopBrands />
      </div>
      {/* Category Sections */}
      <div className=" mx-auto w-full py-1">
        {categories.map((category) => (
          <CategoryProduct key={category} categoryName={category} />
        ))}
      </div>
    </div>
  );
};

export default Home;
