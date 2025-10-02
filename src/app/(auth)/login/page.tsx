"use client";
import React from "react";
import AddLogin from "./AddLogin";
import whiteLogo from "@/asserts/white-logo.png";
import Image from "next/image";

const Page = () => {
  return (
    <div className="bg-[linear-gradient(135deg,#04a5e3,#6dd5fa,#ffffff)]">
      <div className="container flex flex-col min-h-screen md:flex-row">
        
        {/* Left Content */}
        <div className="hidden md:flex justify-center items-center">
        <div className="p-16 space-y-6">
          {/* Logo */}
          <div className="w-32 md:w-40">
            <Image
              src={whiteLogo}
              alt="White Logo"
              priority
              className="w-full h-auto"
            />
          </div>

          {/* Headings */}
          <h1 className="text-white font-bold text-5xl md:text-6xl">
            Hey, Hello!
          </h1>
          <h2 className="text-white text-2xl font-medium">
            Your employee dashboard starts here
          </h2>

          {/* Description */}
          <p className="text-white opacity-80 leading-relaxed">
            Login with your registered phone number and OTP to access your work,
            track tasks, and manage daily operations seamlessly.
          </p>
        </div>
        </div>

        {/* Right Content (Login Form) */}
        <div className="m-2">
          <AddLogin />
        </div>
      </div>
    </div>
  );
};

export default Page;
