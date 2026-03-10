import React, { useState, useRef, useEffect } from "react";
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { addBulkProductsApi } from "../../API/ProductsApi/productsAPI.js";

const BulkUploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.ms-excel", // .xls
        "text/csv", // .csv
      ];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error("Please upload a valid Excel (.xlsx, .xls) or CSV file.");
        return;
      }
      setFile(selectedFile);
    }
  };

  // Generate a sample CSV template for the seller to download
  const handleDownloadTemplate = () => {
    const headers =
      "Name,Description,Category,Brand,Price,Discount,Stock,Tags,ImageURLs,Status,Featured\n";
    const sampleData =
      'Sample Shirt,Cotton comfort,Fashion,Nike,999,10,50,"shirt, summer, fashion","https://example.com/img1.jpg, https://example.com/img2.jpg",active,FALSE\n';

    const blob = new Blob([headers + sampleData], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "MartXpress_Bulk_Upload_Template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await addBulkProductsApi(formData);
      toast.success(res.message || "Bulk upload successful!");
      if (res.errors && res.errors.length > 0) {
        toast.warning(`Some rows were skipped: ${res.errors.join(", ")}`);
      }
      setFile(null);
      onSuccess(); // Refresh products list
      onClose();
    } catch (error) {
      console.error("Bulk upload error:", error);
      toast.error(error?.message || "Failed to upload file.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <FileSpreadsheet className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Bulk Upload Products
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Step 1: Download Template */}
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-blue-900 dark:text-blue-400 mb-1">
                Step 1: Download Template
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300/80">
                Get the required Excel/CSV format.
              </p>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-lg shadow-sm border border-blue-200 dark:border-blue-800/50 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
            >
              <Download className="h-4 w-4" /> Template
            </button>
          </div>

          {/* Step 2: Upload */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              Step 2: Upload File
            </h4>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 
                ${file ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10" : "border-gray-300 dark:border-gray-700 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10"}`}
            >
              {file ? (
                <>
                  <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-3" />
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </>
              ) : (
                <>
                  <UploadCloud className="h-10 w-10 text-indigo-500 mb-3" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Click to browse or drag file here
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports .csv, .xls, .xlsx
                  </p>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                className="hidden"
              />
            </div>
          </div>

          {/* Note */}
          <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-200 dark:border-amber-900/30">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>
              Ensure image columns contain valid, publicly accessible web URLs
              (e.g., https://example.com/img.jpg). Separate multiple URLs with
              commas.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || isLoading}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="h-4 w-4" />
            )}
            Upload Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;
