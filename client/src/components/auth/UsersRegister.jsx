import React, { useState } from "react";
import { registerUsers } from "../../api/api";
import { toast } from "react-toastify";
const UsersRegister = ({ setIsLogin }) => {
  // -----------------  STARTING FORM DATA  -------------------------------
  //state for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // now for checking the chnages in the input or fileds
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // functions for submitting the form
  const handleSubmit = async () => {
    try {
      const response = await registerUsers(formData);
      // console.log("Checking Response : ", response);
      if (response.success) {
        toast.success("Register Successfull.");
        // ✅ Clear the form
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setIsLogin(true);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error from Submitting Form : ", error);
      toast.error("Something went wrong!");
    }
  };

  // -----------------  ENDING FORM DATA  -------------------------------

  // -----------------  STARTING SHOW PASSWORD OR CONFIRM PASSWORD  ------------------------
  // state for the show password and confirm password
  const [showPassword, setShowPassword] = useState(false);
  const [showCpassword, setShowCpassword] = useState(false);

  // show on or off the password
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  // show on or of the confirm password
  const toggleCPassword = () => {
    setShowCpassword(!showCpassword);
  };
  // ---------------------- ENDING SHOW PASSWORD OR CONFIRM PASSWORD  ---------------------
  return (
    <div className="min-h-screen">
      <div className="w-full max-w-md p-10 bg-white shadow-lg rounded-2xl">
        <h1 className="text-[#ff6720] text-center font-bold text-4xl mb-8">
          <span>User</span> <span className="text-black">Register</span>
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
              name="name"
              value={formData.name}
              onChange={handleChange}
              id="sellername"
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
              name="email"
              value={formData.email}
              onChange={handleChange}
              id="selleremail"
              placeholder="Enter Your Email"
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              id="password"
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
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              id="cPassword"
              placeholder="Enter Your Confirm Password"
            />
            <img
              onClick={toggleCPassword}
              className="h-6 absolute top-11 right-3 transform -translate-y-1/2 cursor-pointer"
              src={showCpassword ? "./eyeOpen.svg" : "./eyeClose.svg"}
              alt="Toggle password visibility"
            />
          </div>

          <div className="w-full">
            <button
              type="button"
              id="submitbtn"
              onClick={handleSubmit}
              className="w-full h-12  text-xl bg-[#ff6720] cursor-pointer text-white font-semibold rounded-2xl hover:bg-[#e25a1b] transition duration-200"
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

export default UsersRegister;
