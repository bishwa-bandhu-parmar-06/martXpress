// importing models
const userModel = require("../models/users.model");
const sellerModel = require("../models/sellers.model");
const adminModel = require("../models/admin.model");
const otpModel = require("../models/otpModel.js");

const  validateLoginEligibility  = require("../utils/userValidation.js");
// otp generator packages
const otpGenerator = require("otp-generator");

// token generator packages
const jwt = require("jsonwebtoken");
// password hashin packages
const bcrypt = require("bcrypt");

// importing send email functions
const sendEmail = require("../utils/emails/sendEmail");

// importing email templates
const {
  welcomeTemplate,
} = require("../utils/emails/templates/welcomeEmailTemplates");
const { otpTemplate } = require("../utils/emails/templates/otpTemplates");

// users register controllers
const registerUsers = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // 1️⃣ Basic validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(200).json({
        status: 400,
        success: false,
        message: "All fields must be provided.",
      });
    }
    if (password !== confirmPassword) {
      return res.status(200).json({
        status: 400,
        success: false,
        message: "Password and Confirm Password must match.",
      });
    }

    // 2️⃣ Check email in all collections
    const userExists = await userModel.findOne({ email });
    const sellerExists = await sellerModel.findOne({ email });
    const adminExists = await adminModel.findOne({ email });

    const found = userExists || sellerExists || adminExists;

    if (found) {
      if (found.verifiedEmail) {
        return res.status(200).json({
          status: 404,
          success: false,
          message: "This email is already registered with another role.",
        });
      } else {
        return res.status(200).json({
          status: 404,
          success: true,
          message:
            "This email is already registered but not verified. Please use 'Forgot Password' to verify your account.",
        });
      }
    }

    // 3️⃣ Email doesn't exist → create unverified user with OTP
    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const hashedOtp = await bcrypt.hash(otp, 10);

    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      otp: hashedOtp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });

    await otpModel.create({
      usersId: newUser._id,
      email: newUser.email,
      otp: hashedOtp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
      role: "User",
    });

    // 4️⃣ Send OTP email
    await sendEmail(
      email,
      "MartXpress OTP Verification",
      otpTemplate(name, otp)
    );

    return res.status(200).json({
      status: 200,
      success: true,
      message: "OTP sent successfully to your email.",
    });
  } catch (error) {
    console.error("Error while registering user:", error);
    res.status(200).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};

// register seller or company
const registerSeller = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, gst = {} } = req.body;
    const { gst_Number } = gst;
    const gst_Certificate = req.file?.path;
    if (!name || !email || !password || !confirmPassword || !gst_Number) {
      return res.status(200).json({
        status: 400,
        success: false,
        message: "All fields must be provided.",
      });
    }
    // Check email in all collections
    const userExists = await userModel.findOne({ email });
    const sellerExists = await sellerModel.findOne({ email });
    const adminExists = await adminModel.findOne({ email });

    const found = userExists || sellerExists || adminExists;

    if (found) {
      if (found.verifiedEmail) {
        return res.status(200).json({
          status: 404,
          success: false,
          message: "This email is already registered with another role.",
        });
      } else {
        return res.status(200).json({
          status: 404,
          success: true,
          message:
            "This email is already registered but not verified. Please use 'Forgot Password' to verify your account.",
        });
      }
    }

    // 3️⃣ Email doesn't exist → create unverified user with OTP
    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const hashedOtp = await bcrypt.hash(otp, 10);

    const newSeller = await sellerModel.create({
      name,
      email,
      gst,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      otp: hashedOtp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });

    await otpModel.create({
      usersId: newSeller._id,
      email: newSeller.email,
      otp: hashedOtp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
      role: "Seller",
    });

    // 4️⃣ Send OTP email
    await sendEmail(
      email,
      "MartXpress OTP Verification",
      otpTemplate(name, otp)
    );

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Email Sent Successfully.",
    });
  } catch (error) {
    console.error("While Registering Company or Seller : ", error);
    return res.status(200).json({
      status: 500,
      success: false,
      message: "Internal server error from company register",
    });
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // 1️⃣ Basic validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All credentials must be provided.",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password must match.",
      });
    }

    // 2️⃣ Check if email exists in any role
    const userExists = await userModel.findOne({ email });
    const sellerExists = await sellerModel.findOne({ email });
    const adminExists = await adminModel.findOne({ email });

    if (userExists || sellerExists || adminExists) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered with another role.",
      });
    }

    // 3️⃣ Create admin
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const hashedOtp = await bcrypt.hash(otp, 10);

    const newAdmin = await adminModel.create({
      name,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      otp: hashedOtp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });
    await otpModel.create({
      usersId: newAdmin._id,
      email: newAdmin.email,
      otp: hashedOtp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
      role: "Admin",
    });

    // 4️⃣ Send OTP email
    await sendEmail(
      email,
      "MartXpress OTP Verification",
      otpTemplate(name, otp)
    );

    return res.status(200).json({
      success: true,
      message: "Email Sent successfully.",
    });
  } catch (error) {
    console.error("While Registering admin:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while registering admin.",
    });
  }
};
// validate otp
const roleModels = {
  User: userModel,
  Seller: sellerModel,
  Admin: adminModel,
};

