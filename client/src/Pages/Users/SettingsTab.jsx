import React, { useState } from "react";
import { Lock, Bell, AlertTriangle, X, Loader2 } from "lucide-react";
import { changeUserPassword, deleteUserAccount } from "../../API/users/usersApi";
import { toast } from "sonner";
import { ConfirmDialog } from "../../Components/Common/Auth/Common/ConfirmDialog"; // Check this path matches your project!

export const SettingsTab = ({ profileData, onLogout }) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Custom Dialog State for Account Deletion
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isGoogleUser = profileData?.authProvider === "google";

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const submitPasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("New passwords do not match.");
    }

    setIsSubmitting(true);
    try {
      await changeUserPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      toast.success("Password updated successfully!");
      setIsPasswordModalOpen(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Triggered by the "Confirm" button inside the Dialog
  const confirmDeleteAccount = async () => {
    try {
      await deleteUserAccount();
      toast.success("Your account has been deleted.");
      onLogout(); // Redux logout and redirect
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete account.");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h2>

      {/* Security Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
          <Lock size={18} /> Security
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Change Password</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isGoogleUser ? "You are logged in via Google. Password changes are disabled." : "Update your password to keep your account secure."}
            </p>
          </div>
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            disabled={isGoogleUser}
            className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
              isGoogleUser ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800" : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            Update
          </button>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
          <Bell size={18} /> Notifications
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Order Updates</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Receive SMS and emails about your order status.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2 border-b border-red-100 dark:border-red-900/30 pb-2">
          <AlertTriangle size={18} /> Danger Zone
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Delete Account</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Permanently remove your account and all data.</p>
          </div>
          <button
            onClick={() => setIsDeleteModalOpen(true)} // Opens the Confirm Dialog instead of window.confirm
            className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm cursor-pointer"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Confirm Dialog for Account Deletion */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteAccount}
        title="Delete Account?"
        message="WARNING: This action is permanent and cannot be undone. Are you absolutely sure you want to delete your account?"
        confirmText="Yes, Delete My Account"
      />

      {/* PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Change Password</h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>

            <div className="p-5">
              <form id="passwordForm" onSubmit={submitPasswordChange} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                  <input type="password" required name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder="Enter current password" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                  <input type="password" required minLength="6" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder="Enter new password" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                  <input type="password" required minLength="6" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder="Confirm new password" />
                </div>
              </form>
            </div>

            <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="px-5 py-2.5 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
              <button type="submit" form="passwordForm" disabled={isSubmitting} className="px-5 py-2.5 rounded-lg font-semibold text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center gap-2">
                {isSubmitting && <Loader2 size={16} className="animate-spin" />} Save Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};