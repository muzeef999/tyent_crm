"use client";

import { InputProps } from "@/types/customer";
import React, { forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      name,
      type = "text",
      placeholder,
      onKeyDown,
      value,
      maxLength,
      onBlur,
      onChange,
      disabled = false,
      className = "",
      max,
      min,
      onFocus,
      inputMode
    },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-1 mb-4">
        {label && (
          <label
            htmlFor={name}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <input
        inputMode={inputMode}
          ref={ref}
          maxLength={maxLength}
          id={name}
          name={name}
          type={type}
          className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white dark:border-gray-600 ${className}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          disabled={disabled}
          max={max}
          min={min}
          onFocus={onFocus}

        />
      </div>
    );
  }
);

Input.displayName = "Input"; // ⚠️ required when using forwardRef

export default Input;
