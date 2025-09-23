"use client";
import TypeSearch from "@/components/TypeSearch";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { getPayments } from "@/services/serviceApis";
import { Payment } from "@/types/customer";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import ReportsSection from "./ReportSection";
import { FiCalendar, FiClock, FiFileText } from "react-icons/fi";
import Link from "next/link";
import CountUp from "react-countup";

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
}) => {
  return (
    <Link href={link}>
      <div className="relative bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-xl p-6 flex justify-between items-center cursor-pointer overflow-hidden hover:shadow-2xl transition-shadow duration-300">
        
        {/* Watermark */}
        <span className="absolute text-gray-200 text-[6rem] font-bold -top-5 -right-10 opacity-10 select-none pointer-events-none">
          ₹
        </span>

        {/* Text Section */}
        <div className="relative z-10">
          <p className="text-sm text-gray-600">{title}</p>
          <h2 className="text-3xl font-extrabold mt-1 text-gray-800">
            <CountUp end={Number(value)} duration={1.5} separator="," />.00
          </h2>
        </div>

        {/* Icon Section */}
        <div
          className={`relative z-10 p-4 rounded-full ${iconBg} text-white shadow-lg flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
    </Link>
  );
};


const Page = () => {
  const [searchText, setSearchText] = useState("");

  const { user } = useAuth();

  const {
    data: paymentData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["payment"],
    queryFn: () => getPayments(),
  });

  const stats = [
    {
      title: "Product Amount",
      value: 0,
      icon: <FiFileText />,
      iconBg: "bg-blue-500",
      link: `/service/?q=total-tickets&start=`,
    },
    {
      title: "Service Amount",
      value: 0,
      icon: <FiCalendar />,
      iconBg: "bg-green-500",
      link: `/service/?q=ticketsToday&start=`,
    },
    {
      title: "Spare Parts Amount",
      value: 0,
      icon: <FiClock />,
      iconBg: "bg-yellow-500",
      link: `/service/status=ONGOING&start=`,
    },
    {
      title: "Spare Parts Amount",
      value: 0,
      icon: <FiClock />,
      iconBg: "bg-yellow-500",
      link: `/service/status=ONGOING&start=`,
    },
  ];

  if (error) {
    return (
      <div className="text-red-600 p-4"> Error: {getErrorMessage(error)} </div>
    );
  }

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

          <Button variant="primary">
            <IoIosAdd size={22} />
            Edit payment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 p-4">
        <div className="col-span-12 md:col-span-4">
          <ReportsSection />
        </div>

        <div className="md:col-span-8">
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="p-6 overflow-x-auto">
        <table className="w-full  min-w-[1000px] customtable">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Mode Of Payment</th>
              <th>Received Date</th>
              <th>Pending Amount</th>
              <th>Status</th>
              <th>Remarks</th>
              <th>Invoice Number</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="border-t">
                    <td colSpan={4} className="px-4 py-3">
                      <div className="h-5 w-full rounded-md shimmer"></div>
                    </td>
                  </tr>
                ))
              : paymentData.data?.map((payment: Payment) => (
                  <tr key={payment._id} className="transition">
                    <td>{payment.amount}</td>
                    <td>{payment.modeOfPayment}</td>
                    <td>
                      {payment.receivedDate
                        ? new Date(payment.receivedDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>{payment.pendingAmount}</td>
                    <td>₹{payment.status}</td>

                    <td>{payment.remarks}</td>
                    <td>{payment.invoiceNumber}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Page;
