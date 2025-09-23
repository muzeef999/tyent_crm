"use client";
import Input from "@/components/ui/Input";
import WelocomeImage from "@/components/ui/WelocomeImage";
import { login, verifyOtp } from "@/services/serviceApis";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { generateAndSetToken } from "@/utils/generateAndSetToken";

export default function EmployeeLogin() {
  const [phone, setPhone] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [maskedPhone, setMaskedPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [otpTimer, setOtpTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // OTP timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // 🔹 Search employee when phone length is 10
  const {
    data: contactSearch,
    isFetching: isSearching,
    error: searchError,
    refetch: searchEmployee
  } = useQuery({
    queryKey: ["login", phone],
    queryFn: () => login(phone),
    enabled: false, // Don't run automatically
    retry: false
  });

  // 🔹 Verify OTP mutation
  const { mutate: verifyOtpMutation, isPending: isVerifying } = useMutation({
    mutationKey: ["verifyOtp"],
    mutationFn: () => verifyOtp(phone, otp.join("")),
    onSuccess: (data) => {
      toast.success("OTP verified successfully!");

        window.location.reload();
      // You might want to redirect or set auth state here
    },
    onError: (error: any) => {
      toast.error(error.message || "Error verifying OTP");
    },
  });

  // 🔹 Send OTP mutation
  const { mutate: sendOtpMutation, isPending: isSendingOtp } = useMutation({
    mutationKey: ["sendOtp"],
    mutationFn: () => login(phone),
    onSuccess: (data) => {
      // Mask phone
      const last2 = phone.slice(-2);
      setMaskedPhone("XXXXXXXX" + last2);
      setIsOtpSent(true);
      setOtpTimer(60); // 60 seconds timer
      toast.success("OTP sent successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error sending OTP");
    },
  });

  // 🔹 When Send OTP is clicked
  const handleSendOtp = async () => {
    if (phone.replace(/\D/g, "").length !== 10) {
      toast.error("Enter valid 10-digit phone number");
      return;
    }
    
    // Check if employee exists first
    try {
      const result = await searchEmployee();
      if (result.data) {
        sendOtpMutation();
      }
    } catch (error) {
      toast.error("Employee not found");
    }
  };

  // 🔹 OTP input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto verify when all digits are filled
      if (newOtp.every((digit) => digit !== "")) {
        verifyOtpMutation();
      }
    }
  };

  // 🔹 Backspace handler
  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // 🔹 Resend OTP
  const handleResendOtp = () => {
    if (otpTimer > 0) return;
    
    setOtp(new Array(6).fill(""));
    sendOtpMutation();
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      <div className="h-screen min-w-[400px] flex items-end justify-center">
        <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-t-2xl">
          <WelocomeImage />
          <h1 className="text-4xl font-bold mb-2 text-center text-primary">
            Welcome Back
          </h1>
          <p className="text-center text-primary mb-6">
            Let’s get started with your work
          </p>

          {/* 📱 Phone input section */}
          {!isOtpSent ? (
            <div className="flex flex-col mb-4">
              <Input
                label="Phone Number"
                name="phone"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                maxLength={10}
              />
              {contactSearch ? (
                <p className="text-green-600 -mt-4 text-sm">
                  ✓ {contactSearch?.message || "Employee found"}
                </p>
              ) : phone && searchError ? (
                <p className="text-red-500 -mt-4 text-sm">Employee not found</p>
              ) : null}
              {isSearching && (
                <p className="text-blue-500 -mt-4 text-sm">Searching...</p>
              )}

              <button
                onClick={handleSendOtp}
                disabled={isSendingOtp || isSearching}
                className="mt-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg shadow-md"
              >
                {isSendingOtp ? "Sending..." : "Send OTP"}
              </button>
            </div>
          ) : (
            <div>
              {/* 🔹 OTP Sent Info */}
              <div className="bg-blue-50 text-blue-600 text-sm px-4 py-2 rounded-lg mb-3 text-center shadow-sm">
                OTP sent to <span className="font-semibold">{maskedPhone}</span>
              </div>

              {/* 🔹 OTP Input */}
              <label className="text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <div className="flex gap-2 justify-center mt-2">
                {otp.map((digit, index) => (
                  <React.Fragment key={index}>
                    <Input
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handleChange(
                          e as React.ChangeEvent<HTMLInputElement>,
                          index
                        )
                      }
                      onKeyDown={(e) => handleBackspace(e, index)}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                    />
                    {index === 2 && (
                      <span className="mx-1 text-2xl text-gray-500">-</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* 🔹 Verify / Resend */}
              <button
                onClick={() => verifyOtpMutation()}
                disabled={isVerifying || otp.some(digit => digit === "")}
                className="mt-6 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium shadow-md w-full"
              >
                {isVerifying ? "Verifying..." : "Verify OTP"}
              </button>

              <div className="mt-3 flex justify-center">
                {otpTimer > 0 ? (
                  <span className="text-gray-500 text-sm">
                    Resend OTP in {otpTimer}s
                  </span>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    className="text-blue-500 text-sm hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Support */}
          <p className="text-sm text-gray-500 text-center mt-6">
            Any login issue or facing trouble? <br />
            Mail us at{" "}
            <a
              href="mailto:it@tyent.co.in"
              className="text-[#04a5e3] font-medium"
            >
              it@tyent.co.in
            </a>
          </p>
        </div>
      </div>
    </motion.div>
  );
}