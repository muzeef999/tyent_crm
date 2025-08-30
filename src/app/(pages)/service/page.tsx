"use client"
import React, { useState } from "react";
import { FiFileText, FiCalendar, FiClock, FiCheckCircle, FiAlertTriangle, FiTool, FiShield } from "react-icons/fi";
import { ReportsSection } from "./ReportSection";
import { useQuery } from "@tanstack/react-query";
import { analytics } from "@/services/serviceApis";
import CountUp from "react-countup"; // Optional for count-up animation
import Button from "@/components/ui/Button";
import { IoIosAdd } from "react-icons/io";
import ServiceType from "./recharts/ServiceType";

// Define the type for props
interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBg: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, iconBg }) => (
  <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold mt-1">
        <CountUp
          end={Number(value)}
          duration={1.5}
          separator=","
        />
      </h2>
    </div>
    <div className={`p-3 rounded-lg ${iconBg} text-white`}>
      {icon}
    </div>
  </div>
);

const Page = () => {
    const [showAddSidebar, setShowAddSidebar] = useState(false);
  
  const { data: serviceAnalyticsd, isLoading, error } = useQuery({
    queryKey: ["serviceAnalytics"],
    queryFn: analytics,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading analytics</p>;

  // Define stats AFTER data is loaded
  const stats = [
    { title: "Total Tickets Generated", value: serviceAnalyticsd?.totalTickets || 0, icon: <FiFileText />, iconBg: "bg-blue-500" },
    { title: "Tickets Today", value: serviceAnalyticsd?.ticketsToday || 0, icon: <FiCalendar />, iconBg: "bg-green-500" },
    { title: "Tickets In Progress", value: serviceAnalyticsd?.inProgress || 0, icon: <FiClock />, iconBg: "bg-yellow-500" },
    { title: "Tickets Closed", value: serviceAnalyticsd?.closed || 0, icon: <FiCheckCircle />, iconBg: "bg-purple-500" },
    { title: "General Services Due", value: serviceAnalyticsd?.generalServicesDue || 0, icon: <FiAlertTriangle />, iconBg: "bg-red-500" },
    { title: "Spares Changed", value: serviceAnalyticsd?.sparesChanged || 0, icon: <FiTool />, iconBg: "bg-teal-500" },
    { title: "In-Warranty RO", value: serviceAnalyticsd?.inWarranty || 0, icon: <FiShield />, iconBg: "bg-indigo-500" },
  ];

  return (
    <>
    <div className="flex justify-between items-center  pt-4 pl-4 pr-4">
        <div>
          <h1 className="font-bold text-2xl text-black">
            Service Analytics Dashboard
          </h1>
          <p className="text-md">Water Ionizer Management System Overview</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddSidebar(true)}>
          <IoIosAdd size={22} />
          Add Service
        </Button>
      </div>
    
    <div className="grid grid-cols-12 gap-4 p-4">
      {/* Left Reports Section */}
      <div className="col-span-12 md:col-span-4">
        <ReportsSection />
      </div>

      {/* Right Stats Section */}
      <div className="col-span-12 md:col-span-8">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              iconBg={stat.iconBg}
            />
          ))}
        </div>
      </div>
    </div>

    <div>
      <ServiceType ServiceType={serviceAnalyticsd?.serviceType} />
    </div>

    
      <br />
      <br />
      
      <br />
      <br />
      
      <br />
      <br />
    </>
  );
};

export default Page;
