import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type CustomDateRangeDropdownProps = {
  label: string;
  onDateChange: (start: Date | null, end: Date | null) => void;
};

const CustomDateRangeDropdown: React.FC<CustomDateRangeDropdownProps> = ({
  label,
  onDateChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full">
      <label className="text-sm font-semibold mb-1 block">{label}</label>

      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-md border border-[#d2d6dd] px-4 py-2 text-left bg-white flex justify-between items-center"
      >
         <span className="text-sm truncate">
    {startDate && endDate
      ? `${startDate.toLocaleDateString()} → ${endDate.toLocaleDateString()}`
      : "Select Date Range"}
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

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute mt-2 w-full bg-white border-[#d2d6dd] shadow-lg rounded-lg p-3 z-50">
          <div className="flex flex-col gap-3">
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                onDateChange(date, endDate);
              }}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Start Date"
              className="border rounded-lg px-3 py-2 w-full"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => {
                setEndDate(date);
                onDateChange(startDate, date);
                setIsOpen(false);
              }}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate ?? undefined} // ✅ Fix type error
              placeholderText="End Date"
              className="border rounded-lg px-3 py-2 w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDateRangeDropdown;