const validateOtp = async (req, res) => {
  try {
    const { email, otp, role } = req.body;

    // 1️⃣ Check role is valid
    if (!["User", "Seller", "Admin"].includes(role)) {
      return res
        .status(200)
        .json({ status: 400, success: false, message: "Invalid role" });
    }

    // 2️⃣ Find OTP record
    const otpRecord = await otpModel.findOne({ email, role });
    if (!otpRecord) {
      return res
        .status(200)
        .json({ status: 400, success: false, message: "OTP not found" });
    }

    // 3️⃣ Check expiry
    if (Date.now() > otpRecord.otpExpiry) {
      return res
        .status(200)
        .json({ status: 400, success: false, message: "OTP expired" });
    }

    // 4️⃣ Compare OTP
    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
      return res
        .status(200)
        .json({ status: 400, success: false, message: "Invalid OTP" });
    }

    // 5️⃣ Mark email as verified in the correct model
    const Model = roleModels[role];
    await Model.updateOne(
      { _id: otpRecord.usersId },
      { $set: { verifiedEmail: true } }
    );

    // 6️⃣ Delete OTP record after success
    await otpModel.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("OTP validation error:", error);
    res
      .status(200)
      .json({ status: 500, success: false, message: "Internal server error" });
  }
};
// controller to login
const loginWithPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(200).json({
        status: 500,
        success: false,
        message: "All fileds must be provided.",
      });
    }

    const users = await userModel.findOne({ email: email });
    const sellers = await sellerModel.findOne({ email });
    const admin = await adminModel.findOne({ email });

    if (!users && !sellers && !admin) {
      return res.status(200).json({
        status: 500,
        success: false,
        message: "email does not exist, Please register.",
      });
    }

    let foundUsers = null;
    let role = " ";
    if (users) {
      foundUsers = users;
      role = "User";
    } else if (sellers) {
      foundUsers = sellers;
      role = "Seller";
    } else if (admin) {
      foundUsers = admin;
      role = "Admin";
    }

    // password = entred password
    // users.password = stored password
    const isMatched = await bcrypt.compare(password, foundUsers.password);
    if (!isMatched) {
      return res
        .status(200)
        .json({ status: 500, success: false, message: "Invalid credentials." });
    }

    /// ✅ Validate eligibility
    const validation = validateLoginEligibility(foundUsers, role);
    if (!validation.success) {
      return res.status(validation.status).json(validation);
    }
    // ✅ Save session
    req.session.user = {
      id: foundUsers._id,
      role: role,
    };
    // Convert user to object and delete password
    const userData = foundUsers.toObject();
    // console.log("first", userData);
    delete userData.password;
    delete userData.confirmPassword;

    // await users.save();
    return res.status(200).json({
      status: 200,
      success: true,
      message: `${role} login Successfully.`,
      users: userData,
    });
  } catch (error) {
    console.error("Getting error while login : ", error);
    return res
      .status(200)
      .json({ status: 500, success: false, message: "Error while login" });
  }
};

