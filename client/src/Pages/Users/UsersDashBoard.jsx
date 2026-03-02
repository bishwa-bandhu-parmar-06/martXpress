import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Using Sonner for all notifications

// API & Redux
import {
  getUserProfile,
  getAllUserAddresses,
  removeUserAddress,
  addUserAddress,
  updateUserAddress,
  updateUserDetails,
} from "../../API/users/usersApi";
import { logoutUser } from "@/API/Common/commonApi";
import { logout, updateUser } from "@/Features/auth/AuthSlice";
import { clearCartQuantity } from "../../Features/Cart/CartSlice";
import { setWishlist } from "../../Features/Cart/WishlistSlice";

// Components
import { DashboardSidebar } from "./DashboardSidebar";
import { ProfileTab } from "./ProfileTab";
import { AddressesTab } from "./AddressesTab";
import { OrdersTab } from "./OrdersTab";
import { SettingsTab } from "./SettingsTab";
import { ProfileModal } from "./ProfileModal";
import { AddressModal } from "./AddressModal";
import { ConfirmDialog } from "../../Components/Common/Auth/Common/ConfirmDialog";

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

const UsersDashBoard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Address State
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressFormData, setAddressFormData] = useState(initialAddressState);
  const [isAddressSubmitting, setIsAddressSubmitting] = useState(false);

  // Custom Dialog State for Deleting Address
  const [addressToDelete, setAddressToDelete] = useState(null);

  // Profile Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [profileRes, addressesRes] = await Promise.all([
          getUserProfile(),
          getAllUserAddresses(),
        ]);
        setProfileData(profileRes.user || profileRes);
        const fetchedAddresses = addressesRes.addresses || [];
        setAddresses(fetchedAddresses);
        if (fetchedAddresses.length > 0)
          setSelectedAddressId(fetchedAddresses[0]._id);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Could not load dashboard information. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Profile Methods
  const openProfileModal = () => {
    setProfileFormData({
      name: profileData?.name || "",
      email: profileData?.email || "",
      mobile: profileData?.mobile || "",
    });
    setIsProfileModalOpen(true);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsProfileSubmitting(true);
    try {
      const res = await updateUserDetails(profileFormData);
      const updatedUser = res.user || res.data;

      // 1. Update local dashboard state
      setProfileData(updatedUser);

      // 2. Sync with Redux so the Navbar updates instantly!
      dispatch(
        updateUser({
          name: updatedUser.name,
          email: updatedUser.email,
          mobile: updatedUser.mobile,
        }),
      );

      toast.success("Profile updated successfully!");
      setIsProfileModalOpen(false);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update profile details.",
      );
    } finally {
      setIsProfileSubmitting(false);
    }
  };

  // Address Methods
  const openAddModal = () => {
    setAddressFormData(initialAddressState);
    setEditingAddressId(null);
    setIsAddressModalOpen(true);
  };

  const openEditModal = (address) => {
    setAddressFormData({ ...address, landmark: address.landmark || "" });
    setEditingAddressId(address._id);
    setIsAddressModalOpen(true);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setIsAddressSubmitting(true);
    try {
      if (editingAddressId) {
        const res = await updateUserAddress(editingAddressId, addressFormData);
        setAddresses(
          addresses.map((addr) =>
            addr._id === editingAddressId ? res.address || res.data : addr,
          ),
        );
        toast.success("Address updated successfully!");
      } else {
        const res = await addUserAddress(addressFormData);
        const newAddress = res.address || res.data;
        setAddresses([...addresses, newAddress]);
        if (addresses.length === 0) setSelectedAddressId(newAddress._id);
        toast.success("Address added successfully!");
      }
      setIsAddressModalOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save address.");
    } finally {
      setIsAddressSubmitting(false);
    }
  };

  // Triggered when clicking "Remove" on an address
  const handleDeleteAddressClick = (id) => {
    setAddressToDelete(id); // Opens the ConfirmDialog
  };

  // Triggered when clicking "Confirm" inside the dialog
  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return;
    try {
      await removeUserAddress(addressToDelete);
      const filteredAddresses = addresses.filter(
        (addr) => addr._id !== addressToDelete,
      );
      setAddresses(filteredAddresses);

      if (selectedAddressId === addressToDelete) {
        setSelectedAddressId(
          filteredAddresses.length > 0 ? filteredAddresses[0]._id : null,
        );
      }
      toast.success("Address removed successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete address.");
    } finally {
      setAddressToDelete(null); // Closes the dialog
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      dispatch(clearCartQuantity());
      dispatch(setWishlist([]));
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      dispatch(logout());
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-6 pb-20 md:py-10 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {profileData?.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account settings and preferences here.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          <DashboardSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={handleLogout}
          />

          <main className="flex-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8 min-h-125">
              {activeTab === "profile" && (
                <ProfileTab
                  profileData={profileData}
                  onEdit={openProfileModal}
                />
              )}

              {activeTab === "addresses" && (
                <AddressesTab
                  addresses={addresses}
                  selectedAddressId={selectedAddressId}
                  onSelectAddress={setSelectedAddressId}
                  onAdd={openAddModal}
                  onEdit={openEditModal}
                  onDelete={handleDeleteAddressClick}
                />
              )}

              {activeTab === "orders" && <OrdersTab />}

              {activeTab === "settings" && (
                <SettingsTab
                  profileData={profileData}
                  onLogout={handleLogout}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
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
        onSubmit={handleProfileSubmit}
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
        onSubmit={handleAddressSubmit}
        isSubmitting={isAddressSubmitting}
        isEditing={!!editingAddressId}
      />

      {/* Confirm Dialog for Addresses */}
      <ConfirmDialog
        isOpen={!!addressToDelete}
        onClose={() => setAddressToDelete(null)}
        onConfirm={confirmDeleteAddress}
        title="Delete Address?"
        message="Are you sure you want to remove this address? This action cannot be undone."
        confirmText="Yes, Delete"
      />
    </div>
  );
};

export default UsersDashBoard;
