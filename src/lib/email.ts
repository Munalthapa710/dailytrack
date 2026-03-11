import crypto from "crypto";

function getBaseUrl() {
  return process.env.APP_URL || "http://localhost:3000";
}

function getResendApiKey() {
  return process.env.RESEND_API_KEY || null;
}

function getEmailFrom() {
  return process.env.EMAIL_FROM || null;
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
  const resendApiKey = getResendApiKey();

  if (!resendApiKey) {
    console.info(`Resend not configured. Verification link for ${email}: ${verificationUrl}`);
    return;
  }

  const from = getEmailFrom();
  if (!from) {
    throw new Error("EMAIL_FROM must be configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
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
    }),
    signal: AbortSignal.timeout(10000)
  });

  if (!response.ok) {
    const payload = (await response.text()) || "Unknown email provider error.";
    throw new Error(`Verification email failed: ${payload}`);
  }
}
