"use client";
import CustomDropdown from "@/components/ui/CustomDropdown";
import React, { useState } from "react";
import { FaUsers, FaCity, FaMapMarkerAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import CustomDateDropdown from "@/components/ui/CustomDateDropdown";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { Cityt, Option, Statet } from "@/types/customer";
import Link from "next/link";

type CustomerAnalyticsProps = {
  totalCustomers?: number;
  totalRevenue?: number;
  totalStates?: number;
  totalCities?: number;
  state?: any[];
  city?: any[];
};

const CustomerAnalytics: React.FC<CustomerAnalyticsProps> = ({
  totalCustomers = 0,
  totalRevenue = 0,
  totalStates = 0,
  totalCities = 0,
  state = [],
  city = [],
}) => {
  const [selectedStateLabel, setSelectedStateLabel] = useState<string>("");
  const [selectedStateValue, setSelectedStateValue] = useState<number>(totalStates);

  const [selectedCityLabel, setSelectedCityLabel] = useState<string>("");
  const [selectedCityValue, setSelectedCityValue] = useState<number>(totalCities);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // ✅ Map states and cities to dropdown options with unique keys
  const mapStatesToOptions: Option[] = state.map((s: any, index: number) => ({
    label: s._id,
    value: s.count,
    id: `${s._id}-${index}`, // Add unique identifier
  }));

  const mapCitiesToOptions: Option[] = city.map((c: any, index: number) => ({
    label: c._id,
    value: c.count,
    id: `${c._id}-${index}`, // Add unique identifier
  }));

  const formatIndianPrice = (value: number) => {
    if (!value) return "";
    return new Intl.NumberFormat("en-IN").format(value);
  };

  const cardStyle =
    "flex flex-col justify-between rounded-xl p-4 w-full bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow cursor-pointer";
  const valueStyle =
    "text-3xl font-bold mt-2 flex items-center gap-2 text-gray-900";
  const labelStyle = "text-sm text-gray-500 font-semibold";

  return (
    <div className="space-y-6">
      {/* Cards Row */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6">
        {/* Total Customers */}
        <div className={cardStyle}>
          <div className="flex justify-between items-center">
            <p className={labelStyle}>Total Customers</p>
            <FaUsers size={28} className="text-blue-500" />
          </div>
          <p className={valueStyle}>{totalCustomers}</p>
          <CustomDateDropdown
            label="Select Customer Date Range"
            onDateChange={(start, end) => {
              console.log("Selected Range:", start, end);
              setStartDate(start);
              setEndDate(end);
            }}
          />
        </div>

        {/* Total Revenue */}
        <div className={cardStyle}>
          <div className="flex justify-between items-center">
            <p className={labelStyle}>Total Revenue</p>
            <FaIndianRupeeSign size={28} className="text-green-500" />
          </div>
          <p className={valueStyle}>₹ {formatIndianPrice(totalRevenue)}</p>
          <CustomDateDropdown
            label="Select Revenue Date Range"
            onDateChange={(start, end) => {
              console.log("Selected Range:", start, end);
              setStartDate(start);
              setEndDate(end);
            }}
          />
        </div>

        {/* Total States */}
        <div className={cardStyle}>
          <div className="flex justify-between items-center">
            <p className={labelStyle}>Total States</p>
            <FaMapMarkerAlt size={28} className="text-indigo-500" />
          </div>
          <Link
            href={`/customer/${encodeURIComponent(selectedStateLabel)}`}
            className={valueStyle}
          >
            {selectedStateLabel || selectedStateValue}
          </Link>
          <CustomDropdown
            label="Select State"
            id="state"
            options={mapStatesToOptions}
            selectedValue={selectedStateValue}
            onSelect={(label, value) => {
              setSelectedStateLabel(String(label));
              setSelectedStateValue(Number(value));
            }}
          />
        </div>

        {/* Total Cities */}
        <div className={cardStyle}>
          <div className="flex justify-between items-center">
            <p className={labelStyle}>Total Cities</p>
            <FaCity size={28} className="text-purple-500" />
          </div>
          <Link
            href={`/customer/${encodeURIComponent(selectedCityLabel)}`}
            className={valueStyle}
          >
            {selectedCityLabel || selectedCityValue}
          </Link>
          <CustomDropdown
            label="Select City"
            id="city"
            options={mapCitiesToOptions}
            selectedValue={selectedCityValue}
            onSelect={(label, value) => {
              setSelectedCityLabel(String(label)); // string name like "Lucknow"
              setSelectedCityValue(Number(value)); // numeric count
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerAnalytics;
