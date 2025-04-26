const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
  port: process.env.SMTP_PORT, // 465 (SSL) or 587 (TLS)
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // <<== ADD THIS LINE
  },
});

exports.sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Support Team" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });
    console.log("📧 Email sent successfully");
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};
