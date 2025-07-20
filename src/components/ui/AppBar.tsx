// src/components/AppBar.tsx
'use client';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

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
      <div className="flex justify-between items-center p-2 max-w-7xl mx-auto">
        <div className="text-white font-semibold text-xl">Dashboard</div>
        <div className="flex items-center space-x-6">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default AppBar;
