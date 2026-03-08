export const resetPasswordTemplate = (email, resetUrl) => {
  console.log("checking the final url received : ", resetUrl);
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Reset Your Password</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body style="font-family: 'Poppins', Arial, sans-serif; background-color: #f2f4f3; margin: 0; padding: 20px 0;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e5e7eb;">
      <tr>
        <td style="background: linear-gradient(135deg, #ff6720 0%, #e25a1b 100%); padding: 25px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">MartXpress</h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 40px 30px;">
          <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 24px; font-weight: 600;">Hello ${email},</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px;">
            We received a request to reset your password. Click the button below to set a new password. This link is valid for <strong>15 minutes</strong>.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
            <tr>
              <td align="center">
                <a href="${resetUrl}" style="display: inline-block; padding: 14px 30px; font-size: 16px; font-weight: 600; color: #ffffff; background-color: #0050A0; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 12px rgba(0, 80, 160, 0.2);">
                  Reset Password
                </a>
              </td>
            </tr>
          </table>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0;">
            If you didn't request this, please ignore this email. Your password will remain unchanged.
          </p>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};
