import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { toast, Toaster } from "sonner";
import {
  User,
  Store,
  FileText,
  Save,
  Loader2,
  Upload,
  MapPin,
  Trash2,
  Edit2,
  Plus,
  ExternalLink,
} from "lucide-react";

import {
  getSellersDetails,
  updateSellerProfile,
  getAllSellerAddresses,
  addSellerAddress,
  updateSellerAddress,
  deleteSellerAddress,
} from "../../API/Sellers/SellersApi.js";
import { updateUser } from "@/Features/auth/AuthSlice";

const initialAddressState = {
  fullName: "",
  mobile: "",
  house: "",
  street: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
  landmark: "",
};

const SettingsPage = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile State
  const fileInputRefGST = useRef(null);
  const fileInputRefUdyam = useRef(null);
  const [initialFormData, setInitialFormData] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    shopName: "",
    gstNumber: "",
    panNumber: "",
    udyamNumber: "",
  });

  // Documents State
  const [files, setFiles] = useState({
    gstCertificate: null,
    udyamCertificate: null,
  });
  const [existingDocs, setExistingDocs] = useState({
    gstCertificate: null,
    udyamCertificate: null,
  });
  const [deletedDocs, setDeletedDocs] = useState({ gst: false, udyam: false });

  // Address State
  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState(initialAddressState);
  const [isEditingAddress, setIsEditingAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, addressesRes] = await Promise.all([
          getSellersDetails(),
          getAllSellerAddresses(),
        ]);

        if (profileRes.seller) {
          const fetchedData = {
            name: profileRes.seller.name || "",
            email: profileRes.seller.email || "",
            mobile: profileRes.seller.mobile || "",
            shopName: profileRes.seller.shopName || "",
            gstNumber: profileRes.seller.gstNumber || "",
            panNumber: profileRes.seller.panNumber || "",
            udyamNumber: profileRes.seller.udyamNumber || "",
          };
          setFormData(fetchedData);
          setInitialFormData(fetchedData);
          setExistingDocs({
            gstCertificate: profileRes.seller.gstCertificate || null,
            udyamCertificate: profileRes.seller.udyamCertificate || null,
          });
        }

        if (addressesRes.addresses) {
          setAddresses(addressesRes.addresses);
        }
      } catch (error) {
        toast.error("Failed to load settings data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Profile / Document Handlers ---
  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setFiles((prev) => ({ ...prev, [fileType]: file }));
      setDeletedDocs((prev) => ({
        ...prev,
        [fileType === "gstCertificate" ? "gst" : "udyam"]: false,
      }));
    } else if (file) toast.error("File size must be less than 5MB.");
  };

  const removeExistingDoc = (docType) => {
    setDeletedDocs((prev) => ({ ...prev, [docType]: true }));
    toast.info(
      "Existing document marked for removal. Save changes to confirm.",
    );
  };

  const hasChanges =
    JSON.stringify(formData) !== JSON.stringify(initialFormData) ||
    files.gstCertificate !== null ||
    files.udyamCertificate !== null ||
    deletedDocs.gst ||
    deletedDocs.udyam;

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!hasChanges) return;
    setSaving(true);

    try {
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) payload.append(key, formData[key]);
      });

      // Append backend deletion flags
      if (deletedDocs.gst) payload.append("removeGst", "true");
      if (deletedDocs.udyam) payload.append("removeUdyam", "true");

      // Append new files
      if (files.gstCertificate)
        payload.append("gstCertificate", files.gstCertificate);
      if (files.udyamCertificate)
        payload.append("udyamCertificate", files.udyamCertificate);

      const res = await updateSellerProfile(payload);

      // Update Redux immediately so Sidebar/TopBar updates without refresh
      if (res.seller) {
        dispatch(
          updateUser({ name: res.seller.name, shopName: res.seller.shopName }),
        );
        setExistingDocs({
          gstCertificate: res.seller.gstCertificate || null,
          udyamCertificate: res.seller.udyamCertificate || null,
        });
      }

      toast.success("Profile updated successfully!");
      setInitialFormData({ ...formData });
      setFiles({ gstCertificate: null, udyamCertificate: null });
      setDeletedDocs({ gst: false, udyam: false });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // --- Address Handlers ---
  const handleAddressInputChange = (e) =>
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setAddressLoading(true);
    try {
      if (isEditingAddress) {
        const res = await updateSellerAddress(isEditingAddress, addressForm);
        setAddresses(
          addresses.map((a) => (a._id === isEditingAddress ? res.address : a)),
        );
        toast.success("Address updated!");
      } else {
        const res = await addSellerAddress(addressForm);
        setAddresses([...addresses, res.address]);
        toast.success("Branch address added!");
      }
      setShowAddressForm(false);
      setAddressForm(initialAddressState);
      setIsEditingAddress(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save address");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleEditAddress = (addr) => {
    setAddressForm(addr);
    setIsEditingAddress(addr._id);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this branch address?"))
      return;
    try {
      await deleteSellerAddress(id);
      setAddresses(addresses.filter((a) => a._id !== id));
      toast.success("Address deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );

  const inputClasses =
    "w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all";

  return (
    <div className="max-w-5xl mx-auto">
      <Toaster richColors position="top-right" />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Store Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your personal, business, documents, and branch locations.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          {[
            { id: "profile", label: "Personal Info", icon: User },
            { id: "business", label: "Business Details", icon: Store },
            { id: "documents", label: "Legal Documents", icon: FileText },
            { id: "addresses", label: "Branch Addresses", icon: MapPin },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setShowAddressForm(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <tab.icon className="h-5 w-5" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Form */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm">
          {/* PROFILE / BUSINESS / DOCS TABS */}
          {activeTab !== "addresses" && (
            <form onSubmit={handleProfileSubmit}>
              {/* PERSONAL INFO TAB */}
              {activeTab === "profile" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={inputClasses}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={inputClasses}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        Mobile
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        className={inputClasses}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* BUSINESS INFO TAB */}
              {activeTab === "business" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
                    Business Information
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        Shop Name
                      </label>
                      <input
                        type="text"
                        name="shopName"
                        value={formData.shopName}
                        onChange={handleInputChange}
                        className={inputClasses}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                          GST Number
                        </label>
                        <input
                          type="text"
                          name="gstNumber"
                          value={formData.gstNumber}
                          onChange={handleInputChange}
                          className={`${inputClasses} uppercase`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                          PAN Number
                        </label>
                        <input
                          type="text"
                          name="panNumber"
                          value={formData.panNumber}
                          onChange={handleInputChange}
                          className={`${inputClasses} uppercase`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DOCUMENTS TAB */}
              {activeTab === "documents" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
                    Legal Documents
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Upload new documents to replace existing ones. (PDF, JPG,
                    PNG up to 5MB)
                  </p>

                  <div className="grid grid-cols-1 gap-6 mt-4">
                    {/* GST Document Logic */}
                    <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                        GST Certificate
                      </label>

                      {existingDocs.gstCertificate &&
                      !deletedDocs.gst &&
                      !files.gstCertificate ? (
                        <div className="flex items-center justify-between bg-white dark:bg-gray-700 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <FileText className="text-indigo-600 shrink-0" />
                            <div className="truncate">
                              <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                                {existingDocs.gstCertificate.fileName ||
                                  "GST_Certificate"}
                              </p>
                              <a
                                href={existingDocs.gstCertificate.path}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-indigo-500 hover:text-indigo-600 flex items-center gap-1 mt-1"
                              >
                                View Document <ExternalLink size={12} />
                              </a>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExistingDoc("gst")}
                            className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors shrink-0 cursor-pointer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => fileInputRefGST.current?.click()}
                            className="px-4 py-2 bg-white dark:bg-gray-700 border border-dashed border-gray-400 dark:border-gray-500 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer"
                          >
                            <Upload className="h-4 w-4" /> Upload New File
                          </button>
                          <span className="text-sm text-gray-500 truncate max-w-50">
                            {files.gstCertificate
                              ? files.gstCertificate.name
                              : "No file chosen"}
                          </span>
                          <input
                            type="file"
                            ref={fileInputRefGST}
                            onChange={(e) =>
                              handleFileChange(e, "gstCertificate")
                            }
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                        </div>
                      )}
                    </div>

                    {/* Udyam Document Logic */}
                    <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                        Udyam Certificate (Optional)
                      </label>

                      {existingDocs.udyamCertificate &&
                      !deletedDocs.udyam &&
                      !files.udyamCertificate ? (
                        <div className="flex items-center justify-between bg-white dark:bg-gray-700 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <FileText className="text-indigo-600 shrink-0" />
                            <div className="truncate">
                              <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                                Udyam_Certificate
                              </p>
                              <a
                                href={existingDocs.udyamCertificate}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-indigo-500 hover:text-indigo-600 flex items-center gap-1 mt-1"
                              >
                                View Document <ExternalLink size={12} />
                              </a>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExistingDoc("udyam")}
                            className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors shrink-0 cursor-pointer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => fileInputRefUdyam.current?.click()}
                            className="px-4 py-2 bg-white dark:bg-gray-700 border border-dashed border-gray-400 dark:border-gray-500 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer"
                          >
                            <Upload className="h-4 w-4" /> Upload New File
                          </button>
                          <span className="text-sm text-gray-500 truncate max-w-50">
                            {files.udyamCertificate
                              ? files.udyamCertificate.name
                              : "No file chosen"}
                          </span>
                          <input
                            type="file"
                            ref={fileInputRefUdyam}
                            onChange={(e) =>
                              handleFileChange(e, "udyamCertificate")
                            }
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Profile Settings */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  type="submit"
                  disabled={saving || !hasChanges}
                  className={`px-6 py-3 font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer ${!hasChanges ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400 shadow-none" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
                >
                  {saving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Save className="h-5 w-5" />
                  )}{" "}
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === "addresses" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Branch Addresses
                </h2>
                {!showAddressForm && (
                  <button
                    onClick={() => {
                      setAddressForm(initialAddressState);
                      setIsEditingAddress(null);
                      setShowAddressForm(true);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Plus size={16} /> Add Branch
                  </button>
                )}
              </div>

              {/* Address Form */}
              {showAddressForm ? (
                <form
                  onSubmit={handleSaveAddress}
                  className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-bold mb-1 block dark:text-gray-300">
                        Manager/Contact Name
                      </label>
                      <input
                        required
                        name="fullName"
                        value={addressForm.fullName}
                        onChange={handleAddressInputChange}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold mb-1 block dark:text-gray-300">
                        Mobile
                      </label>
                      <input
                        required
                        name="mobile"
                        value={addressForm.mobile}
                        onChange={handleAddressInputChange}
                        className={inputClasses}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold mb-1 block dark:text-gray-300">
                        House / Building / Office No.
                      </label>
                      <input
                        required
                        name="house"
                        value={addressForm.house}
                        onChange={handleAddressInputChange}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold mb-1 block dark:text-gray-300">
                        Street / Area
                      </label>
                      <input
                        required
                        name="street"
                        value={addressForm.street}
                        onChange={handleAddressInputChange}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold mb-1 block dark:text-gray-300">
                        Landmark
                      </label>
                      <input
                        name="landmark"
                        value={addressForm.landmark}
                        onChange={handleAddressInputChange}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold mb-1 block dark:text-gray-300">
                        City
                      </label>
                      <input
                        required
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressInputChange}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold mb-1 block dark:text-gray-300">
                        District
                      </label>
                      <input
                        required
                        name="district"
                        value={addressForm.district}
                        onChange={handleAddressInputChange}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold mb-1 block dark:text-gray-300">
                        State
                      </label>
                      <input
                        required
                        name="state"
                        value={addressForm.state}
                        onChange={handleAddressInputChange}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold mb-1 block dark:text-gray-300">
                        Pincode
                      </label>
                      <input
                        required
                        name="pincode"
                        value={addressForm.pincode}
                        onChange={handleAddressInputChange}
                        className={inputClasses}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-5 py-2 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addressLoading}
                      className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-lg flex items-center gap-2 hover:bg-indigo-700 cursor-pointer"
                    >
                      {addressLoading && (
                        <Loader2 size={16} className="animate-spin" />
                      )}{" "}
                      Save Address
                    </button>
                  </div>
                </form>
              ) : (
                /* Address List */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {addresses.length === 0 ? (
                    <div className="col-span-full p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                      <MapPin className="h-10 w-10 mx-auto text-gray-400 mb-2 opacity-50" />
                      <p className="text-gray-500 font-medium">
                        No branch addresses added yet.
                      </p>
                    </div>
                  ) : (
                    addresses.map((addr) => (
                      <div
                        key={addr._id}
                        className="relative p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs font-bold px-2 py-1 rounded">
                            Branch
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditAddress(addr)}
                              className="text-gray-400 hover:text-indigo-600 transition cursor-pointer"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(addr._id)}
                              className="text-gray-400 hover:text-red-500 transition cursor-pointer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {addr.fullName}{" "}
                          <span className="text-gray-500 text-sm font-normal">
                            ({addr.mobile})
                          </span>
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                          {addr.house}, {addr.street}
                          <br />
                          {addr.landmark && `Landmark: ${addr.landmark}`}
                          <br />
                          {addr.city}, {addr.district}, {addr.state} -{" "}
                          {addr.pincode}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
