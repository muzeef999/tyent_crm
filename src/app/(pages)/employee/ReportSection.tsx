"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import { FaDownload } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

export default function ReportsSection() {
  const router = useRouter();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // 🔹 Router push after selecting dates
  const pushToRouter = () => {
    if (startDate && endDate) {
      const s = startDate.toISOString().split("T")[0];
      const e = endDate.toISOString().split("T")[0];
      router.push(`?start=${s}&end=${e}`);
    }
  };

  // 🔹 Report summary
  const getSummary = () => {
    if (startDate && endDate) {
      return `Showing report from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}.`;
    }
    return "Please select start and end dates.";
  };

  return (
    <div className="p-6 rounded-2xl shadow-lg bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <FiFileText className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Employee</h3>
        </div>
        <button
          onClick={pushToRouter}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1 hover:bg-gray-50 cursor-pointer"
        >
          <FaDownload className="h-4 w-4" />
          Export
        </button>
      </div>

      {/* Date Range Picker */}
      <div className="flex gap-2 mb-6">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start date"
          className="border px-3 py-2 rounded-lg w-full"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => {
            setEndDate(date);
            pushToRouter(); // auto-push on end date selection
          }}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate ?? undefined}
          placeholderText="End date"
          className="border px-3 py-2 rounded-lg w-full"
        />
      </div>

      {/* Report Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <FiFileText className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">select Employe  data</span>
        </div>
        <p className="text-sm text-gray-600">{getSummary()}</p>
      </div>
    </div>
  );
}