// login with the email otp
const loginWithEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // 1️⃣ User exists check
    const user =
      (await userModel.findOne({ email })) ||
      (await sellerModel.findOne({ email })) ||
      (await adminModel.findOne({ email }));

    if (!user) {
      return res.status(200).json({
        status: 404,
        success: false,
        message: "Email does not exist, please register.",
      });
    }

    // ✅ Eligibility check before sending OTP
    const validation = validateLoginEligibility(user);
    if (!validation.success) {
      return res.status(validation.status).json(validation);
    }
    // 2️⃣ OTP generate
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const hashedOtp = await bcrypt.hash(otp, 10);

    // 3️⃣ Purana OTP delete (same email ke liye)
    await otpModel.deleteMany({ email });

    // 4️⃣ New OTP save
    await otpModel.create({
      usersId: user._id,
      email,
      otp: hashedOtp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
      role: user.role,
    });

    // 5️⃣ Send OTP via email
    await sendEmail(email, "Your Login OTP", otpTemplate(user.name, otp));

    return res.status(200).json({
      status: 200,
      success: true,
      message: "OTP sent to your email.",
    });
  } catch (error) {
    console.error("Error While Sending OTP:", error);
    return res
      .status(200)
      .json({ status: 500, success: false, message: "Internal Server Error" });
  }
};

// verify the otp for login
const verifyLoginotp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1️⃣ OTP record find
    const otpRecord = await otpModel.findOne({ email });
    if (!otpRecord) {
      return res.status(200).json({
        status: 404,
        success: false,
        message: "OTP for this email does not exist.",
      });
    }

    // 2️⃣ Expiry check
    if (Date.now() > otpRecord.otpExpiry) {
      await otpModel.deleteOne({ _id: otpRecord._id }); // expired delete
      return res.status(200).json({
        status: 400,
        success: false,
        message: "OTP expired. Please request again.",
      });
    }

    // 3️⃣ OTP compare
    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
      return res.status(200).json({
        status: 400,
        success: false,
        message: "Invalid OTP.",
      });
    }

    // 4️⃣ Role ke hisaab se user find
    let Model;
    if (otpRecord.role === "User") Model = userModel;
    else if (otpRecord.role === "Seller") Model = sellerModel;
    else if (otpRecord.role === "Admin") Model = adminModel;

    const user = await Model.findById(otpRecord.usersId);
    if (!user) {
      return res.status(200).json({
        status: 404,
        success: false,
        message: "User not found.",
      });
    }

    // ✅ Validate eligibility
    const validation = validateLoginEligibility(user, otpRecord.role);
    if (!validation.success) {
      return res.status(validation.status).json(validation);
    }

    // 7️⃣ Session / token create
    req.session.user = {
      id: user._id,
      role: otpRecord.role,
    };

    // 8️⃣ OTP delete after use
    await otpModel.deleteOne({ _id: otpRecord._id });

    // 9️⃣ Success response (password remove for safety)
    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.confirmPassword;

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Login successful.",
      user: safeUser,
    });
  } catch (error) {
    console.error("Error While Verifying Login Otp:", error);
    return res.status(200).json({
      status: 500,
      success: false,
      message: "Internal Server Error.",
    });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Logout failed." });
    }
    res.clearCookie("connect.sid");
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully." });
  });
};

module.exports = {
  registerUsers,
  registerSeller,
  registerAdmin,
  loginWithPassword,
  loginWithEmailOtp,
  verifyLoginotp,
  logout,
  validateOtp,
  // getUsersById,
};
