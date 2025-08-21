import React, { useRef, useEffect } from "react";

type Option = {
  label: string;
  value: string;
};

type GroupedOption = {
  label: string;
  options: Option[];
};

type SimpleDropdownProps = {
  options: (Option | GroupedOption)[];
  placeholder?: string;
  selectedValue: string; // controlled selected value
  onSelect: (value: string) => void;
  label?: string; // optional label
  id?: string; // optional id for accessibility
};

export default function CustomDropdown({
  options,
  placeholder = "Select an option",
  selectedValue,
  onSelect,
  label,
  id,
}: SimpleDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Find the label of the currently selected value
  const findSelectedLabel = (): string => {
    for (const option of options) {
      if ("value" in option) {
        if (option.value === selectedValue) return option.label;
      } else {
        const match = option.options.find((o) => o.value === selectedValue);
        if (match) return match.label;
      }
    }
    return placeholder;
  };

  const selectedLabel = findSelectedLabel();

  const handleSelect = (option: Option) => {
    onSelect(option.value);
    setIsOpen(false);
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
        onClick={() => setIsOpen((open) => !open)}
        className="w-full rounded-md border border-[#d2d6dd] px-4 py-2 text-left bg-white flex justify-between items-center"
      >
        <span className={selectedValue ? "text-black" : "text-[#afafaf]"}>
          {selectedLabel}
        </span>
        <svg
          className={`w-5 h-5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto">
          {options.map((option, idx) =>
            "value" in option ? (
              // Flat option
              <li
                key={option.value}
                className="cursor-pointer px-4 py-2 hover:bg-blue-100"
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </li>
            ) : (
              // Grouped option
              <li key={`group-${idx}`}>
                <div className="px-4 py-2 font-semibold bg-gray-100">
                  {option.label}
                </div>
                <ul>
                  {option.options.map((sub) => (
                    <li
                      key={sub.value}
                      className="cursor-pointer px-6 py-2 hover:bg-blue-100"
                      onClick={() => handleSelect(sub)}
                    >
                      {sub.label}
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
