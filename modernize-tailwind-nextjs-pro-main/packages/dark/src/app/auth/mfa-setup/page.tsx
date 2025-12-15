"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Label, TextInput, Alert } from "flowbite-react";
import QRCode from "qrcode";
import { authService } from "@/app/services/api";

type SignupSession = {
  username: string;
  password: string;
  email: string;
  mfa?: {
    otpauth_uri: string;
  };
};

export default function MfaSetupPage() {
  const router = useRouter();
  const [session, setSession] = useState<SignupSession | null>(null);
  const [qrImg, setQrImg] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "verifying" | "success">("idle");

  // Load signup session
  useEffect(() => {
    const raw = sessionStorage.getItem("notifyhub_signup_session");
    if (!raw) return router.replace("/auth/auth1/login");

    const parsed = JSON.parse(raw) as SignupSession;
    setSession(parsed);

    // Generate QR from otpauth
    if (parsed?.mfa?.otpauth_uri) {
      QRCode.toDataURL(parsed.mfa.otpauth_uri)
        .then(setQrImg)
        .catch(() => setQrImg(null));
    }
  }, [router]);

  const handleConfirm = async () => {
    if (!session) return;
    if (!code.trim()) return setError("Enter the 6-digit code.");

    setError(null);
    setStatus("verifying");

    try {
      // FIX: Use Login -> Verify flow instead of fetchAccessToken -> confirmMfa
      // Because we cannot get an access token via OAuth (invalid client), we must use the direct login flow.
      console.log("MfaSetup: Attempting login to verify OTP...");
      const loginResp = await authService.loginPassword(session.username, session.password);
      
      if (!loginResp.mfa_challenge_id) {
          // If no challenge, maybe we are already logged in or something is generic
          throw new Error("Login failed to return MFA challenge during setup.");
      }

      console.log("MfaSetup: Verifying OTP with challenge...");
      const verifyResp = await authService.verifyTotp(loginResp.mfa_challenge_id, code.trim());

      if (!verifyResp.ok) {
           throw new Error(verifyResp.message || "Invalid code");
      }

      // Use token from verify response
      const accessToken = verifyResp.access_token || verifyResp.token;
      if (accessToken) {
          localStorage.setItem("notifyhub_access_token", accessToken);
          setStatus("success");
          sessionStorage.removeItem("notifyhub_signup_session");
          setTimeout(() => router.push("/"), 1200); // Go to dashboard, not login
      } else {
          // Fallback if no token returned (weird)
           setStatus("success");
           setTimeout(() => router.push("/auth/auth1/login"), 1200);
      }

    } catch (err: any) {
      setError(err?.message || "Failed to confirm MFA");
      setStatus("idle");
    }
  };

  if (!session) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-lg w-full bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6 text-white">
        <h1 className="text-2xl font-bold">Secure Your Account</h1>
        <p className="text-sm text-gray-300">
          Scan this QR in Google Authenticator / Authy / 1Password and enter the 6-digit code.
        </p>

        <div className="flex justify-center">
          {qrImg ? (
            <img src={qrImg} width={240} height={240} className="rounded-lg border" />
          ) : (
            <p className="text-gray-400">Generating QR code…</p>
          )}
        </div>

        <div className="bg-gray-900 p-4 rounded-md text-xs break-words">
          <strong>Manual Input:</strong> <br />
          {session.mfa?.otpauth_uri}
        </div>

        <Label htmlFor="totp" value="Authenticator Code" />
        <TextInput
          id="totp"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          placeholder="123456"
        />

        {error && <Alert color="failure">{error}</Alert>}
        {status === "success" && <Alert color="success">MFA Confirmed! Redirecting…</Alert>}

        <Button onClick={handleConfirm} disabled={status === "verifying"} className="w-full">
          {status === "verifying" ? "Verifying…" : "Verify & Continue"}
        </Button>
      </div>
    </div>
  );
}
