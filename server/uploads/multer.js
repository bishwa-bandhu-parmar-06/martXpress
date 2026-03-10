import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "./cloudinary.js";
import fs from "fs";

// ==========================================================
// 1. CLOUDINARY STORAGE (For Product Images & Certificates)
// ==========================================================
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "martXpress",
    resource_type: "auto",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "pdf", "gif"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const cloudinaryFileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only PDF, JPG, JPEG, PNG and WEBP are allowed.",
      ),
      false,
    );
  }
};

export const upload = multer({
  storage: cloudinaryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: cloudinaryFileFilter,
});

// ==========================================================
// 2. LOCAL DISK STORAGE (For Bulk Upload CSV/Excel Files)
// ==========================================================
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/";
    // Auto-create the 'uploads' folder if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `bulk-${Date.now()}-${file.originalname}`);
  },
});

const excelFileFilter = (req, file, cb) => {
  const allowedExcelTypes = [
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (allowedExcelTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only CSV and Excel (.xlsx, .xls) are allowed for bulk upload.",
      ),
      false,
    );
  }
};

export const uploadExcel = multer({
  storage: localStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for spreadsheets
  fileFilter: excelFileFilter,
});
