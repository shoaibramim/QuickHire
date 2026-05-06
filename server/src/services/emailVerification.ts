import crypto from "crypto";
import nodemailer from "nodemailer";

const OTP_TTL_MS = 10 * 60 * 1000;
const LINK_TTL_MS = 30 * 60 * 1000;

export interface VerificationBundle {
  otp: string;
  otpHash: string;
  otpExpiresAt: Date;
  token: string;
  tokenHash: string;
  tokenExpiresAt: Date;
  verificationUrl: string;
}

export interface VerificationEmailPayload {
  to: string;
  name: string;
  roleLabel: string;
  otp: string;
  verificationUrl: string;
}

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function getClientOrigin() {
  return (process.env.CLIENT_ORIGIN ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export function createVerificationBundle(email: string): VerificationBundle {
  const otp = String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
  const token = crypto.randomBytes(32).toString("hex");
  const verificationUrl = new URL("/", getClientOrigin());
  verificationUrl.searchParams.set("email", email);
  verificationUrl.searchParams.set("token", token);
  verificationUrl.searchParams.set("verify", "1");

  return {
    otp,
    otpHash: sha256(otp),
    otpExpiresAt: new Date(Date.now() + OTP_TTL_MS),
    token,
    tokenHash: sha256(token),
    tokenExpiresAt: new Date(Date.now() + LINK_TTL_MS),
    verificationUrl: verificationUrl.toString(),
  };
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: (process.env.SMTP_SECURE ?? "false") === "true",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
  });
}

export async function sendVerificationEmail(payload: VerificationEmailPayload) {
  const transporter = getTransporter();
  const fromAddress =
    process.env.SMTP_FROM ??
    process.env.SMTP_USER ??
    "QuickHire <no-reply@quickhire.local>";
  const subject = "Verify your QuickHire email address";
  const text = [
    `Hi ${payload.name},`,
    "",
    `Your ${payload.roleLabel.toLowerCase()} account is ready. Verify your email to continue.`,
    `Verification link: ${payload.verificationUrl}`,
    `One-time code: ${payload.otp}`,
    "",
    "If you did not create this account, you can ignore this message.",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
      <h2 style="margin:0 0 12px;font-size:20px">Verify your QuickHire email</h2>
      <p style="margin:0 0 12px">Hi ${payload.name}, your ${payload.roleLabel.toLowerCase()} account is ready. Verify your email to continue.</p>
      <p style="margin:0 0 16px"><a href="${payload.verificationUrl}" style="display:inline-block;background:#3b5bfd;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:700">Verify email</a></p>
      <p style="margin:0 0 8px"><strong>One-time code:</strong> ${payload.otp}</p>
      <p style="margin:0;color:#475569">If you did not create this account, you can ignore this email.</p>
    </div>
  `;

  if (!transporter) {
    console.info(
      "[emailVerification] SMTP not configured; verification email preview:",
    );
    console.info({
      to: payload.to,
      subject,
      verificationUrl: payload.verificationUrl,
      otp: payload.otp,
    });
    return { mode: "console" as const };
  }

  await transporter.sendMail({
    from: fromAddress,
    to: payload.to,
    subject,
    text,
    html,
  });

  return { mode: "smtp" as const };
}

export function hashVerificationValue(value: string) {
  return sha256(value.trim());
}
