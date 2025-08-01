const express = require("express");
const router = express.Router();
const {upload} = require("../utils/uploads/multer")
const verifyToken = require("../middleware/auth.middleware");
const { getUsersProfile,updateUsersDetails } = require("../controllers/users.controller");

router.use(verifyToken);

router.get("/users-profile", getUsersProfile);
router.post("/edit-profile",upload.single("profileImage"), updateUsersDetails);

module.exports = router;
