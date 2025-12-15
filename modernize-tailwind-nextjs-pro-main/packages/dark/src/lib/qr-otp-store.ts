import { v4 as uuidv4 } from 'uuid';

export const qrOtpStore = new Map<string, { userId: string, expiresAt: Date }>();
export const OTP_EXPIRATION_SECONDS = 300; // 5 minutes

// Function to clean up expired OTPs (optional, for in-memory store)
setInterval(() => {
  const now = new Date();
  for (const [otp, data] of qrOtpStore.entries()) {
    if (data.expiresAt < now) {
      qrOtpStore.delete(otp);
      console.log(`Expired QR OTP removed: ${otp}`);
    }
  }
}, 60 * 1000); // Run every minute
