"use client";

import React, { useRef, useEffect } from "react";

type Option = {
  label: string;
  value: string | number;
  id?: string;
};

type GroupedOption = {
  label: string;
  options: Option[];
};

type CustomDropdownProps = {
  options: (Option | GroupedOption)[];
  placeholder?: string;
  multi?: boolean;
  selectedValue: string | number | (string | number)[];
  onSelect: (value: string | number | (string | number)[], label?: string) => void;
  label?: string;
  id?: string;
};

export default function CustomDropdown({
  options,
  placeholder = "Select",
  multi = false,
  selectedValue,
  onSelect,
  label,
  id,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isSelected = (value: string | number) => {
    if (multi && Array.isArray(selectedValue)) {
      return selectedValue.includes(value);
    }
    return selectedValue === value;
  };

  const handleSelect = (option: Option) => {
    if (multi) {
      let updated: (string | number)[];
      if (Array.isArray(selectedValue) && selectedValue.includes(option.value)) {
        updated = selectedValue.filter((v) => v !== option.value);
      } else {
        updated = Array.isArray(selectedValue) ? [...selectedValue, option.value] : [option.value];
      }
      onSelect(updated);
    } else {
      onSelect(option.value, option.label);
      setIsOpen(false);
    }
  };

  const getOptionKey = (option: Option, index: number, prefix?: string) => {
    return option.id || `${prefix || ""}${option.value}-${index}`;
  };

  const getSelectedLabel = (): string => {
    if (multi && Array.isArray(selectedValue) && selectedValue.length > 0) {
      const labels: string[] = [];
      options.forEach((option) => {
        if ("value" in option && selectedValue.includes(option.value)) {
          labels.push(option.label);
        } else if ("options" in option) {
          option.options.forEach((sub) => {
            if (selectedValue.includes(sub.value)) labels.push(sub.label);
          });
        }
      });
      return labels.join(", ");
    } else if (!multi) {
      for (const option of options) {
        if ("value" in option && option.value === selectedValue) return option.label;
        else if ("options" in option) {
          const match = option.options.find((o) => o.value === selectedValue);
          if (match) return match.label;
        }
      }
    }
    return placeholder;
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label htmlFor={id} className="block mb-1 font-medium">
          {label}
        </label>
      )}

      <button
        id={id}
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="w-full rounded-md border border-[#d2d6dd] px-4 py-2 text-left bg-white flex justify-between items-center"
      >
        <span className={selectedValue && (multi ? (selectedValue as any[]).length > 0 : true) ? "text-black" : "text-[#afafaf]"}>
          {getSelectedLabel()}
        </span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute mt-1 w-full border-[#d2d6dd] rounded-md bg-white shadow-lg max-h-60 z-50 overflow-auto">
          {options.map((option, idx) =>
            "value" in option ? (
              <li
                key={getOptionKey(option, idx)}
                className={`cursor-pointer px-4 py-2 hover:bg-blue-100 flex items-center justify-between ${
                  isSelected(option.value) ? "bg-blue-50" : ""
                }`}
                onClick={() => handleSelect(option)}
              >
                {option.label}
                {multi && isSelected(option.value) && <input type="checkbox" checked readOnly />}
              </li>
            ) : (
              <li key={`group-${idx}-${option.label}`}>
                <div className="px-4 py-2 font-semibold bg-gray-100">{option.label}</div>
                <ul>
                  {option.options.map((sub, subIdx) => (
                    <li
                      key={getOptionKey(sub, subIdx, "sub-")}
                      className={`cursor-pointer px-6 py-2 hover:bg-blue-100 flex items-center justify-between ${
                        isSelected(sub.value) ? "bg-blue-50" : ""
                      }`}
                      onClick={() => handleSelect(sub)}
                    >
                      {sub.label}
                      {multi && isSelected(sub.value) && <input type="checkbox" checked readOnly />}
                    </li>
                  ))}
                </ul>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}
