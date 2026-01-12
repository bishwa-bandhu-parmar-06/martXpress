import React from "react";

const FileLoader = ({ size = 40 }) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className="animate-spin rounded-full border-4 border-gray-300 border-t-primary"
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default FileLoader;
