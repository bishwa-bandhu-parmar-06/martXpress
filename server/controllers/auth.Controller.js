// importing models
const userModel = require("../models/users.model");
const sellerModel = require("../models/sellers.model");
const adminModel = require("../models/admin.model");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// importing send email functions
// const sendEmail = require("../utils/emails/sendEmail");
// const {
//   welcomeTemplate,
// } = require("../utils/emails/templates/welcomeEmailTemplates");
// making controller or method or function to register users
const registerUsers = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(200).json({
        status: 500,
        success: false,
        message: "All fields must be Provided.",
      });
    }
    if (!(password === confirmPassword)) {
      return res.status(200).json({
        status: 500,
        success: false,
        message: "Password and confirmPassword Must be same.",
      });
    }

    // Check email in all collections
    const userExists = await userModel.findOne({ email });
    const sellerExists = await sellerModel.findOne({ email });
    const adminExists = await adminModel.findOne({ email });

    if (userExists || sellerExists || adminExists) {
      return res.status(200).json({
        status: 400,
        success: false,
        message: "This email is already registered with another role.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
    });

    await newUser.save();

    // Send Welcome Email
    // const subject = "Thank You for Registring";
    // const html = welcomeTemplate(newUser.name);
    // await sendEmail(newUser.email, subject, html);

    return res.status(200).json({
      status: 200,
      success: true,
      message: "User Registered Successfully.",
      users: newUser,
    });
  } catch (error) {
    console.error("Getting error While Register Users: ", error);
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

    if (userExists || sellerExists || adminExists) {
      return res.status(200).json({
        status: 400,
        success: false,
        message: "This email is already registered with another role.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newSeller = await sellerModel.create({
      name,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      gst: {
        gst_Number,
        ...(gst_Certificate && { gst_Certificate }),
      },
    });

    await newSeller.save();
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Seller register Successfull.",
      sellers: newSeller,
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

// register admin
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
      return res.status(200).json({
        status: 500,
        success: false,
        message: "All credential must be provided",
      });
    }

    // Check email in all collections
    const userExists = await userModel.findOne({ email });
    const sellerExists = await sellerModel.findOne({ email });
    const adminExists = await adminModel.findOne({ email });

    if (userExists || sellerExists || adminExists) {
      return res.status(200).json({
        status: 400,
        success: false,
        message: "This email is already registered with another role.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await adminModel.create({
      name,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
    });
    await newAdmin.save();
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Admin Registered Successfully.",
    });
  } catch (error) {
    console.error("While Registering admin: ", error);
    return res.status(200).json({
      status: 500,
      success: false,
      message: "Internal Server Error. register admin",
    });
  }
};

// controller to login
const login = async (req, res) => {
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
      role = "users";
    } else if (sellers) {
      foundUsers = sellers;
      role = "sellers";
    } else if (admin) {
      foundUsers = admin;
      role = "admin";
    }

    // password = entred password
    // users.password = stored password
    const isMatched = await bcrypt.compare(password, foundUsers.password);
    if (!isMatched) {
      return res
        .status(200)
        .json({ status: 500, success: false, message: "Invalid credentials." });
    }

    // const token = jwt.sign(
    //   { userId: foundUsers._id, role },
    //   process.env.JWT_SECRET,
    //   {
    //     expiresIn: "1h",
    //   }
    // );

    // ✅ Save session
    req.session.user = {
      id: foundUsers._id,
      role: role
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

// get users by their id :
const getUsersById = async (req, res) => {
  try {
    const { usersId } = req.body; // Check if usersId is provided
    if (!usersId) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "User ID must be provided.",
      });
    }

    // Search for the user in all three models concurrently
    const [user, seller, admin] = await Promise.all([
      userModel.findById(usersId),
      sellerModel.findById(usersId),
      adminModel.findById(usersId),
    ]);

    let foundUser = null;
    let role = null;

    if (user) {
      foundUser = user;
      role = "users";
    } else if (seller) {
      foundUser = seller;
      role = "sellers";
    } else if (admin) {
      foundUser = admin;
      role = "admin";
    }

    if (foundUser) {
      const userData = foundUser.toObject();
      delete userData.password;
      delete userData.confirmPassword;

      return res.status(200).json({
        status: 200,
        success: true,
        message: `${role} found successfully.`,
        user: userData,
        role: role,
      });
    } else {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found.",
      });
    }
  } catch (error) {
    console.error("error From get Users bY Id : ", error);
    res
      .status(200)
      .json({ status: 500, success: false, message: "Internal Server Error" });
  }
};


const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed." });
    }
    res.clearCookie("connect.sid"); // default cookie name
    return res.status(200).json({ success: true, message: "Logged out successfully." });
  });
};


module.exports = {
  registerUsers,
  registerSeller,
  registerAdmin,
  login,
  logout,
  getUsersById
};
