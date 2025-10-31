import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // 587 uses STARTTLS
  auth: {
    user: process.env.BREVO_SMTP_USER || "9a7cd8001@smtp-brevo.com",
    pass: process.env.BREVO_SMTP_PASS || "YOUR_SMTP_KEY"
  },
  // Recommended settings for Brevo
  tls: {
    // Only for development/testing
    // Remove this in production or set to true
    rejectUnauthorized: process.env.NODE_ENV !== 'production'
  }
});

export default transporter;
