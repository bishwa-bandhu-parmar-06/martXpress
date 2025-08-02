const express = require("express");
const router = express.Router();
const {upload} = require("../utils/uploads/multer")
// const verifyToken = require("../middleware/auth.middleware");
const verifySession = require("../middleware/auth.middleware");
const { getSellersProfile,updateSellersDetails } = require("../controllers/sellers.controller");

// router.use(verifyToken);
router.use(verifySession);

router.get("/sellers-profile", getSellersProfile);
router.post("/edit-profile",upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "gst_Certificate", maxCount: 1 },
  ]), updateSellersDetails);
module.exports = router;
