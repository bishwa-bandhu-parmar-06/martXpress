import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./Pages/Home";
import AppLoader from "./Components/Common/Loader/AppLoader";
import useInitialLoader from "./hooks/useInitialLoader";
import TopNavbar from "./Components/Navbar/TopNavbar/TopNavbar";
import BottomNavbar from "./Components/Navbar/BottomNavbar/BottomNavbar";
import Footer from "./Components/Footer/Footer";
import CartPage from "./Pages/CartPage";
import SellerAuth from "./Pages/Sellers/SellerAuth";
import Theme from "./Components/Navbar/Theme";
import HelpPage from "./Pages/HelpPage";
import ProductDetailsPage from "./Pages/ProductDetailsPage";
import NotFoundPage from "./Components/Common/NotFoundPage";
import BrandsPage from "./Pages/Brands/BrandsPage";
import BrandPage from "./Pages/Brands/BrandPage";

import CategoriesPage from "./Pages/Category/CategoriesPage";
import CategoryPage from "./Pages/Category/CategoryPage";
import SellersDashboard from "./Pages/Sellers/SellersDashboard";

import { ToastContainer, toast } from "react-toastify";
import UsersAuth from "./Pages/Users/UsersAuth";
import VerifyRegisterLoginOtp from "./Components/Common/Auth/Common/VerifyRegisterLoginOtp";
import UsersDashBoard from "./Pages/Users/UsersDashBoard";
import AdminDashBoard from "./Pages/Admin/AdminDashBoard";
import AdminAuth from "./Pages/Admin/AdminAuth";
import ProtectedRoute from "./Components/Common/ProtectedRoute";

import ScrollToTop from "./Components/Common/ScrollToTop";
const App = () => {
  const isLoading = useInitialLoader();

  if (isLoading) {
    return <AppLoader />;
  }

  return (
    <>
      <Router>
        <ScrollToTop />
        <Theme />
        <ToastContainer />
        <TopNavbar />
        <BottomNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/product/:productId" element={<ProductDetailsPage />} />

          {/* Auth Page */}
          <Route path="/users/auth" element={<UsersAuth />} />
          <Route path="/sellers/auth" element={<SellerAuth />} />
          <Route path="/admins/auth" element={<AdminAuth />} />
          <Route path="/verify-otp" element={<VerifyRegisterLoginOtp />} />

          {/* Dashboard  */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashBoard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UsersDashBoard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sellers/dashboard"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <SellersDashboard />
              </ProtectedRoute>
            }
          />

          {/* All Brands And Single Brand Page */}
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/brand/:brandSlug" element={<BrandPage />} />

          {/* All Categories And Single category  Page */}
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
};

export default App;
