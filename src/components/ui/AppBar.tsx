// src/components/AppBar.tsx
"use client";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

import { IoNotificationsOutline } from "react-icons/io5";

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
      className={`fixed left-60 right-0 top-0 z-50 transition-shadow px-8 ${
        scrolling ? "shadow-md" : ""
      }`}
    >
      <div className="flex relative justify-between items-center p-2 px-t">
        <div></div>
        <div className="flex items-center space-x-3 mb-2">
          <div className="border rounded-full">
            <ThemeToggle />
          </div>
          <div className="border rounded-full p-1">
            <IoNotificationsOutline size={24} />
          </div>
        </div>

        <div className="absolute mt-8 flex justify-between w-full">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 dark:text-gray-100">
            Need help?
          </h1>

          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 dark:text-gray-100">Hello, Muzeef 👋</h1>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default AppBar;
