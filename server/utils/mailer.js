import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,            // 587 uses STARTTLS
  requireTLS: true,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
  // optional (helps on some hosts):
  tls: {
    rejectUnauthorized: false
  }
});

export default transporter;
