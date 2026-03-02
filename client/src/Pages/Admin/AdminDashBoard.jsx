import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Settings } from "lucide-react"; // Used for the inline fallback tab

// Components
import FileLoader from "../../Components/Common/Loader/FileLoader";
import { ConfirmDialog } from "../../Components/Common/Auth/Common/ConfirmDialog";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { DashboardTab } from "./DashboardTab";
import { SellersTab } from "./SellersTab";
import { ProductsTab } from "./ProductsTab"; // <--- ADDED ProductsTab
import { ProfileTab } from "./ProfileTab";
import { AddressesTab } from "./AddressesTab";
import { OrdersTab } from "./OrdersTab";
import { SettingsTab } from "./SettingsTab";
import { ProfileModal } from "./ProfileModal";
import { AddressModal } from "./AddressModal";
import { SellerProfileModal } from "./SellerProfileModal";

// Utils & API
import { removeAuthToken, removeUserRole } from "../../utils/auth";
import { logout, updateUser } from "../../Features/auth/AuthSlice";
import {
  getAdminProfile,
  getPendingAccountForSellers,
  getApprovedAccountOfSellers,
  getRejectededAccountOfSellers,
  approveAccountOfSellers,
  rejectAccountOfSellers,
  deleteSellersAccountBySellersId,
  getAdminDashboardStats,
  getSellersAccountBySellersId,
  updateAdminDetails,
  addAdminAddress,
  getAllAdminAddresses,
  updateAdminAddress,
  getAllProductsForAdmin,
  deleteProductByAdmin,
  removeAdminAddress,
} from "../../API/Admin/adminApi";

