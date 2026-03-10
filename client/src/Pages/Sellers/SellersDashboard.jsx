/**
 * SellersDashboard.jsx — Main Entry Point
 * MartXpress Seller Dashboard
 */
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "sonner";

import Sidebar from "./Sidebar.jsx";
import TopBar from "./TopBar.jsx";
import DashboardFooter from "./DashboardFooter.jsx";

import OverviewPage from "./OverviewPage.jsx";
import AllProducts from "./AllProducts.jsx"; 
import AllOrders from "./AllOrders.jsx"; 
import AnalyticsDashboard from "./AnalyticsDashboard.jsx";
import SettingsPage from "./SettingsPage.jsx";

import AddProduct from "./AddProduct.jsx";
import EditProduct from "./EditProduct.jsx";

import { getSellersDetails } from "../../API/Sellers/SellersApi.js";
import { clearAuthData } from "../../utils/auth.js";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "products", label: "Products" },
  { id: "orders", label: "Orders" },
  { id: "analytics", label: "Analytics" },
  { id: "settings", label: "Settings" },
];

const SellersDashboard = () => {
  const navigate = useNavigate();

  /* ── UI State ─────────────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  /* ── Dark Mode ────────────────────────────────────────────────── */
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  /* ── Seller Data ──────────────────────────────────────────────── */
  const [seller, setSeller] = useState(null);
  const [sellerLoading, setSellerLoading] = useState(true);

  const fetchSeller = useCallback(async () => {
    try {
      setSellerLoading(true);
      const res = await getSellersDetails();
      setSeller(res.seller);
    } catch (err) {
      console.error("Failed to fetch seller:", err);
    } finally {
      setSellerLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeller();
  }, [fetchSeller]);

  /* ── Modals ───────────────────────────────────────────────────── */
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditProductOpen(true);
  };

  /* ── Auth ─────────────────────────────────────────────────────── */
  const handleLogout = () => {
    clearAuthData();
    navigate("/");
  };

  /* ── Render ───────────────────────────────────────────────────── */
  return (
    <>
      {/* Sonner toast container */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: { fontFamily: "'DM Sans', sans-serif" },
        }}
      />

      <div className="flex h-screen bg-[#F4F6FA] dark:bg-[#0D0F17] font-['DM_Sans',sans-serif] overflow-hidden">
        {/* ── Sidebar ─────────────────────────────────────────────── */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setMobileSidebarOpen(false);
          }}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
          seller={seller}
          onLogout={handleLogout}
          onAddProduct={() => setIsAddProductOpen(true)}
        />

        {/* ── Main Area ───────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Top Bar */}
          <TopBar
            activeTab={activeTab}
            seller={seller}
            sellerLoading={sellerLoading}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onMobileMenuToggle={() => setMobileSidebarOpen(true)}
            onAddProduct={() => setIsAddProductOpen(true)}
          />

          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6 lg:p-8 max-w-400 mx-auto">
              {activeTab === "overview" && (
                <OverviewPage
                  seller={seller}
                  onNavigate={setActiveTab}
                  onAddProduct={() => setIsAddProductOpen(true)}
                  onEditProduct={handleEditProduct}
                />
              )}
              {activeTab === "products" && <AllProducts />}
              {activeTab === "orders" && <AllOrders />}
              {activeTab === "analytics" && <AnalyticsDashboard />}
              {activeTab === "settings" && <SettingsPage />}
            </div>
          </main>

          {/* Footer */}
          <DashboardFooter
            seller={seller}
            onNavigate={setActiveTab}
            onLogout={handleLogout}
          />
        </div>
      </div>

      {/* ── Global Modals ─────────────────────────────────────────── */}
      <AddProduct
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
      />
      <EditProduct
        isOpen={isEditProductOpen}
        productData={selectedProduct}
        onClose={() => {
          setIsEditProductOpen(false);
          setSelectedProduct(null);
        }}
      />
    </>
  );
};

export default SellersDashboard;
