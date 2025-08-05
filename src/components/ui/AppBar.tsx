// src/components/AppBar.tsx
"use client";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import logo from "@/asserts/logo.png";
import { IoNotificationsOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";

const AppBar = () => {
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed w-full top-0 z-50 transition-shadow px-8 ${
        scrolling ? "shadow-md" : ""
      }`}
    >
      <div className="flex justify-between items-center p-2 px-t">
     
        <div className="flex items-center">
          <Image
            src={logo}
            alt="logo"
            width={120}
            height={40}
            priority
            className="object-contain"
          />
        </div>
     
        <div className="flex items-center space-x-3 mb-2">
          <div className="border rounded-full">
            <ThemeToggle />
          </div>
          <div className="border rounded-full p-1">
            <IoNotificationsOutline size={24} />
          </div>
          <div className="border rounded-full p-1">
            <CgProfile size ={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppBar;
