"use client";

import React, { useState, Suspense } from "react";
import {
  FiFileText,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiTool,
  FiShield,
} from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { analytics } from "@/services/serviceApis";
import CountUp from "react-countup";
import Button from "@/components/ui/Button";
import { IoIosAdd } from "react-icons/io";
import ServiceType from "./recharts/ServiceType";
import { useSearchParams } from "next/navigation";
import ReportsSection from "./ReportSection";
import Link from "next/link";
import dynamic from "next/dynamic";
import Offcanvas from "@/components/ui/Offcanvas";
import AddService from "./AddService";
import TypeSearch from "@/components/TypeSearch";
import { useAuth } from "@/hooks/useAuth";
const SeviceDashboard = dynamic(
  () => import("@/components/skeleton/SeviceDashboard"),
  { ssr: false }
);

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBg: string;
  link: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
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

const PageContent = () => {
  const [showAddSidebar, setShowAddSidebar] = useState(false);

  const searchParams = useSearchParams();
  const startDate = searchParams.get("start");
  const endDate = searchParams.get("end");

  const [searchText, setSearchText] = useState("");

  const { user } = useAuth();

  const {
    data: serviceAnalyticsd,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["serviceAnalytics", startDate, endDate],
    queryFn: () =>
      analytics({
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      }),
  });

  if (isLoading)
    return (
      <div className="p-4 h-100vh">
        <SeviceDashboard />
      </div>
    );
  if (error) return <p>Error loading analytics</p>;

  const stats = [
    {
      title: "Total Tickets Generated",
      value: serviceAnalyticsd?.totalTickets || 0,
      icon: <FiFileText />,
      iconBg: "bg-blue-500",
      link: `/service/start=${startDate}&end=${endDate}`,
    },

    {
      title: "Tickets Today",
      value: serviceAnalyticsd?.ticketsToday || 0,
      icon: <FiCalendar />,
      iconBg: "bg-green-500",
      link: `/service/type=ticketsToday&start=${startDate}&end=${endDate}`,
    },
    {
      title: "Tickets In Progress",
      value: serviceAnalyticsd?.inProgress || 0,
      icon: <FiClock />,
      iconBg: "bg-yellow-500", 
      link: `/service/status=ONGOING&start=${startDate}&end=${endDate}`,
    },
    {
      title: "Tickets Closed",
      value: serviceAnalyticsd?.closed || 0,
      icon: <FiCheckCircle />,
      iconBg: "bg-purple-500",
      link: `/service/status=COMPLETED&start=${startDate}&end=${endDate}`,
    },
    {
      title: "General Services Due",
      value: serviceAnalyticsd?.generalServicesDue || 0,
      icon: <FiAlertTriangle />,
      iconBg: "bg-red-500",
       link: `/service/type=GENERAL_SERVICE&start=${startDate}&end=${endDate}`,
    },
    {
      title: "Spares Changed",
      value: serviceAnalyticsd?.sparesChanged || 0,
      icon: <FiTool />,
      iconBg: "bg-teal-500",
       link: `/service/type=SPARE_PART_REPLACEMENT&start=${startDate}&end=${endDate}`,
    },
    {
      title: "In-Warranty RO",
      value: serviceAnalyticsd?.inWarranty || 0,
      icon: <FiShield />,
      iconBg: "bg-indigo-500",
      link: `/service/type=IN_WARRANTY_BREAKDOWN&start=${startDate}&end=${endDate}`,
    },
    {
      title: "Out-Warranty RO",
      value: serviceAnalyticsd?.outWarranty || 0,
      icon: <FiShield />,
      iconBg: "bg-orange-500",
      link: `/service/type=Out-Warranty&start=${startDate}&end=${endDate}`,
    },
    {
      title: "Avg-Ticket Resolution Time",
      value: serviceAnalyticsd?.avgResolutionTime || 0,
      icon: <FiClock />,
      iconBg: "bg-gray-500",
      link: `/service/?q=${"avgResolutionTime"}${
        startDate && endDate
          ? `?start=${startDate}&end=${endDate}&type=Total Tickets Generated`
          : ""
      }`,
    },
  ];

  const totalRevenue = serviceAnalyticsd?.totalRevenue || 123450;

  const calculateDays = (start: string | null, end: string | null) => {
    if (!start || !end) return null;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const totalDays = calculateDays(startDate, endDate);

  const currentMonthYear = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
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
                "🔍 Search customer by contact number, email, invoice, or serial number"
              }
            />
          </div>
        </div>

        <Button variant="primary" onClick={() => setShowAddSidebar(true)}>
          <IoIosAdd size={22} />
          Add Service
        </Button>
      </div>
      </div>

      <div className="grid grid-cols-12 gap-4 p-4">
        <div className="col-span-12 md:col-span-4">
          <ReportsSection />
        </div>

        <div className="col-span-12 md:col-span-8">
          <div className="flex justify-between items-center pb-4">
            <div>
              {totalDays ? (
                <p className="text-gray-600 text-xl font-medium">
                  Showing data for{" "}
                  <span className="font-semibold">{totalDays} days</span>
                </p>
              ) : (
                <p className="text-gray-600 text-xl font-medium">
                  {`Showing data for ${currentMonthYear}`}
                </p>
              )}
            </div>
            <p className="text-gray-600 text-xl font-medium">
              ₹{" "}
              <span className="font-semibold">
                <CountUp
                  end={Number(totalRevenue)}
                  duration={2}
                  separator=","
                />
              </span>
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                iconBg={stat.iconBg}
                link={stat.link}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="customer-grid-col m-4">
        <ServiceType ServiceType={serviceAnalyticsd?.serviceType} />
      </div>

      <Offcanvas
        show={showAddSidebar}
        onClose={() => setShowAddSidebar(false)}
        title="Add Service"
      >
        <div className="p-4">
          <AddService onClose={() => setShowAddSidebar(false)} />
        </div>
      </Offcanvas>
    </>
  );
};

const Page = () => (
  <Suspense fallback={<p>Loading page...</p>}>
    <PageContent />
  </Suspense>
);

export default Page;
