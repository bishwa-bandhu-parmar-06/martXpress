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
import { Toaster } from "./components/ui/sonner";
import UsersAuth from "./Pages/Users/UsersAuth";
import UsersDashBoard from "./Pages/Users/UsersDashBoard";
import AdminDashBoard from "./Pages/Admin/AdminDashBoard";
import AdminAuth from "./Pages/Admin/AdminAuth";
import ProtectedRoute from "./Components/Common/ProtectedRoute";
import GuestRoute from "./Components/Common/GuestRoute"; // <-- Import GuestRoute
import ScrollToTop from "./Components/Common/ScrollToTop";
import WishlistPage from "./Pages/WishlistPage";
import AuthDataLoader from "./Features/Cart/AuthDataLoader";
import CheckoutPage from "./Pages/Checkout/CheckoutPage";
import OrderDetailsPage from "./Pages/Users/OrderDetailsPage";
import SearchPage from "./Pages/SearchPage";

const App = () => {
  const isLoading = useInitialLoader();

  if (isLoading) {
    return <AppLoader />;
  }

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Router>
        <AuthDataLoader />
        <ScrollToTop />
        <Theme />
        <TopNavbar />
        <BottomNavbar />
        <Routes>
          {/* ========================================== */}
          {/* PUBLIC ROUTES (Accessible by anyone) */}
          {/* ========================================== */}
          <Route path="/" element={<Home />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/product/:productId" element={<ProductDetailsPage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/brand/:brandSlug" element={<BrandPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          {/* ========================================== */}
          {/* GUEST ROUTES (Only accessible if NOT logged in) */}
          {/* ========================================== */}
          <Route
            path="/users/auth"
            element={
              <GuestRoute>
                <UsersAuth />
              </GuestRoute>
            }
          />
          <Route
            path="/sellers/auth"
            element={
              <GuestRoute>
                <SellerAuth />
              </GuestRoute>
            }
          />
          <Route
            path="/admins/auth"
            element={
              <GuestRoute>
                <AdminAuth />
              </GuestRoute>
            }
          />

          {/* ========================================== */}
          {/* USER PROTECTED ROUTES (Buyers Only) */}
          {/* ========================================== */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/order/:orderId"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <OrderDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <CheckoutPage />
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

          {/* ========================================== */}
          {/* SELLER PROTECTED ROUTES (Vendors Only) */}
          {/* ========================================== */}
          <Route
            path="/sellers/dashboard"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <SellersDashboard />
              </ProtectedRoute>
            }
          />

          {/* ========================================== */}
          {/* ADMIN PROTECTED ROUTES (Staff Only) */}
          {/* ========================================== */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashBoard />
              </ProtectedRoute>
            }
          />

          {/* ========================================== */}
          {/* 404 NOT FOUND */}
          {/* ========================================== */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
};

export default App;
