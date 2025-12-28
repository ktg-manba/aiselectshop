import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT || 587);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM;

export function assertMailerConfig() {
  if (!host || !user || !pass || !from) {
    throw new Error("SMTP configuration is incomplete");
  }
}

export async function sendMagicLinkEmail(to: string, link: string) {
  assertMailerConfig();
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  await transporter.sendMail({
    from,
    to,
    subject: "Your AI Select Shop admin login link",
    text: `Click to login: ${link}`,
    html: `<p>Click to login:</p><p><a href="${link}">${link}</a></p>`,
  });
}
