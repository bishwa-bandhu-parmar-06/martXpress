import transporter from "./transporter.js";

export const sendEmail = async (to, subject, html) => {
  const fromSender = `"martXpress" <${process.env.SENDER_EMAIL}>`;
  try {
    // console.log("Sending email to:", to);
    const result = await transporter.sendMail({
      from: fromSender,
      to,
      subject,
      html,
    });
    // console.log("fromSender", fromSender);
    // console.log("✅ Email sent result:", result);
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
};
