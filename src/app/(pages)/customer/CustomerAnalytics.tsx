import CustomDropdown from "@/components/ui/CustomDropdown";
import React, { useState } from "react";
import {
  FaUsers,
  FaUserCheck,
  FaShieldAlt,
  FaExclamationTriangle,
  FaHandshake,
  FaHourglassHalf,
  FaTint,
} from "react-icons/fa";

type CustomerAnalyticsProps = {
  totalCustomers: number;
  activeCustomers: number;
  warranty: {
    "In-Warranty": number;
    "Out-of-Warranty": number;
  };
  amcCustomers: number;
  machineAgeBuckets: {
    "0-1": number;
    "2-3": number;
    "3+": number;
  };
  waterType: {
    RO: number;
    Bore: number;
    Municipal: number;
  };
};

// Options
const warrantyOptions = [
  { label: "In-Warranty", value: "inWarranty" },
  { label: "Out-of-Warranty", value: "outWarranty" },
];

const waterTypeOptions = [
  { label: "RO", value: "RO" },
  { label: "Bore", value: "Bore" },
  { label: "Municipal", value: "Municipal" },
];

const machineAgeOptions = [
  { label: "0-1 Years", value: "0-1" },
  { label: "2-3 Years", value: "2-3" },
  { label: "3+ Years", value: "3+" },
];

const CustomerAnalytics: React.FC<CustomerAnalyticsProps> = ({
  totalCustomers,
  warranty,
  amcCustomers,
  machineAgeBuckets,
  waterType,
}) => {
  const [selectedAge, setSelectedAge] = useState<"0-1" | "2-3" | "3+">("0-1");
  const [selectedWater, setSelectedWater] = useState<
    "RO" | "Bore" | "Municipal"
  >("RO");
  const [selectedWarranty, setSelectedWarranty] = useState<
    "In-Warranty" | "Out-of-Warranty"
  >("In-Warranty");
  const cardStyle =
    "flex flex-col items-center justify-center rounded-2xl shadow-lg p-6 w-full";
  const valueStyle = "text-2xl font-bold mt-2";
  const labelStyle = "text-md text-gray-600 mt-2 font-semibold";

  const cards = [
    {
      label: "Total Customers",
      value: totalCustomers,
      icon: <FaUsers size={28} className="text-blue-500" />,
      bg: "bg-blue-50",
    },
    {
      label: "AMC Customers",
      value: amcCustomers,
      icon: <FaHandshake size={28} className="text-purple-500" />,
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Cards */}
      <div className="grid lg:grid-cols-5 gap-4">
        {cards.map((card, index) => (
          <div key={index} className={`${cardStyle} ${card.bg}`}>
            <div className="flex justify-around items-center p-2">
              <div>{card.icon}</div>
              <p className={valueStyle}>{card.value}</p>
            </div>
            <p className={labelStyle}>{card.label}</p>
          </div>
        ))}

        <div className={`${cardStyle} bg-green-50`}>
          <div className="flex justify-around items-center p-2">
            <FaShieldAlt size={28} className="text-green-500" />
            <p className={valueStyle}>{warranty[selectedWarranty]}</p>
          </div>
          <CustomDropdown
            id="warranty"
            label="Warranty"
            options={warrantyOptions}
            selectedValue={selectedWarranty}
            onSelect={(value) => setSelectedWarranty(value as "In-Warranty" | "Out-of-Warranty")}
          />
        </div>
        {/* Machine Age Card with Dropdown */}
        <div className={`${cardStyle} bg-yellow-50`}>
          <div className="flex justify-around items-center p-2">
            <FaHourglassHalf size={28} className="text-yellow-500" />
            <p className={valueStyle}>{machineAgeBuckets[selectedAge]}</p>
          </div>
          <CustomDropdown
            id="machine-age"
            label="Machine Age"
            options={machineAgeOptions}
            selectedValue={selectedWarranty}
            onSelect={(value) => setSelectedAge(value as "0-1" | "2-3" | "3+")}
          />
        </div>

        {/* Water Type Card with Dropdown */}
        <div className={`${cardStyle} bg-cyan-50`}>
          <div className="flex justify-around items-center p-2">
            <FaTint size={28} className="text-cyan-500" />
            <p className={valueStyle}>{waterType[selectedWater]}</p>
          </div>
          <CustomDropdown
            id="water-type"
            label="Water Type"
            options={waterTypeOptions}
            selectedValue={selectedWater}
            onSelect={(value) =>
              setSelectedWater(value as "RO" | "Bore" | "Municipal")
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerAnalytics;
