'use client';

import { useEffect, useState } from 'react';
import { CiDark } from "react-icons/ci";
import { IoSunnyOutline } from "react-icons/io5";



const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
    setIsDark(shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-1 rounded-full bg-background"
      title="Toggle Theme"
    >
      {isDark ? <IoSunnyOutline  size={24}/> : <CiDark size={24} />}
    </button>
  );
};

export default ThemeToggle;
