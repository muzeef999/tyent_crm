// src/components/AppBar.tsx
"use client";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { IoNotificationsOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { FaRegUser } from "react-icons/fa";
import TypeSearch from "../TypeSearch";
import useDebounce from "@/hooks/useDebounce";
import { useAuth } from "@/hooks/useAuth";

const AppBar = () => {
    const { user } = useAuth();

  const [scrolling, setScrolling] = useState(false);
const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);


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
      className={`fixed left-60 right-0 top-0 z-9 transition-shadow px-8 bg-background ${
        scrolling ? "shadow-md" : ""
      }`}
    >
      <div className="flex relative justify-between items-center p-2 px-t">
        <div>
          <div className="flex-1 min-w-[200px]">
            <TypeSearch onSearch={setSearchText} />
          </div>
        </div>
        <div className="flex items-center space-x-3 mb-2">
          <div className="border rounded-full">
            <ThemeToggle />
          </div>
          <div className="border rounded-full p-1">
            <IoNotificationsOutline size={24} />
          </div>
          <div className="flex items-center space-x-1">
            <div className="border rounded-full p-1 bg-[#b9b9b9]">
              <FaRegUser size={24} fill="white" />
            </div>
            <div>
              <p className="text-md mb-0 p-0">{user?.customer}</p>
              <p className="text-sm -mt-1 p-0 text-gray-500">{user?.designation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppBar;
