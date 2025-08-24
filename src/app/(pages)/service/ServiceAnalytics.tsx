import React from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaTasks,
  FaCheckCircle,
  FaTimesCircle,
  FaTools,
} from "react-icons/fa";

type ServiceAnalyticsProps = {
  totalTicketsThisMonth: number;
  ticketsToday: number;
  ticketsProgress: number;
  ticketsResolved: number;
  ticketsIncomplete: number;
  generalServiceDue: number;
};

const ServiceAnalytics: React.FC<ServiceAnalyticsProps> = ({
  totalTicketsThisMonth,
  ticketsToday,
  ticketsProgress,
  ticketsResolved,
  ticketsIncomplete,
  generalServiceDue,
}) => {
  const cardStyle =
    "flex flex-col items-center justify-center rounded-2xl shadow-lg p-6 w-full";

  const valueStyle = "text-2xl font-bold mt-2";

  const labelStyle = "text-md text-gray-600 mt-1 font-semibold";

  const cards = [
    {
      label: "Total Tickets This Month",
      value: totalTicketsThisMonth,
      icon: <FaCalendarAlt size={28} className="text-blue-500" />,
      bg: "bg-blue-50",
    },
    {
      label: "Tickets Generated Today",
      value: ticketsToday,
      icon: <FaClock size={28} className="text-green-500" />,
      bg: "bg-green-50",
    },
    {
      label: "Tickets In Progress",
      value: ticketsProgress,
      icon: <FaTasks size={28} className="text-yellow-500" />,
      bg: "bg-yellow-50",
    },
    {
      label: "Tickets Resolved",
      value: ticketsResolved,
      icon: <FaCheckCircle size={28} className="text-emerald-500" />,
      bg: "bg-emerald-50",
    },
    {
      label: "Tickets Incomplete",
      value: ticketsIncomplete,
      icon: <FaTimesCircle size={28} className="text-red-500" />,
      bg: "bg-red-50",
    },
    {
      label: "General Service Due",
      value: generalServiceDue,
      icon: <FaTools size={28} className="text-purple-500" />,
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid lg:grid-cols-6 gap-2">

      {cards.map((card, index) => (
        <div key={index} className={`${cardStyle} ${card.bg}`}>
          <div className="flex justify-around items-center p-2">
            <div>
            {card.icon}
            </div>
            <p className={valueStyle}>{card.value}</p>
          </div>
          <p className={labelStyle}>{card.label}</p>
        </div>
      ))}


      
    </div>
  );
};

export default ServiceAnalytics;
