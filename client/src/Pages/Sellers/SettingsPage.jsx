import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Store,
  FileText,
  CreditCard,
  Shield,
  Save,
  Loader2,
  Upload,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  getSellersDetails,
  updateSellerProfile,
} from "../../API/Sellers/SellersApi.js";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fileInputRefGST = useRef(null);
  const fileInputRefUdyam = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    shopName: "",
    gstNumber: "",
    panNumber: "",
    udyamNumber: "",
  });

  const [files, setFiles] = useState({
    gstCertificate: null,
    udyamCertificate: null,
  });

  // Fetch initial data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getSellersDetails();
        if (res.seller) {
          setFormData({
            name: res.seller.name || "",
            email: res.seller.email || "",
            mobile: res.seller.mobile || "",
            shopName: res.seller.shopName || "",
            gstNumber: res.seller.gstNumber || "",
            panNumber: res.seller.panNumber || "",
            udyamNumber: res.seller.udyamNumber || "",
          });
        }
      } catch (error) {
        setMessage({ type: "error", text: "Failed to load profile data." });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "File size must be less than 5MB." });
        return;
      }
      setFiles((prev) => ({ ...prev, [fileType]: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = new FormData();

      // Append text data
      Object.keys(formData).forEach((key) => {
        if (formData[key]) payload.append(key, formData[key]);
      });

      // Append files
      if (files.gstCertificate)
        payload.append("gstCertificate", files.gstCertificate);
      if (files.udyamCertificate)
        payload.append("udyamCertificate", files.udyamCertificate);

      await updateSellerProfile(payload);

      setMessage({ type: "success", text: "Profile updated successfully!" });
      setFiles({ gstCertificate: null, udyamCertificate: null }); // Reset files after upload

      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const inputClasses =
    "w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all";

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Store Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your personal and business information.
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 mb-6 rounded-lg flex items-center gap-3 ${message.type === "success" ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          {[
            { id: "profile", label: "Personal Info", icon: User },
            { id: "business", label: "Business Details", icon: Store },
            { id: "documents", label: "Legal Documents", icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Form */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit}>
            {/* PERSONAL INFO TAB */}
            {activeTab === "profile" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mobile Number
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

            {/* BUSINESS DETAILS TAB */}
            {activeTab === "business" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
                  Business Information
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Shop/Business Name
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Udyam Number (Optional)
                      </label>
                      <input
                        type="text"
                        name="udyamNumber"
                        value={formData.udyamNumber}
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
                  Update Legal Documents
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Upload new documents only if you want to replace the existing
                  ones. (PDF, JPG, PNG up to 5MB)
                </p>

                <div className="grid grid-cols-1 gap-6 mt-4">
                  {/* GST Document */}
                  <div className="p-5 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      GST Certificate
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => fileInputRefGST.current?.click()}
                        className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300"
                      >
                        <Upload className="h-4 w-4" /> Choose File
                      </button>
                      <span className="text-sm text-gray-500 truncate max-w-50">
                        {files.gstCertificate
                          ? files.gstCertificate.name
                          : "No new file chosen"}
                      </span>
                      <input
                        type="file"
                        ref={fileInputRefGST}
                        onChange={(e) => handleFileChange(e, "gstCertificate")}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </div>
                  </div>

                  {/* Udyam Document */}
                  <div className="p-5 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Udyam Certificate (Optional)
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => fileInputRefUdyam.current?.click()}
                        className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300"
                      >
                        <Upload className="h-4 w-4" /> Choose File
                      </button>
                      <span className="text-sm text-gray-500 truncate max-w-50">
                        {files.udyamCertificate
                          ? files.udyamCertificate.name
                          : "No new file chosen"}
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
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
