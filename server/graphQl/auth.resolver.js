import {
  login,
  verifyOtp,
  registerUsers,
  resendOtp,
} from "../controllers/authControllers.js";

// Fake Express response banate hain
const mockRes = () => {
  const res = {};
  res.status = () => res;
  res.json = (data) => data;
  return res;
};

export const authResolver = {
  Mutation: {
    login: async (_, args) => {
      return await login({ body: args }, mockRes());
    },

    verifyOtp: async (_, args) => {
      return await verifyOtp({ body: args }, mockRes());
    },

    registerUser: async (_, args) => {
      return await registerUsers({ body: args }, mockRes());
    },

    resendOtp: async (_, args) => {
      return await resendOtp({ body: args }, mockRes());
    },
  },
};
