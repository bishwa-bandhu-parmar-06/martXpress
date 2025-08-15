const otpTemplate = (name, otp) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>MartXpress OTP Verification</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f5f6fa; margin: 0; padding: 0;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <tr>
        <td style="background-color: #4CAF50; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">MartXpress</h1>
          <p style="color: white; margin: 0;">Fast & Secure Shopping</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 30px;">
          <h2 style="color: #333;">Hello ${name},</h2>
          <p style="color: #555; font-size: 16px;">
            Thank you for registering with <strong>MartXpress</strong>.  
            Please use the OTP below to verify your email address.  
          </p>
          <p style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; padding: 15px 25px; font-size: 24px; color: #fff; background-color: #4CAF50; border-radius: 6px; letter-spacing: 4px;">
              ${otp}
            </span>
          </p>
          <p style="color: #555; font-size: 14px;">
            This OTP is valid for the next <strong>5 minutes</strong>. Please do not share it with anyone.
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 40px;">
            If you did not request this OTP, please ignore this email or contact our support team immediately.
          </p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          &copy; ${new Date().getFullYear()} MartXpress. All rights reserved.
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

module.exports = { otpTemplate };
