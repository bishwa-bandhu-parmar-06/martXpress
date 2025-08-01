
const welcomeTemplate = (name) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Welcome, ${name}!</h2>
      <p>Thank you for signing up. We're excited to have you on board.</p>
      <p>Feel free to explore our platform.</p>
      <br>
      <p>Regards,<br><strong>martXpress</strong></p>
    </div>
  `;
};

module.exports = { welcomeTemplate };
