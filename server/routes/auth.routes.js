const express = require("express");
const router = express.Router();
const {upload} = require("../utils/uploads/multer");

const { registerUsers, login, registerSeller,registerAdmin,getUsersById } = require("../controllers/auth.Controller");

router.post("/register-users", registerUsers);
router.post("/register-sellers",upload.single("gst_Certificate"), registerSeller);
router.post("/register-admin", registerAdmin);
router.get("/usersById", getUsersById);
router.post("/login", login);

module.exports = router;
