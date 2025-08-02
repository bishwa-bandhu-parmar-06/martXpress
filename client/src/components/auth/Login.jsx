import React, { useState } from "react";
import { toast } from "react-toastify";
import { loginRole } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../Redux/slices/authSlice";
const Login = ({ setIsLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    try {
      const response = await loginRole(formData);
      console.log("Login Response : ", response);

      if (response.success) {
        const role = response.users.role;
        toast.success("Login Success");
        dispatch(loginSuccess({isLoggedIn: true, role}));
        setFormData({
          email: "",
          password: "",
        });
        if (role === "seller") {
          navigate("/seller/profile");
        } else if (role === "admin") {
          navigate("/admin/profile");
        } else if (role === "users") {
          navigate("/users/profile");
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Login Submit Error : ", error);
      toast.error("Something Went Wrong!");
    }
  };
  const [showPassowrd, setShowPassword] = useState(false);
  const togglePassword = () => {
    setShowPassword(!showPassowrd);
  };
  return (
    <div className="min-h-screen">
      <div className="w-full max-w-md p-10 bg-white shadow-lg rounded-2xl">
        <h1 className="text-[#ff6720] text-center font-bold text-4xl mb-8">
          <span>Login</span>
        </h1>
        <form action="" className="flex flex-col items-center">
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

          <div className="w-full mb-1 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password :
            </label>
            <input
              className="w-full h-10 border-2 border-[#0050A0] text-[#0050A0] outline-none focus:border-[#ff6720] rounded-xl p-2 pr-10"
              type={showPassowrd ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Your Password"
            />
            <img
              onClick={togglePassword}
              className="h-6 w-6 absolute top-11 right-3 transform -translate-y-1/2 cursor-pointer"
              src={showPassowrd ? "./eyeOpen.svg" : "./eyeClose.svg"}
              alt="Toggle password visibility"
            />
          </div>

          <div className="w-full text-right mt-2 mb-4">
            <p className="text-sm text-[#ff6720] hover:text-[#0050A0] hover:underline cursor-pointer transition duration-200">
              <span>Forgot </span>
              <span className="text-black">Password?</span>
            </p>
          </div>
          <div className="w-full">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              type="button"
              id="submitbtn"
              className={`w-full h-12 text-xl bg-[#ff6720] cursor-pointer text-white font-semibold rounded-2xl hover:bg-[#e25a1b] transition duration-200 ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#e25a1b]"}`}
            >
              Login
            </button>
          </div>
          <div className="flex items-center justify-end m-3">
            <p
              onClick={() => setIsLogin(false)}
              className="text-md  hover:text-[#0050A0] text-[#ff6720] hover:underline cursor-pointer transition duration-200"
            >
              Don't have account ?{" "}
              <span className="text-black hover:underline">Register here</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
