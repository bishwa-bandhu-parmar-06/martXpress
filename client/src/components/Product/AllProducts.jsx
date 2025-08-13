import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AllProducts = () => {
  const navigate = useNavigate();
  const Products = useSelector((state) => state.product.products);
  console.log("All products : ", Products);

  return (
    <div className="mt-5">
      <h2>All Products</h2>
      <button onClick={() => navigate("/sellers/add-product")}>
        Add Product
      </button>
      <button onClick={() => navigate("/sellers/update-product")}>
        Update Product
      </button>

      <div className="border-2 mt-4">
        <ul style={{ listStyle: "none", padding: 0 }}>
          {Products.map((product) => (
            <li
              key={product.slug}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {/* Image */}
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    color: "#555",
                  }}
                >
                  No Image
                </div>
              )}

              {/* Product Info */}
              <div>
                <h3 style={{ margin: 0 }}>{product.name}</h3>
                <p style={{ margin: "5px 0" }}>Price: ${product.price}</p>
                <p style={{ margin: 0, fontSize: "12px", color: "#777" }}>
                  Category: {product.category}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AllProducts;
