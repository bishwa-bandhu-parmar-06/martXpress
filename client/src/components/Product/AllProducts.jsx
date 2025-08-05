import React from "react";

import { useNavigate } from "react-router-dom";

const AllProducts = () => {
  const navigate = useNavigate();
  return (
    <div className="mt-5">
      AllProducts
      <button onClick={() => navigate("/sellers/add-product")}>
        Add Product
      </button>
      <button onClick={() => navigate("/sellers/update-product")}>
        Update Product
      </button>
    </div>
  );
};

export default AllProducts;
