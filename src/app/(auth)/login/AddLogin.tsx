"use client";
import Input from "@/components/ui/Input";
import WelocomeImage from "@/components/ui/WelocomeImage";
import { login, verifyOtp } from "@/services/serviceApis";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function EmployeeLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(new Array(6).fill("")); // 6 boxes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // useQuery to search phone number only when length === 10
  const {
    data: contactSearch,
    error: productError,
    isFetching: isSearching,
  } = useQuery({
    queryKey: ["login", phone],
    queryFn: () => login(phone),
    enabled: phone.replace(/\D/g, "").length === 10, // only fetch when 10 digits
  });

  const { mutate } = useMutation({
    mutationKey: ["verifyOtp"],
    mutationFn: () => verifyOtp(phone, otp.join("")),
    onSuccess: (data) => {
      toast.success("OTP verified successfully:", data);
    },
    onError: (error) => {
      toast.error("Error verifying OTP:");
    },
  });

  // Handle OTP input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      // only allow numbers
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // move to next input
      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      if (newOtp.every((digit) => digit !== "")) {
        mutate(); // call your API when all 6 digits are filled
      }
    }
  };

  // Handle backspace to move focus back
  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <motion.div
      initial={{ y: "100%" }} // 🔹 Start completely below the screen
      animate={{ y: 0 }} // 🔹 Animate back to original position
      transition={{ duration: 0.9, ease: "easeOut" }} // 🔹 Smooth slow-up
    >
      <div className="h-screen flex items-end justify-center">
        <div className="w-full max-w-md p-6  bg-white shadow-lg rounded-t-2xl">
          <WelocomeImage />
          <h1 className="text-4xl font-bold mb-2 text-center text-primary">
            Welcome Back
          </h1>
          <p className="text-center text-primary mb-6">
            Let’s get started with your work
          </p>
          {/* Phone Input */}
          <div className="flex flex-col mb-4">
            <Input
              label="Phone Number"
              name="phone"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {contactSearch ? (
              <p className="text-green-600 -mt-4 text-sm">
                ✓ {contactSearch?.message || "Employee found"}
              </p>
            ) : phone && !isSearching ? (
              <p className="text-red-500 -mt-4 text-sm">Employee not found</p>
            ) : null}
            {isSearching && (
              <p className="text-blue-500 -mt-4 text-sm">Searching...</p>
            )}
          </div>
          {/* OTP Input */}
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Enter OTP
          </label>
          <div className="flex gap-2">
            {otp.map((digit, index) => (
              <React.Fragment key={index}>
                <Input
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleBackspace(e, index)}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  className="w-12 text-center px-0"
                />
                {index === 2 && (
                  <span className="mx-1 text-2xl justify-center">-</span>
                )}
              </React.Fragment>
            ))}
          </div>
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
