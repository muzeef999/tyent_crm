"use client";
import React, { useState } from "react";
import TypeSearch from "./TypeSearch";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SearchWithCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    console.log({
      query: searchValue,
      date: selectedDate,
    });
    // Here you'd trigger your API call with both values
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 w-full max-w-2xl">
      {/* Search Input */}
      <TypeSearch
        texts={["Just ask me — I’ve got your back! 🚀", "Search for services", "Find customers fast"]}
        className="flex-1"
        inputName="search"
      />

      {/* Date Picker */}
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        placeholderText="Filter by date"
        className="border rounded-md px-3 py-2 text-sm"
      />

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
}
