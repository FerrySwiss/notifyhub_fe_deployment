"use client";

import { useRouter } from "next/navigation";
import React, { useState, FormEvent, useEffect } from "react";
import OtpInput from "react-otp-input";
import { authService } from "@/app/services/api";
import { Alert } from "flowbite-react";

type LoginSession = {
  username: string;
  password: string;
  mfa_challenge_id: string;
};

const OtpForm: React.FC = () => {
  const [otp, setOtp] = useState<string>("");
  const [verificationError, setVerificationError] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "verifying">("idle");
  const router = useRouter();
  const [session, setSession] = useState<LoginSession | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("notifyhub_login_session");
    if (!raw) {
      router.replace("/auth/auth1/login");
      return;
    }
    try {
      const parsed = JSON.parse(raw) as LoginSession;
      setSession(parsed);
    } catch {
      router.replace("/auth/auth1/login");
    }
  }, [router]);

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setVerificationError("");
    if (!session) return;
    if (!otp.trim()) {
      setVerificationError("Enter the 6-digit code from your authenticator app.");
      return;
    }
    setStatus("verifying");
    try {
      const verifyResp = await authService.verifyTotp(
        session.mfa_challenge_id,
        otp.trim()
      );
      if (!verifyResp.ok) {
        throw new Error(verifyResp.message || "Invalid code");
      }
      
      // FIX: Use token from verify response if available
      let accessToken = verifyResp.access_token || verifyResp.token;
      
      if (!accessToken) {
          console.warn("MFA Verify response did not contain token, attempting legacy fetchAccessToken flow...");
          const token = await authService.fetchAccessToken({
            username: session.username,
            password: session.password,
            mfaToken: verifyResp.mfa_token,
          });
          accessToken = token.access_token;
      }
      
      localStorage.setItem("notifyhub_access_token", accessToken);
      sessionStorage.removeItem("notifyhub_login_session");
      router.push("/");
    } catch (err: any) {
      setVerificationError(err?.message || "❌ Incorrect OTP. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <div className="mx-auto my-16 max-w-md rounded-2xl bg-lightprimary p-8 shadow-2xl backdrop-blur-lg transition-transform duration-500 hover:scale-[1.02]">
      <form onSubmit={handleVerifyOtp}>
        <h2 className="mb-4 text-center text-3xl font-extrabold text-gray-800">
          Verify OTP
        </h2>
        <p className="mb-6 text-center text-gray-500">
          Please enter the 6-digit OTP sent to your registered email/phone.
        </p>

        <div className="mb-6 flex justify-center">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderInput={(props) => <input {...props} />}
            inputStyle="!w-12 md:!w-14 h-12 md:h-14 rounded-lg border border-gray-300 text-center text-2xl font-semibold shadow-sm transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            containerStyle="flex justify-center gap-2"
          />
        </div>

        {verificationError && (
          <Alert color="failure" className="mb-4 text-center">
            {verificationError}
          </Alert>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-gradient-to-r bg-primary py-3 text-lg font-bold text-white shadow-md transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg focus:ring-2 focus:ring-emerald-400 disabled:opacity-70"
          disabled={status === "verifying"}
        >
          {status === "verifying" ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default OtpForm;
