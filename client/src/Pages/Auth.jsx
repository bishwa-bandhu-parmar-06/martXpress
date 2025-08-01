import React, { useState } from "react";
import SellersRegister from "../components/auth/SellersRegister";
import UsersRegister from "../components/auth/UsersRegister";
import AdminRegister from "../components/auth/AdminRegister";
// Assuming Login is for later use or a separate flow, not directly in this registration component.
import Login from "../components/auth/Login";

const Auth = () => {
  const [selectedRole, setSelectedRole] = useState("Users");
  
  const [isLogin, setIsLogin] = useState(true);

  // Define a constant for your primary brand color to easily manage it.
  const primaryColor = "#ff6720";

  const renderRegistrationForm = () => {
    switch (selectedRole) {
      case "Users":
        return <UsersRegister setIsLogin={setIsLogin} />;
      case "Admin":
        return <AdminRegister setIsLogin={setIsLogin} />;
      case "Sellers":
        return <SellersRegister setIsLogin={setIsLogin} />;
      default:
        return null; // Should ideally not happen with predefined roles
    }
  };

  return (
    <div className="auth-container w-[90%] m-auto min-h-screen  shadow-lg flex flex-col md:flex-row items-center justify-center p-4">
      {/* Left Section: Logo */}
      <div className="auth-logo-section w-full md:w-1/3 flex justify-center items-center p-6">
        <img
          src="./logo.png"
          alt="Company Logo"
          className="max-w-xs md:max-w-sm lg:max-w-md object-contain"
        />
      </div>

      {/* Right Section: Registration Forms */}
      <div className="auth-form-section w-full md:w-2/3 min-h-screen flex flex-col items-center pt-8 md:pt-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
          <span style={{ color: primaryColor }}>
            {isLogin ? "Login" : "Registration"}
          </span>{" "}
          <span className="text-gray-900">Form</span>
        </h1>
        {!isLogin && (
          <div
            className="role-tabs-container w-full max-w-lg mx-auto flex justify-center items-center rounded-2xl shadow-lg p-3"
            style={{ backgroundColor: primaryColor }}
          >
            <ul className="flex justify-around items-center gap-4 sm:gap-8 text-white font-semibold text-lg flex-wrap">
              {["Users", "Sellers", "Admin"].map((role) => (
                <li
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`
                  role-tab-item
                  px-5 py-2 cursor-pointer rounded-xl transition-all duration-300 ease-in-out
                  ${
                    selectedRole === role
                      ? "bg-white text-orange-600 shadow-md"
                      : "hover:bg-white hover:text-orange-600 hover:shadow-md"
                  }
                `}
                >
                  {role}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Dynamic Registration Form */}
        <div className="registration-form-display mt-8 w-full max-w-3xl flex justify-center items-center">
          {isLogin ? (
            <Login setIsLogin={setIsLogin} />
          ) : (
            renderRegistrationForm()
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
