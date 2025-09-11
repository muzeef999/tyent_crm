"use client";
import AddEmployee from "@/components/AddEmployee";
import TypeSearch from "@/components/TypeSearch";
import Button from "@/components/ui/Button";
import Offcanvas from "@/components/ui/Offcanvas";
import Pagination from "@/components/ui/Pagination";
import TableLoading from "@/components/ui/TableLoading";
import useDebounce from "@/hooks/useDebounce";
import { getEmployees } from "@/services/serviceApis";
import { Employee } from "@/types/customer";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import EmployeeAnalytics from "./EmployeeAnalytics";
import ReportsSection from "./ReportSection";
import { FaShieldAlt, FaUsers } from "react-icons/fa";
import CustomDateRangeDropdown from "@/components/ui/CustomDateDropdown";
import CustomDropdown from "@/components/ui/CustomDropdown";

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


const Page = () => {
  const [showAddSidebar, setShowAddSidebar] = useState(false); // fixed
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(10);

  const {
    data: employees,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: () =>
      getEmployees({ page, limit, searchQuery: debouncedSearchText }),
  });

  const pagination = employees?.pagination;
  const totalPages = pagination?.totalPages || 1;

  const totalCustomers = pagination?.total || 0;
  const newCustomers = 10;
  const unsatisfiedCustomers = 5;

  const dateToDate = 7;
  const Desiginations = "Software Engineer";

  if (error)
    return <div className="text-red-500">Error: {getErrorMessage(error)}</div>;

    const cardStyle =
    "flex flex-col items-center justify-center rounded-2xl shadow-lg p-6 w-full";

  const valueStyle = "text-2xl font-bold";
  const labelStyle = "text-sm text-gray-600 mt-2 font-semibold";

  return (
    <>
      <div className="flex flex-wrap justify-between items-start px-6 py-4 gap-4">
        <div>
          <h1 className="font-bold text-2xl text-black">
            Employee Analytics Dashboard
          </h1>
          <p className="text-md">Water Ionizer Management System Overview</p>
        </div>

        <Button variant="primary" onClick={() => setShowAddSidebar(true)}>
          <IoIosAdd size={22} />
          Add Customer
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-4 p-4">
        <div className="col-span-4 md:col-span-4">
          <ReportsSection />
        </div>
        <div className="col-span-8 md:col-span-8">

          <div>
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
        </div>
      </div>

      <Offcanvas
        show={showAddSidebar}
        onClose={() => setShowAddSidebar(false)}
        title="Add Employee" // fixed title
      >
        <div className="p-4">
          <AddEmployee onClose={() => setShowAddSidebar(false)} />
        </div>
      </Offcanvas>
    </>
  );
};

export default Page;
