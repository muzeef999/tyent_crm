'use client';

import { InputProps } from '@/types/customer';
import React from 'react';


const Input: React.FC<InputProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  onKeyDown,
  value,
  onBlur,
  onChange,
  required = false,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1 mb-4">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white dark:border-gray-600"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        required={required}
        disabled={disabled}
      />
    </div>
  );
};

export default Input;
