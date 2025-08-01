import React, { useState } from "react";
import { toast } from "react-toastify";
import { registerSellers } from "../../api/api";

const SellersRegister = ({ setIsLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gst_Number: "",
    gst_Certificate: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "gst_Certificate") {
      setFormData({ ...formData, gst_Certificate: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleSubmit = async () => {
    try {
      const response = await registerSellers(formData);
      console.log("Sellers data : ", response);
      if (response.success) {
        toast.success("Register Success");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          gst_Number: "",
          gst_Certificate: "",
        });
        setIsLogin(true);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Submit Sellers Form : ", error);
      toast.error("Something Went wrong");
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showCpassword, setShowCpassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleCPassword = () => {
    setShowCpassword(!showCpassword);
  };

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-md p-10 bg-white shadow-lg rounded-2xl">
        <h1 className="text-[#ff6720] text-center font-bold text-4xl mb-8">
          <span>Seller</span> <span className="text-black">Register</span>
        </h1>
        <form action="" className="flex flex-col items-center">
          <div className="w-full mb-4">
            <label
              htmlFor="sellername"
              className="block text-sm font-medium text-gray-700"
            >
              Name :
            </label>
            <input
              className="w-full h-10 border-2 border-[#0050A0] text-[#0050A0] outline-none focus:border-[#ff6720] rounded-xl p-2 mt-1.5"
              type="text"
              id="sellername"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Your Name"
            />
          </div>

          <div className="w-full mb-4">
            <label
              htmlFor="selleremail"
              className="block text-sm font-medium text-gray-700"
            >
              Email :
            </label>
            <input
              className="w-full h-10 border-2 border-[#0050A0] text-[#0050A0] outline-none focus:border-[#ff6720] rounded-xl p-2 mt-1.5"
              type="email"
              id="selleremail"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Your Email"
            />
          </div>

          <div className="w-full mb-4">
            <label
              htmlFor="gstNo"
              className="block text-sm font-medium text-gray-700"
            >
              GST No. :
            </label>
            <input
              className="w-full h-10 border-2 border-[#0050A0] text-[#0050A0] outline-none focus:border-[#ff6720] rounded-xl p-2 mt-1.5"
              type="text"
              id="gstNo"
              name="gst_Number"
              value={formData.gst_Number}
              onChange={handleChange}
              placeholder="Enter GST No."
            />
          </div>

          <div className="w-full mb-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password :
            </label>
            <input
              className="w-full h-10 border-2 border-[#0050A0] text-[#0050A0] outline-none focus:border-[#ff6720] rounded-xl p-2 pr-10"
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Your Password"
            />
            <img
              onClick={togglePassword}
              className="h-6 w-6 absolute top-11 right-3 transform -translate-y-1/2 cursor-pointer"
              src={showPassword ? "./eyeOpen.svg" : "./eyeClose.svg"}
              alt="Toggle password visibility"
            />
          </div>

          <div className="w-full mb-4 relative">
            <label
              htmlFor="cPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password :
            </label>
            <input
              className="w-full h-10 border-2 border-[#0050A0] text-[#0050A0] outline-none focus:border-[#ff6720] rounded-xl p-2 pr-10"
              type={showCpassword ? "text" : "password"}
              id="cPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Enter Your Confirm Password"
            />
            <img
              onClick={toggleCPassword}
              className="h-6 absolute top-11 right-3 transform -translate-y-1/2 cursor-pointer"
              src={showCpassword ? "./eyeOpen.svg" : "./eyeClose.svg"}
              alt="Toggle password visibility"
            />
          </div>

          <div className="w-full mb-6">
            <label
              htmlFor="gstCertificate"
              className="block text-sm font-medium text-gray-700"
            >
              GST Certificate :
            </label>
            <input
              className="w-full h-10 border-2 border-[#0050A0] text-[#0050A0] outline-none focus:border-[#ff6720] rounded-xl p-2 mt-1.5"
              type="file"
              id="gstCertificate"
              name="gst_Certificate"
              onChange={handleChange}
            />
          </div>

          <div className="w-full">
            <button
              onClick={handleSubmit}
              type="button"
              id="submitbtn"
              className="w-full h-12 bg-[#ff6720] cursor-pointer text-white font-semibold rounded-2xl hover:bg-[#e25a1b] transition duration-200"
            >
              Register
            </button>
          </div>
          <div className="flex items-center justify-end m-3">
            <p
              onClick={() => setIsLogin(true)}
              className="text-md  hover:text-[#0050A0] text-[#ff6720] hover:underline cursor-pointer transition duration-200"
            >
              Already have an account ?{" "}
              <span className="text-black hover:underline">Login here</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellersRegister;
