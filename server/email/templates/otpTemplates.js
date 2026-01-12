export const otpTemplate = (email, otp) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>MartXpress OTP Verification</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body style="font-family: 'Poppins', Arial, sans-serif; background-color: #f2f4f3; margin: 0; padding: 20px 0;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e5e7eb;">
      <!-- Header -->
      <tr>
        <td style="background: linear-gradient(135deg, #ff6720 0%, #e25a1b 100%); padding: 25px; text-align: center;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">MartXpress</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0; font-size: 16px; font-weight: 500;">Fast & Secure Shopping</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      
      <!-- Content -->
      <tr>
        <td style="padding: 40px 30px;">
          <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 24px; font-weight: 600;">Hello ${email},</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px;">
            Thank you for choosing <strong style="color: #ff6720;">MartXpress</strong>. 
            Please use the verification code below to complete your registration.
          </p>
          
          <!-- OTP Box -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
            <tr>
              <td align="center">
                <div style="display: inline-block; padding: 18px 30px; font-size: 28px; font-weight: 700; color: #ffffff; background: linear-gradient(135deg, #0050A0 0%, #003a75 100%); border-radius: 12px; letter-spacing: 8px; box-shadow: 0 4px 12px rgba(0, 80, 160, 0.2);">
                  ${otp}
                </div>
              </td>
            </tr>
          </table>
          
          <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0 0 10px;">
            This verification code is valid for the next <strong style="color: #ff6720;">10 minutes</strong>. 
          </p>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0;">
            For your security, please do not share this code with anyone. MartXpress will never ask you for your verification code.
          </p>
          
          <!-- Support Note -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 40px; background-color: #fff7ed; border-left: 4px solid #ff6720; border-radius: 4px;">
            <tr>
              <td style="padding: 15px;">
                <p style="color: #9a3412; font-size: 14px; line-height: 1.5; margin: 0;">
                  <strong>Note:</strong> If you didn't request this code, please ignore this email or 
                  <a href="mailto:support@martxpress.com" style="color: #0050A0; text-decoration: none;">contact our support team</a> immediately.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      
      <!-- Footer -->
      <tr>
        <td style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 10px;">
            &copy; ${new Date().getFullYear()} MartXpress. All rights reserved.
          </p>
          <p style="margin: 0; font-size: 11px;">
            <a href="#" style="color: #0050A0; text-decoration: none; margin: 0 10px;">Privacy Policy</a> • 
            <a href="#" style="color: #0050A0; text-decoration: none; margin: 0 10px;">Terms of Service</a> • 
            <a href="#" style="color: #0050A0; text-decoration: none; margin: 0 10px;">Contact Us</a>
          </p>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

// export { otpTemplate };
