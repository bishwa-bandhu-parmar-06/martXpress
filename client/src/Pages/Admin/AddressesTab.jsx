import React from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";

export const AddressesTab = ({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Saved Addresses
        </h2>
        <button
          onClick={onAdd}
          className="cursor-pointer flex items-center gap-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
          <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            No addresses saved
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Add an address to your profile.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address._id}
              onClick={() => onSelectAddress(address._id)}
              className={`cursor-pointer relative p-5 rounded-xl border-2 transition-colors group ${selectedAddressId === address._id ? "border-primary bg-primary/5 dark:bg-primary/10" : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:border-primary/50"}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="addressSelection"
                    className="w-4 h-4 text-primary bg-white border-gray-300 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
                    checked={selectedAddressId === address._id}
                    readOnly
                  />
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {address.fullName}
                  </h3>
                </div>
                {selectedAddressId === address._id && (
                  <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                    Selected
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-4 pl-7">
                <p>
                  {address.house}, {address.street}
                </p>
                {address.landmark && <p>Landmark: {address.landmark}</p>}
                <p>
                  {address.city}, {address.district}
                </p>
                <p>
                  {address.state} - {address.pincode}
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-300 pt-1">
                  Phone: {address.mobile}
                </p>
              </div>
              <div className="flex gap-4 pl-7 border-t border-gray-200 dark:border-gray-700 pt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(address);
                  }}
                  className="text-sm font-semibold text-primary hover:underline cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(address._id);
                  }}
                  className="text-sm font-semibold text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
