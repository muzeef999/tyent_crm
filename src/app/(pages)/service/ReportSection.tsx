"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import { FaDownload } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

export default function ReportsSection() {
  const router = useRouter();

  const [reportType, setReportType] = useState("weekly");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // 🔹 Calculate correct start and end dates
  const calculateRange = () => {
    if (!selectedDate && reportType !== "custom") return { start: null, end: null };

    let start: Date | null = null;
    let end: Date | null = null;

    if (reportType === "weekly" && selectedDate) {
      const day = selectedDate.getDay(); // 0 = Sunday, 1 = Monday
      const diffToMonday = day === 0 ? -6 : 1 - day;
      start = new Date(selectedDate);
      start.setDate(selectedDate.getDate() + diffToMonday);

      end = new Date(start);
      end.setDate(start.getDate() + 6);
    }

    if (reportType === "monthly" && selectedDate) {
      start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      end = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    }

    if (reportType === "yearly" && selectedDate) {
      start = new Date(selectedDate.getFullYear(), 0, 1);
      end = new Date(selectedDate.getFullYear(), 11, 31);
    }

    if (reportType === "custom" && startDate && endDate) {
      start = startDate;
      end = endDate;
    }

    return { start, end };
  };


    useEffect(() => {
    const { start, end } = calculateRange();
    if (start && end) {
      setStartDate(start);
      setEndDate(end);

      // push defaults to URL too
      const s = start.toISOString().split("T")[0];
      const e = end.toISOString().split("T")[0];
      router.push(`?type=${reportType}&start=${s}&end=${e}`);
    }
  }, [reportType, selectedDate]);


  // 🔹 Router push after selecting
  const pushToRouter = () => {
    const { start, end } = calculateRange();
    if (start && end) {
      const s = start.toISOString().split("T")[0];
      const e = end.toISOString().split("T")[0];
      router.push(`?type=${reportType}&start=${s}&end=${e}`);
    }
  };

  // 🔹 Summary text
  const getSummary = () => {
    const { start, end } = calculateRange();
    if (start && end) {
      return `Showing ${reportType} report from ${start.toLocaleDateString()} to ${end.toLocaleDateString()}.`;
    }
    return "Please select a report type and date range.";
  };

  return (
    <div className="p-6 rounded-2xl shadow-lg bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <FiFileText className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Reports</h3>
        </div>
        <button
          onClick={pushToRouter}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1 hover:bg-gray-50 cursor-pointer"
        >
          <FaDownload className="h-4 w-4" />
          Export
        </button>
      </div>

      {/* Report Type Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Report Type</label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full"
        >
          <option value="weekly">Weekly Report</option>
          <option value="monthly">Monthly Report</option>
          <option value="yearly">Yearly Report</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>

      {/* Dynamic Pickers */}
      <div className="space-y-3 mb-6">
        {reportType === "weekly" && (
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              pushToRouter();
            }}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select a week"
            className="border px-3 py-2 rounded-lg w-full"
          />
        )}

        {reportType === "monthly" && (
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              pushToRouter();
            }}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            placeholderText="Select month & year"
            className="border px-3 py-2 rounded-lg w-full"
          />
        )}

        {reportType === "yearly" && (
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              pushToRouter();
            }}
            dateFormat="yyyy"
            showYearPicker
            placeholderText="Select year"
            className="border px-3 py-2 rounded-lg w-full"
          />
        )}

        {reportType === "custom" && (
          <div className="flex gap-2">
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
                pushToRouter();
              }}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate ?? undefined} // ✅ Fix type error
              placeholderText="End date"
              className="border px-3 py-2 rounded-lg w-full"
            />
          </div>
        )}
      </div>

      {/* Report Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <FiFileText className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Report Summary</span>
        </div>
        <p className="text-sm text-gray-600">{getSummary()}</p>
      </div>
    </div>
  );
}
