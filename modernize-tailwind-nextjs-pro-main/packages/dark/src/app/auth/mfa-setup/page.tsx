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
  accessToken?: string;
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
      let accessToken = session.accessToken;

      // Fallback: if no token from silent login, try to login again
      if (!accessToken) {
        console.log("MfaSetup: No token found, attempting login...");
        const loginResp = await authService.loginPassword(session.username, session.password);
        if (loginResp.access_token) {
           accessToken = loginResp.access_token;
        } else if (loginResp.mfa_required) {
             // This shouldn't theoretically happen during setup unless setup is half-done?
             // But if it does, we can't really proceed easily without the token.
             throw new Error("Login required MFA but setup is not complete.");
        } else {
             throw new Error("Could not obtain access token.");
        }
      }

      console.log("MfaSetup: Confirming MFA with token...");
      const confirmResp = await authService.confirmMfa(code.trim(), accessToken as string);

      if (!confirmResp.ok) {
           throw new Error(confirmResp.message || "Invalid code");
      }

      // Success! Token is valid. Store and redirect.
      localStorage.setItem("notifyhub_access_token", accessToken as string);
      setStatus("success");
      sessionStorage.removeItem("notifyhub_signup_session");
      setTimeout(() => router.push("/"), 1200);

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
