// src/components/AppBar.tsx
'use client';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import Image from 'next/image';
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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed w-full top-0 z-50 transition-shadow ${scrolling ? 'shadow-md' : ''}`}>
      <div className="flex justify-end items-end p-2 max-w-7xl mx-auto">
       <div className="w-[32%]">
        <Image src={logo} alt="logo" fill priority className="object-contain" />
      </div>

        <div className="flex items-center space-x-6  border rounded-full">
          <ThemeToggle />
        </div>
         <div className="flex items-center space-x-6  border rounded-full">
          <IoNotificationsOutline />
        </div>
        <div className="flex items-center space-x-6  border rounded-full">
          <CgProfile />
        </div>
        
      </div>
    </div>
  );
};

export default AppBar;
