import React from "react";

const LocationLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* Spinner */}
      <div className="w-6 h-6 border-2 border-customText border-t-primary rounded-full animate-spin"></div>

      {/* Text */}
      <p className="text-sm text-customText">Detecting...</p>
    </div>
  );
};

export default LocationLoader;
