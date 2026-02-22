import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "martXpress",
    resource_type: "auto",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "pdf", "gif"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

// 2. Create a filter to reject invalid files instantly
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept
  } else {
    cb(
      new Error("Invalid file type. Only PDF, JPG, JPEG, and PNG are allowed."),
      false,
    );
  }
};

//  Initialize Multer with the storage, limits, and filter
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

export { upload };
