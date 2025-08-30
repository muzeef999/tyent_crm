import { useState } from "react";
import { BarChart } from "recharts";
import { FaDownload } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import CustomDropdown from "@/components/ui/CustomDropdown";
import CustomDateRangeDropdown from "@/components/ui/CustomDateDropdown";

const reportTypes = [
  { value: "daily", label: "Daily", color: "bg-blue-500 hover:bg-blue-600" },
  { value: "weekly", label: "Weekly", color: "bg-green-500 hover:bg-green-600" },
  { value: "monthly", label: "Monthly", color: "bg-purple-500 hover:bg-purple-600" },
  { value: "yearly", label: "Yearly", color: "bg-indigo-500 hover:bg-indigo-600" },
];

export function ReportsSection() {
  const [selectedReport, setSelectedReport] = useState("monthly");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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
          }}
        />

        {/* Report Type Selector Buttons */}
        <div className="flex items-center gap-2">
          {reportTypes.map((type) => {
            const isSelected = selectedReport === type.value;
            return (
              <div
                key={type.value}
                className={`rounded-lg px-4 py-2 font-medium cursor-pointer transition-colors duration-200 ${
                  isSelected
                    ? `${type.color} text-white`
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setSelectedReport(type.value)}
              >
                {type.label}
              </div>
            );
          })}
        </div>

        {/* Report Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FiFileText className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {reportTypes.find((r) => r.value === selectedReport)?.label} Report Summary
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Generate comprehensive {selectedReport} analytics including ticket
            trends, response times, customer satisfaction metrics, and revenue
            insights.
          </p>
        </div>
      </div>
    </div>
  );
}
