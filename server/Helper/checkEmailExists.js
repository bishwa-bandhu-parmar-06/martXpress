import userModel from "../models/usersModel.js";
import sellerModel from "../models/sellersModel.js";
import adminModel from "../models/adminModel.js";

export const checkEmailExists = async (email) => {
  const [user, seller, admin] = await Promise.all([
    userModel.findOne({ email }),
    sellerModel.findOne({ email }),
    adminModel.findOne({ email }),
  ]);

  return user || seller || admin;
};
