import React from "react";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// importing components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// importing pages
import Home from "./Pages/Home";
import Contact from "./Pages/Contact";
import About from "./Pages/About";
import Services from "./Pages/Services";
import Auth from "./Pages/Auth";
import SellersProfile from "./Pages/sellers/SellersProfile";
import UsersProfile from "./Pages/users/UsersProfile";
import AdminProfile from "./Pages/admin/AdminProfile";
import UnAuthorize from "./Pages/UnAuthorize";

// importing protected routes components
import ProtectedRoute from "./components/ProtectedPage/ProtectedRoute";

const App = () => {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/seller-auth" element={<Auth />} />
          <Route path="/unauthorized" element={<UnAuthorize />} />
          <Route
            path="/seller/profile"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <SellersProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/profile"
            element={
              <ProtectedRoute allowedRoles={["users"]}>
                <UsersProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored" // Use the 'colored' theme
        />
        <Footer />
      </Router>
    </>
  );
};

export default App;
