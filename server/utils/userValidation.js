const validateLoginEligibility = (user, role) => {
  if (!user) {
    return res.status(200).json({
      success: false,
      status: 404,
      message: "User not found.",
    });
  }

  // Email verification check
  if (!user.verifiedEmail) {
    return {
      success: false,
      status: 403,
      message: "Please verify your email before logging in.",
    };
  }

  // Seller approval check
  if (role === "Seller" && user.status !== "Approved") {
    return {
      success: false,
      status: 403,
      message: "Your seller account is pending admin approval.",
    };
  }

  // Passed all checks
  return { success: true };
};

module.exports = validateLoginEligibility;
