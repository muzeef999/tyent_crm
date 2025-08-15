import React from "react";
import { FaRegCalendarAlt, FaSadTear, FaUsers } from "react-icons/fa";

type CustomerAnalyticsProps = {
  totalCustomers: number;
  newCustomers: number;
  unsatisfiedCustomers: number;
};

const CustomerAnalytics: React.FC<CustomerAnalyticsProps> = ({
  totalCustomers,
  newCustomers,
  unsatisfiedCustomers,
}) => {
  const cardStyle =
    "flex flex-col items-center justify-around bg-background shadow-md rounded-lg p-4 w-full sm:w-1/3";

  const valueStyle = "flex items-center gap-2 text-xl font-semibold";

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className={cardStyle}>
        <div className={valueStyle}>
          <FaUsers size={20} className="text-blue-500" />
          {totalCustomers}
        </div>
        <p className="text-sm text-gray-500 mt-1">Total customers</p>
      </div>

      <div className={cardStyle}>
        <div className={valueStyle}>
          <FaRegCalendarAlt size={20} className="text-green-500" />
          {newCustomers}
        </div>
        <p className="text-sm text-gray-500 mt-1">This month</p>
      </div>

      <div className={cardStyle}>
        <div className={valueStyle}>
          <FaSadTear size={20} className="text-red-500" />
          {unsatisfiedCustomers}
        </div>
        <p className="text-sm text-gray-500 mt-1">Unsatisfied customers</p>
      </div>
    </div>
  );
};

export default CustomerAnalytics;
