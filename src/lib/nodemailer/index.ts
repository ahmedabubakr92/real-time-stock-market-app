import nodemailer from "nodemailer";
import {
  NEWS_SUMMARY_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "@/lib/nodemailer/templates";

const NODEMAILER_EMAIL = process.env.NODEMAILER_EMAIL;
const NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD;

if (!NODEMAILER_EMAIL || !NODEMAILER_PASSWORD) {
  throw new Error("Missing NODEMAILER_EMAIL or NODEMAILER_PASSWORD");
}

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: NODEMAILER_EMAIL,
    pass: NODEMAILER_PASSWORD,
  },
});

export async function sendWelcomeEmail({
  email,
  name,
  intro,
}: WelcomeEmailData) {
  const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replaceAll(
    "{{name}}",
    name,
  ).replaceAll("{{intro}}", intro);

  const mailOptions = {
    from: `"Signalist" <${NODEMAILER_EMAIL}>`,
    to: email,
    subject: `Welcome to Signalist - your stock market toolkit is ready!`,
    text: "Thanks for joining Signalist",
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendNewsEmail({
  email,
  name,
  newsContent,
  date,
}: {
  email: string;
  name: string;
  newsContent: string;
  date: string;
}) {
  const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE.replaceAll(
    "{{newsContent}}",
    newsContent,
  ).replaceAll("{{date}}", date);

  const mailOptions = {
    from: `"Signalist" <${NODEMAILER_EMAIL}>`,
    to: email,
    subject: `Your Daily Market Digest — ${date}`,
    text: `Here's your daily market news summary, ${name}`,
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions)
}