const initialAddressState = {
  fullName: "",
  mobile: "",
  house: "",
  street: "",
  landmark: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Data State
  const [admin, setAdmin] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [approvedSellers, setApprovedSellers] = useState([]);
  const [rejectedSellers, setRejectedSellers] = useState([]);
  const [products, setProducts] = useState([]); // <--- Products State

  // UI State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Address States
  const [adminAddresses, setAdminAddresses] = useState([]);
  const [selectedAdminAddressId, setSelectedAdminAddressId] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressFormData, setAddressFormData] = useState(initialAddressState);
  const [isAddressSubmitting, setIsAddressSubmitting] = useState(false);

  // Profile States
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);

  // Modal/Dialog Delete States
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [sellerToDelete, setSellerToDelete] = useState(null);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null); // <--- Product Delete State

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New seller registration",
      time: "10 min ago",
      read: false,
    },
  ]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [
        adminRes,
        pendingRes,
        approvedRes,
        rejectedRes,
        statsRes,
        addressRes,
        productsRes,
      ] = await Promise.all([
        getAdminProfile(),
        getPendingAccountForSellers(),
        getApprovedAccountOfSellers(),
        getRejectededAccountOfSellers(),
        getAdminDashboardStats(),
        getAllAdminAddresses(),
        getAllProductsForAdmin(),
      ]);

      setAdmin(adminRes.admin);
      setPendingSellers(pendingRes.sellers || []);
      setApprovedSellers(approvedRes.sellers || []);
      setRejectedSellers(rejectedRes.sellers || []);
      setDashboardStats(statsRes.stats);
      setProducts(productsRes.products || []);

      const fetchedAddresses = addressRes.addresses || [];
      setAdminAddresses(fetchedAddresses);
      if (fetchedAddresses.length > 0) {
        setSelectedAdminAddressId(fetchedAddresses[0]._id);
      }
    } catch (err) {
      setError("Failed to load dashboard data");
      toast.error("Error loading dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // ----------------------------------------
  // SELLER HANDLERS
  // ----------------------------------------
  const handleApproveSeller = async (sellerId) => {
    try {
      await approveAccountOfSellers(sellerId);
      toast.success("Seller approved successfully!");
      const sellerToMove = pendingSellers.find((s) => s._id === sellerId);
      if (sellerToMove) {
        setPendingSellers(pendingSellers.filter((s) => s._id !== sellerId));
        setApprovedSellers([
          ...approvedSellers,
          { ...sellerToMove, verified: "approved" },
        ]);
        setDashboardStats((prev) => ({
          ...prev,
          approvedSellers: prev.approvedSellers + 1,
        }));
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to approve seller");
    }
  };

  const handleRejectSeller = async (sellerId) => {
    try {
      await rejectAccountOfSellers(sellerId);
      toast.success("Seller rejected.");
      const sellerToMove = pendingSellers.find((s) => s._id === sellerId);
      if (sellerToMove) {
        setPendingSellers(pendingSellers.filter((s) => s._id !== sellerId));
        setRejectedSellers([
          ...rejectedSellers,
          { ...sellerToMove, verified: "rejected" },
        ]);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reject seller");
    }
  };

  const confirmDeleteSeller = async () => {
    if (!sellerToDelete) return;
    try {
      await deleteSellersAccountBySellersId(sellerToDelete);
      toast.success("Seller deleted successfully.");
      setPendingSellers((prev) => prev.filter((s) => s._id !== sellerToDelete));
      setApprovedSellers((prev) =>
        prev.filter((s) => s._id !== sellerToDelete),
      );
      setRejectedSellers((prev) =>
        prev.filter((s) => s._id !== sellerToDelete),
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete seller");
    } finally {
      setSellerToDelete(null);
    }
  };

  const handleViewSellerDetails = async (sellerId) => {
    try {
      const res = await getSellersAccountBySellersId(sellerId);
      setSelectedSeller(res.seller);
    } catch (err) {
      toast.error("Failed to load seller details");
    }
  };

  // ----------------------------------------
  // PRODUCT HANDLERS
  // ----------------------------------------
  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await deleteProductByAdmin(productToDelete);
      toast.success("Product deleted successfully.");
      setProducts((prev) => prev.filter((p) => p._id !== productToDelete));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete product.");
    } finally {
      setProductToDelete(null);
    }
  };

  // ----------------------------------------
  // PROFILE HANDLERS
  // ----------------------------------------
  const handleAdminProfileSubmit = async (e) => {
    e.preventDefault();
    setIsProfileSubmitting(true);
    try {
      const res = await updateAdminDetails(profileFormData);
      setAdmin(res.admin);
      dispatch(updateUser({ name: res.admin.name, email: res.admin.email }));
      toast.success("Admin details updated successfully!");
      setIsProfileModalOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsProfileSubmitting(false);
    }
  };

  // ----------------------------------------
  // ADDRESS HANDLERS
  // ----------------------------------------
  const handleAdminAddressSubmit = async (e) => {
    e.preventDefault();
    setIsAddressSubmitting(true);
    try {
      if (editingAddressId) {
        const res = await updateAdminAddress(editingAddressId, addressFormData);
        setAdminAddresses(
          adminAddresses.map((addr) =>
            addr._id === editingAddressId ? res.address || res.data : addr,
          ),
        );
        toast.success("Address updated successfully!");
      } else {
        const res = await addAdminAddress(addressFormData);
        const newAddress = res.address || res.data;
        setAdminAddresses([...adminAddresses, newAddress]);
        if (adminAddresses.length === 0)
          setSelectedAdminAddressId(newAddress._id);
        toast.success("Address added successfully!");
      }
      setIsAddressModalOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save address.");
    } finally {
      setIsAddressSubmitting(false);
    }
  };

  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return;
    try {
      await removeAdminAddress(addressToDelete);
      const filteredAddresses = adminAddresses.filter(
        (addr) => addr._id !== addressToDelete,
      );
      setAdminAddresses(filteredAddresses);
      if (selectedAdminAddressId === addressToDelete) {
        setSelectedAdminAddressId(
          filteredAddresses.length > 0 ? filteredAddresses[0]._id : null,
        );
      }
      toast.success("Address removed successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete address.");
    } finally {
      setAddressToDelete(null);
    }
  };

  // ----------------------------------------
  // LOGOUT HANDLER
  // ----------------------------------------
  const handleLogout = () => {
    removeAuthToken();
    removeUserRole();
    dispatch(logout());
    navigate("/");
  };

  if (loading) return <FileLoader />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">
        {error}
      </div>
    );

  // List of active tabs that have actual components
  const activeComponentsList = [
    "dashboard",
    "sellers",
    "products",
    "profile",
    "addresses",
    "orders",
    "settings",
  ];

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300 h-full">
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          pendingSellersCount={pendingSellers.length}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader
            admin={admin}
            handleLogout={handleLogout}
            fetchAllData={fetchAllData}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            notifications={notifications}
          />

          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight capitalize">
                {activeTab.replace("-", " ")}
              </h2>
            </div>

            {/* TAB CONTENTS */}
            {activeTab === "dashboard" && (
              <DashboardTab
                dashboardStats={dashboardStats}
                pendingSellersCount={pendingSellers.length}
              />
            )}

            {activeTab === "products" && (
              <ProductsTab
                products={products}
                setProductToDelete={setProductToDelete}
              />
            )}

            {activeTab === "sellers" && (
              <SellersTab
                pendingSellers={pendingSellers}
                approvedSellers={approvedSellers}
                rejectedSellers={rejectedSellers}
                handleViewSellerDetails={handleViewSellerDetails}
                handleApproveSeller={handleApproveSeller}
                handleRejectSeller={handleRejectSeller}
                setSellerToDelete={setSellerToDelete}
              />
            )}

            {activeTab === "profile" && (
              <ProfileTab
                profileData={admin}
                onEdit={() => {
                  setProfileFormData({
                    name: admin?.name || "",
                    email: admin?.email || "",
                    mobile: admin?.mobile || "",
                  });
                  setIsProfileModalOpen(true);
                }}
              />
            )}

            {activeTab === "addresses" && (
              <AddressesTab
                addresses={adminAddresses}
                selectedAddressId={selectedAdminAddressId}
                onSelectAddress={setSelectedAdminAddressId}
                onAdd={() => {
                  setAddressFormData(initialAddressState);
                  setEditingAddressId(null);
                  setIsAddressModalOpen(true);
                }}
                onEdit={(addr) => {
                  setAddressFormData({
                    ...addr,
                    landmark: addr.landmark || "",
                  });
                  setEditingAddressId(addr._id);
                  setIsAddressModalOpen(true);
                }}
                onDelete={(id) => setAddressToDelete(id)}
              />
            )}

            {activeTab === "orders" && <OrdersTab />}

            {activeTab === "settings" && (
              <SettingsTab profileData={admin} onLogout={handleLogout} />
            )}

            {/* Inline Fallback for any underdeveloped tabs (like Customers/Analytics) */}
            {!activeComponentsList.includes(activeTab) && (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 mb-4">
                  <Settings size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Under Construction
                </h3>
                <p className="text-gray-500 max-w-sm mt-2">
                  The {activeTab} management features are currently being built.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ========================================== */}
      {/* MODALS & DIALOGS */}
      {/* ========================================== */}

      <SellerProfileModal
        selectedSeller={selectedSeller}
        setSelectedSeller={setSelectedSeller}
        handleApproveSeller={handleApproveSeller}
        handleRejectSeller={handleRejectSeller}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        formData={profileFormData}
        onChange={(e) =>
          setProfileFormData({
            ...profileFormData,
            [e.target.name]: e.target.value,
          })
        }
        onSubmit={handleAdminProfileSubmit}
        isSubmitting={isProfileSubmitting}
      />

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        formData={addressFormData}
        onChange={(e) =>
          setAddressFormData({
            ...addressFormData,
            [e.target.name]: e.target.value,
          })
        }
        onSubmit={handleAdminAddressSubmit}
        isSubmitting={isAddressSubmitting}
        isEditing={!!editingAddressId}
      />

      <ConfirmDialog
        isOpen={!!sellerToDelete}
        onClose={() => setSellerToDelete(null)}
        onConfirm={confirmDeleteSeller}
        title="Delete Seller Account"
        message="Are you sure you want to permanently delete this seller? This action cannot be undone."
        confirmText="Delete Seller"
      />

      <ConfirmDialog
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={confirmDeleteProduct}
        title="Delete Product"
        message="Are you sure you want to permanently delete this product? This action cannot be undone."
        confirmText="Delete Product"
      />

      <ConfirmDialog
        isOpen={!!addressToDelete}
        onClose={() => setAddressToDelete(null)}
        onConfirm={confirmDeleteAddress}
        title="Delete Address"
        message="Are you sure you want to remove this address? This action cannot be undone."
        confirmText="Delete Address"
      />
    </div>
  );
};

export default AdminDashboard;
