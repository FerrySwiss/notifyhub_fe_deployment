"use client";
import { useRouter } from "next/navigation";
import React, { useState, FormEvent } from "react";
import OtpInput from "react-otp-input";

const OtpForm: React.FC = () => {
  const [otp, setOtp] = useState<string>("");
  const [verificationError, setVerificationError] = useState<string>("");
  const router = useRouter();

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setVerificationError("");
    console.log(`Verifying OTP: ${otp}`);
    setTimeout(() => {
      if (otp === "123456") {
        
        router.push("/");
      } else {
        setVerificationError("❌ Incorrect OTP. Please try again.");
      }
    }, 1000);
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
          <p className="mb-4 text-center text-sm font-medium text-red-600 animate-pulse">
            {verificationError}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-gradient-to-r bg-primary py-3 text-lg font-bold text-white shadow-md transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg focus:ring-2 focus:ring-emerald-400"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default OtpForm;
