import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const {
  OTP_SMTP_HOST,
  OTP_SMTP_PORT,
  OTP_SMTP_USER,
  OTP_SMTP_PASS,
  OTP_FROM_EMAIL,
} = process.env;

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 }
    );
  }

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const smtpConfigured =
    OTP_SMTP_HOST && OTP_SMTP_PORT && OTP_SMTP_USER && OTP_SMTP_PASS;

  if (!smtpConfigured) {
    console.warn(
      "[send-otp] SMTP credentials missing. Returning OTP without sending email. " +
        "Set OTP_SMTP_HOST/PORT/USER/PASS env vars to enable email delivery."
    );
    return NextResponse.json({
      otp,
      delivered: false,
      message:
        "SMTP credentials missing; OTP returned directly (dev mode). Please configure email to send real OTPs.",
    });
  }

  // Create a transporter object using provided SMTP credentials
  const transporter = nodemailer.createTransport({
    host: OTP_SMTP_HOST,
    port: Number(OTP_SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: OTP_SMTP_USER,
      pass: OTP_SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: OTP_FROM_EMAIL || '"NotifyHub" <noreply@notifyhub.local>',
      to: email,
      subject: "Your OTP for registration",
      text: `Your OTP is ${otp}`,
      html: `<p>Your OTP is <strong>${otp}</strong></p>`,
    });

    return NextResponse.json({ otp, delivered: true });
  } catch (error) {
    console.error("[send-otp] Failed to send email:", error);
    return NextResponse.json(
      {
        error:
          "Failed to send OTP email. Check SMTP credentials or server connectivity.",
      },
      { status: 500 }
    );
  }
}
