import React, { useState } from "react";
import { FaCloudArrowUp } from "react-icons/fa6";
import { MdOutlineAdd } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import { createProduct } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  addProductStart,
  addProductSuccess,
  addProductFailure,
} from "../../Redux/slices/productSlice";

const CreateProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    tags: "",
    productImage: [],
  });
  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = (e) => {
    if (e.target.type === "file") {
      const files = Array.from(e.target.files);
      setFormData({ ...formData, productImage: files });

      // Preview selected images
      const previews = files.map((file) => URL.createObjectURL(file));
      setPreviewImages(previews);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const removeImage = (index) => {
    const updatedFiles = [...formData.productImage];
    updatedFiles.splice(index, 1);

    const updatedPreviews = [...previewImages];
    updatedPreviews.splice(index, 1);

    setFormData({ ...formData, productImage: updatedFiles });
    setPreviewImages(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(addProductStart());

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("brand", formData.brand);
      data.append("stock", formData.stock);
      data.append("tags", formData.tags);

      formData.productImage.forEach((file) => {
        data.append("productImage", file);
      });

      const response = await createProduct(data);
      console.log("Response While adding : ", response);

      if (response.success) {
        toast.success("Product Created Successfully!");
        dispatch(addProductSuccess(response.product));
        navigate("/");
      }
    } catch (error) {
      console.error("Error While Adding Products : ", error);
      toast.error("Cannot add Product.");
      dispatch(addProductFailure(error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-50">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-8 md:p-10">
        <h1 className="text-3xl md:text-4xl mb-6 text-center font-bold">
          <span className="text-[#ff6720]">Create</span>{" "}
          <span className="text-black">Product</span>
        </h1>

        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          {/* Inputs */}
          {[
            { label: "Product Name", name: "name", type: "text" },
            { label: "Description", name: "description", type: "text" },
            { label: "Price", name: "price", type: "number" },
            { label: "Category", name: "category", type: "text" },
            { label: "Brand", name: "brand", type: "text" },
            { label: "Stock", name: "stock", type: "number" },
            { label: "Tags", name: "tags", type: "text" },
          ].map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block font-medium">
                {field.label}:
              </label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={`Enter ${field.label}`}
                className="w-full h-10 border-2 border-[#0050A0] text-black outline-none focus:border-[#ff6720] rounded-xl p-2 mt-1.5"
              />
            </div>
          ))}

          {/* File Upload */}
          <div>
            <label
              htmlFor="images"
              className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-md border border-dashed border-[#ff6720] text-[#ff6720] hover:bg-[#ff6720] hover:text-white transition-all duration-300 w-fit"
            >
              <FaCloudArrowUp />
              Upload Images
            </label>
            <input
              type="file"
              id="images"
              name="productImage"
              onChange={handleChange}
              className="hidden"
              multiple
            />
          </div>

          {/* Image Previews */}
          {previewImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {previewImages.map((src, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 border rounded overflow-hidden"
                >
                  <img
                    src={src}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-500 shadow"
                  >
                    <AiOutlineClose />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Submit Button with Loader */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#ff6720] text-white font-medium rounded-md hover:bg-orange-600 transition-all duration-300 w-full"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding Product...
                </>
              ) : (
                <>
                  <MdOutlineAdd className="text-xl" />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
