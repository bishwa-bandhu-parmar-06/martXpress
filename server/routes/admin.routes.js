const express = require("express");
const router = express.Router();
const { upload } = require("../utils/uploads/multer");
// const verifyToken = require("../middleware/auth.middleware");
const verifySession = require("../middleware/auth.middleware");
const {
  getAdminProfile,
  updateAdminDetails,
  approveSeller,
} = require("../controllers/admin.controller");

router.use(verifySession);

router.get("/admin-profile", getAdminProfile);
router.post("/edit-profile", upload.single("profileImage"), updateAdminDetails);

// approve sellers account
router.post("/approve-sellers", approveSeller);
module.exports = router;
