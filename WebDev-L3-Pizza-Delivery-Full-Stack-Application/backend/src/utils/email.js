import nodemailer from "nodemailer";

let transporter;
const getTransporter = () => {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE) === "true",
    auth: { user: process.env.SMTP_USER?.trim(), pass: process.env.SMTP_PASS?.trim() },
  });
  return transporter;
};

export const sendMail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASS.");
  }
  return getTransporter().sendMail({
    from: `"${process.env.MAIL_FROM_NAME || "PizzaFlow"}" <${process.env.ADMIN_EMAIL || process.env.SMTP_USER}>`,
    to, subject, html,
  });
};
