import crypto from "crypto";
import nodemailer from "nodemailer";

function getBaseUrl() {
  return process.env.APP_URL || "http://localhost:3000";
}

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: {
      user,
      pass
    }
  });
}

export function createEmailVerificationToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  return {
    rawToken,
    hashedToken,
    expiry: new Date(Date.now() + 1000 * 60 * 60 * 24)
  };
}

export function hashVerificationToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function sendVerificationEmail({
  email,
  name,
  token
}: {
  email: string;
  name: string;
  token: string;
}) {
  const verificationUrl = `${getBaseUrl()}/verify-email?token=${token}`;
  const transport = getTransport();

  if (!transport) {
    console.info(`Email transport not configured. Verification link for ${email}: ${verificationUrl}`);
    return;
  }

  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
  if (!from) {
    throw new Error("EMAIL_FROM or SMTP_USER must be configured.");
  }

  await transport.sendMail({
    from,
    to: email,
    subject: "Verify your DailyRoutine account",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2>Verify your email</h2>
        <p>Hello ${name},</p>
        <p>Confirm your email address to activate your DailyRoutine account.</p>
        <p>
          <a href="${verificationUrl}" style="display:inline-block;padding:12px 18px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px;">
            Verify email
          </a>
        </p>
        <p>If the button does not work, open this link:</p>
        <p>${verificationUrl}</p>
      </div>
    `
  });
}
