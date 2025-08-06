'use client';

import React from 'react';

interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ variant, children, onClick, type = 'button' }) => {
  const baseStyles =
    'inline-flex items-center justify-center px-4 py-3 rounded-full font-semibold text-sm transition duration-300 focus:outline-none cursor-pointer';

  const primaryStyles = `
    bg-primary text-white 
    hover:bg-white hover:text-primary 
    border border-primary 
    dark:bg-darkPrimary dark:hover:bg-darkSecondary 
    dark:hover:text-white dark:border-white
  `;

  const secondaryStyles = `
    bg-secondary text-white 
    hover:bg-blue-600 
    border border-transparent 
    dark:bg-darkSecondary dark:hover:bg-darkPrimary
  `;

  const buttonStyles = variant === 'primary'
    ? `${baseStyles} ${primaryStyles}`
    : `${baseStyles} ${secondaryStyles}`;

  return (
    <button type={type} onClick={onClick} className={`${buttonStyles} m-2`}>
      {children}
    </button>
  );
};

export default Button;
