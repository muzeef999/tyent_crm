// Button.tsx
'use client';

import React from 'react';

interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ variant, children, onClick, type = 'button' }) => {
  const baseStyles = 'w-full py-3 rounded-lg text-white font-semibold focus:outline-none transition';
  const primaryStyles = 'bg-primary hover:bg-blue-700 dark:bg-darkPrimary dark:hover:bg-darkSecondary';
  const secondaryStyles = 'bg-secondary hover:bg-blue-500 dark:bg-darkSecondary dark:hover:bg-darkPrimary';

  const buttonStyles = variant === 'primary' ? `${baseStyles} ${primaryStyles}` : `${baseStyles} ${secondaryStyles}`;

  return (
    <button type={type} onClick={onClick} className={buttonStyles}>
      {children}
    </button>
  );
};

export default Button;
