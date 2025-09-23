"use client";

import React, { useState } from "react";
import AddEmployee from "@/components/AddEmployee";
import Button from "@/components/ui/Button";
import Offcanvas from "@/components/ui/Offcanvas";
import { employeeAnlaytics } from "@/services/serviceApis";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useQuery } from "@tanstack/react-query";
import { IoIosAdd } from "react-icons/io";
import ReportsSection from "./ReportSection";
import {
  FaUsers,
  FaUserTie,
  FaHeadset,
  FaUserCog,
  FaUserGraduate,
  FaUserShield,
} from "react-icons/fa";
import Link from "next/link";
import CountUp from "react-countup";
import Pagination from "@/components/ui/Pagination";
import TypeSearch from "@/components/TypeSearch";
import { useAuth } from "@/hooks/useAuth";

// 🔹 Props for Designation Card
interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBg: string;
  link: string;
}

const DesgCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  iconBg,
  link,
}) => (
  <Link href={link}>
    <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center cursor-pointer hover:shadow-lg transition-shadow">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-2xl font-bold mt-1">
          <CountUp end={Number(value)} duration={1.5} separator="," />
        </h2>
      </div>
      <div className={`p-3 rounded-lg ${iconBg} text-white`}>{icon}</div>
    </div>
  </Link>
);

const Page = () => {
  const [showAddSidebar, setShowAddSidebar] = useState(false);
  const [searchText, setSearchText] = useState("");

    const { user } = useAuth();
  

  const {
    data: employeesanlaytics,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employeesAnalaytics"],
    queryFn: employeeAnlaytics,
  });

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading employees...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">Error: {getErrorMessage(error)}</div>
    );
  } 

  // ✅ Convert API response into lookup { designation: count }
  const counts: Record<string, number> = {};
  employeesanlaytics?.messaage?.forEach(
    (item: { _id: string; count: number }) => {
      counts[item._id] = item.count;
    }
  );

  // ✅ Designation options with dynamic counts
  const designationOptions = [
    {
      label: "Marketing Manager",
      icon: <FaUserTie />,
      value: counts["Marketing Manager"] || 0,
      iconBg: "bg-red-500",
      link: "employee/designation=Marketing Manager",
    },
    {
      label: "Technical Manager",
      icon: <FaUserCog />,
      value: counts["Technical Manager"] || 0,
      iconBg: "bg-green-500",
      link: "employee/designation=Technical Manager",
    },
    {
      label: "Telecall Manager",
      icon: <FaHeadset />,
      value: counts["Telecall Manager"] || 0,
      iconBg: "bg-purple-500",
      link: "employee/designation=Telecall Manager",
    },
    {
      label: "Stock Manager",
      icon: <FaUserShield />,
      value: counts["Stock Manager"] || 0,
      iconBg: "bg-red-500",
      link: "employee/designation=Stock Manager",
    },
    {
      label: "Account Manager",
      icon: <FaUserTie />,
      value: counts["Account Manager"] || 0,
      iconBg: "bg-indigo-500",
      link: "employee/designation=Account Manager",
    },
    {
      label: "Technician",
      icon: <FaUserCog />,
      value: counts["Technician"] || 0,
      iconBg: "bg-orange-500",
      link: "employee/designation=Technician",
    },
    {
      label: "Telecaller",
      icon: <FaHeadset />,
      value: counts["Telecaller"] || 0,
      iconBg: "bg-pink-500",
      link: "employee/designation=Telecaller",
    },
    {
      label: "Stock Clerk",
      icon: <FaUserShield />,
      value: counts["Stock Clerk"] || 0,
      iconBg: "bg-teal-500",
      link: "employee/designation=Stock Clerk",
    },
    {
      label: "Accountant",
      icon: <FaUserTie />,
      value: counts["Accountant"] || 0,
      iconBg: "bg-gray-600",
      link: "employee/designation=Accountant",
    },
    {
      label: "Customer Support",
      icon: <FaHeadset />,
      value: counts["Customer Support"] || 0,
      iconBg: "bg-blue-400",
      link: "employee/designation=Customer Support",
    },
    {
      label: "Intern",
      icon: <FaUserGraduate />,
      value: counts["Intern"] || 0,
      iconBg: "bg-yellow-500",
      link: "employee/designation=Intern",
    },
    {
      label: "HR Executive",
      icon: <FaUserTie />,
      value: counts["HR Executive"] || 0,
      iconBg: "bg-rose-500",
      link: "employee/designation=HR Executive",
    },
    {
      label: "Sales Executive",
      icon: <FaUsers />,
      value: counts["Sales Executive"] || 0,
      iconBg: "bg-green-600",
      link: "employee/designation=Sales Executive",
    },
    {
      label: "Super Admin",
      icon: <FaUserShield />,
      value: counts["Super Admin"] || 0,
      iconBg: "bg-black",
      link: "employee/designation=Super Admin",
    },
    {
      label: "Admin",
      icon: <FaUserShield />,
      value: counts["Admin"] || 0,
      iconBg: "bg-gray-800",
      link: "employee/designation=Admin",
    },
  ];

  return (
    <>
      {/* Header */}
 
       <div className="m-4">
      <div className="flex justify-between items-center shadow-sm bg-white sha p-2 rounded-xl mb-4">
        <div>
          <h1 className="font-medium text-2xl text-black">
            Hello,{user?.customer}
          </h1>
          <p className="text-md">{user?.designation}</p>
        </div>

        <div>
          <div className="flex-1 min-w-[580px]">
            <TypeSearch
              onSearch={setSearchText}
              placeHolderData={
                "🔍 Search customer by contact number, email, name, addhar or pan number"
              }
            />
          </div>
        </div>
        <Button variant="primary" onClick={() => setShowAddSidebar(true)}>
          <IoIosAdd size={22} />
          Add Employee
        </Button>
      </div>
      </div>

      {/* Reports + Designations side by side (desktop) / stacked (mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
        {/* Reports Section */}
        <div className="md:col-span-4">
          <ReportsSection />
        </div>

        {/* Designation Cards */}
        <div className="md:col-span-8">
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {designationOptions.map((stat, index) => (
              <DesgCard
                key={index}
                title={stat.label}
                value={stat.value}
                icon={stat.icon}
                iconBg={stat.iconBg}
                link={stat.link}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Add Employee Sidebar */}
      <Offcanvas
        show={showAddSidebar}
        onClose={() => setShowAddSidebar(false)}
        title="Add Employee"
      >
        <div className="p-4">
          <AddEmployee onClose={() => setShowAddSidebar(false)} />
        </div>
      </Offcanvas>
    </>
  );
};

export default Page;
