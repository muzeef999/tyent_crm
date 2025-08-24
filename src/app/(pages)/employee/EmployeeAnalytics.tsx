import CustomDateRangeDropdown from "@/components/ui/CustomDateDropdown";
import CustomDropdown from "@/components/ui/CustomDropdown";
import React from "react";
import { FaCalendarAlt, FaClock, FaUsers, FaShieldAlt } from "react-icons/fa";

interface EmployeeAnalyticsProps {
  active: number;
  inactive: number;
  dateToDate: number;
  Desiginations: string;
}

const desiginationOption = [
  { value: "Marketing Manager", label: "Marketing Manager" },
  { value: "Technical Manager", label: "Technical Manager" },
  { value: "Telecall Manager", label: "Telecall Manager" },
  { value: "Stock Manager", label: "Stock Manager" },
  { value: "Account Manager", label: "Account Manager" },
  { value: "Technician", label: "Technician" },
  { value: "Telecaller", label: "Telecaller" },
  { value: "Stock Clerk", label: "Stock Clerk" },
  { value: "Accountant", label: "Accountant" },
  { value: "Customer Support", label: "Customer Support" },
  { value: "Intern", label: "Intern" },
  { value: "HR Executive", label: "HR Executive" },
  { value: "Sales Executive", label: "Sales Executive" },
];

const EmployeeAnalytics: React.FC<EmployeeAnalyticsProps> = ({
  active,
  inactive,
}) => {
  const cardStyle =
    "flex flex-col items-center justify-center rounded-2xl shadow-lg p-6 w-full";

  const valueStyle = "text-2xl font-bold";
  const labelStyle = "text-sm text-gray-600 mt-2 font-semibold";

  const cards = [
    {
      label: "Total Tickets This Month",
      value: active,
      icon: <FaCalendarAlt size={28} className="text-blue-500" />,
      bg: "bg-blue-50",
    },
    {
      label: "Tickets Generated Today",
      value: inactive,
      icon: <FaClock size={28} className="text-green-500" />,
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
      {/* Ticket Cards */}
      {cards.map((card, index) => (
        <div key={index} className={`${cardStyle} ${card.bg}`}>
          <div className="flex flex-col items-center">
            {card.icon}
            <p className={`${valueStyle} mt-2`}>{card.value}</p>
          </div>
          <p className={labelStyle}>{card.label}</p>
        </div>
      ))}

      {/* Customer Date Range */}
      <div className={`${cardStyle} bg-blue-50`}>
        <div className="flex flex-col items-center">
          <FaUsers size={28} className="text-blue-500" />
          <p className="mt-2 text-lg font-semibold">Customer Date Range</p>
        </div>
        <div className="mt-3 w-full">
          <CustomDateRangeDropdown
            label="Select Date Range"
            onDateChange={(start, end) => {
              console.log("Selected Range:", start, end);
              // 🔥 filter customers here
            }}
          />
        </div>
      </div>

      {/* AMC Selection */}
      <div className={`${cardStyle} bg-purple-50`}>
        <div className="flex flex-col items-center">
          <FaShieldAlt size={28} className="text-purple-500" />
          <p className="mt-2 text-lg font-semibold">AMC Plan</p>
        </div>
        <div className="mt-3 w-full">
          <CustomDropdown
            id="amc"
            label="Select AMC"
            options={desiginationOption}
            selectedValue={""} // 🔥 Replace with your state
            onSelect={(value) => {
              console.log("Selected AMC:", value);
              // setSelectedAmc(value) here
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeAnalytics;
