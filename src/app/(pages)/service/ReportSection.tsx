"use client";

import { useState } from "react";
import { BarChart } from "recharts";
import { FaDownload } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import CustomDateRangeDropdown from "@/components/ui/CustomDateDropdown";
import { useRouter } from "next/navigation";

export function ReportsSection() {
  const router = useRouter();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Calculate number of days between startDate and endDate
  const calculateDays = () => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end
      return diffDays;
    }
    return 0;
  };

  const availableYears = [2025, 2024, 2023, 2022]; // from API

  return (
    <div className="p-6 rounded-2xl shadow-lg bg-background">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary">
            <BarChart className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Reports</h3>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1 hover:bg-gray-50 cursor-pointer">
          <FaDownload className="h-4 w-4" />
          Export
        </button>
      </div>

      <div className="space-y-4">
        {/* Date Range Selector */}
        <CustomDateRangeDropdown
          label="Select Customer Date Range"
          onDateChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);

            if (start && end) {
              const s = start.toISOString().split("T")[0];
              const e = end.toISOString().split("T")[0];
              router.push(`?start=${s}&end=${e}`);
            }
          }}
        />

        <p className="text-sm font-semibold">
          Selected Date: {startDate?.toLocaleDateString()} -{" "}
          {endDate?.toLocaleDateString()}
        </p>

        <p className="text-sm font-semibold">
          Reports ({availableYears[0]}), {availableYears.slice(1).join(", ")}
        </p>

        {/* Report Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FiFileText className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Report Summary
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {startDate && endDate
              ? `Showing analytics for ${calculateDays()} day(s) from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}.`
              : "Select a date range to view the report summary."}
          </p>
        </div>
      </div>
    </div>
  );
}
