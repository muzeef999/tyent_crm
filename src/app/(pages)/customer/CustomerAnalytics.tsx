"use client";
import CustomDropdown from "@/components/ui/CustomDropdown";
import React, { useState } from "react";
import { FaUsers, FaCity, FaMapMarkerAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import CustomDateDropdown from "@/components/ui/CustomDateDropdown";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { Option } from "@/types/customer";
import Link from "next/link";
import CountUp from "react-countup";
import { useQuery } from "@tanstack/react-query";
import { getCustomerAnalysis, getCustomers } from "@/services/serviceApis";
import Button from "@/components/ui/Button";
import { IoIosAdd } from "react-icons/io";
import Offcanvas from "@/components/ui/Offcanvas";
import AddCustomer from "./AddCustomer";
import { useAuth } from "@/hooks/useAuth";
import TypeSearch from "@/components/TypeSearch";
import useDebounce from "@/hooks/useDebounce";
import CustomerDetails from "./CustomerDetails";

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
  const [selectedStateValue, setSelectedStateValue] =
    useState<number>(totalStates);
    const [showDetailsSidebar, setShowDetailsSidebar] = useState(false);
      const [selectedCustomerId, setSelectedCustomer] = useState<string | null>(
        null
      );

  const [selectedCityLabel, setSelectedCityLabel] = useState<string>("");
  const [selectedCityValue, setSelectedCityValue] =
    useState<number>(totalCities);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [showAddSidebar, setShowAddSidebar] = useState(false);
  const [searchText, setSearchText] = useState("");

  const { user } = useAuth();

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toISOString().split("T")[0]; // "2025-09-17"
  };

  const { data } = useQuery({
    queryKey: ["customers"],
    queryFn: () =>
      getCustomerAnalysis({
        start: formatDate(startDate),
        end: formatDate(endDate),
      }),
    enabled: !!startDate && !!endDate, // only run when both are picked
  });


  const handleRowClick = (customerId: string) => {
    setSelectedCustomer(customerId);
    setShowDetailsSidebar(true);
  };

  const debouncedSearchText = useDebounce(searchText, 100);
  const {
    data: searchCustomer,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useQuery({
    queryKey: ["SearchCustomers", debouncedSearchText],
    queryFn: () => getCustomers({ q: debouncedSearchText }),
    enabled: !!debouncedSearchText,
  });

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

  const cardStyle =
    "flex flex-col justify-between rounded-xl p-4 w-full bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow cursor-pointer";
  const valueStyle =
    "text-3xl font-bold mt-2 flex items-center gap-2 text-gray-900";
  const labelStyle = "text-sm text-gray-500 font-semibold";

  const stateli = "state";
  const cityli = "city";

  return (
    <div>
      <div className="flex justify-between items-center shadow-sm bg-white sha p-2 rounded-xl mb-4">
        <div>
          <h1 className="font-medium text-2xl text-black">
            Hello,{user?.customer}
          </h1>
          <p className="text-md">{user?.designation}</p>
        </div>

        <div>
          <div className="flex-1 relative min-w-[580px]">
            <TypeSearch
              onSearch={setSearchText}
              placeHolderData={
                "🔍 Search customer by contact number, email, invoice, or serial number"
              }
            />

            {searchText && (
              <div className="absolute bg-white w-full  rounded-md border border-gray-200 shadow-lg z-10">
                {isSearchLoading && (
                  <div className="p-2 text-gray-500">Loading...</div>
                )}

                {!isSearchLoading && searchCustomer?.data?.length === 0 && (
                  <div className="p-2 text-gray-500">No results</div>
                )}

                {!isSearchLoading &&
                  searchCustomer?.data?.map((s: any) => (
                    <div
                      key={s._id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleRowClick(s._id!)}>
                      {s.name}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        <Button variant="primary" onClick={() => setShowAddSidebar(true)}>
          <IoIosAdd size={22} />
          Add Customer
        </Button>
      </div>

      {/* Cards Row */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6">
        {/* Total Customers */}
        <div className={cardStyle}>
          <div className="flex justify-between items-center">
            <p className={labelStyle}>Total Customers</p>
            <FaUsers size={28} className="text-blue-500" />
          </div>

          <Link
            href={`/customer/startDate=${
              startDate ? encodeURIComponent(startDate.toISOString()) : ""
            }&endDate=${
              endDate ? encodeURIComponent(endDate.toISOString()) : ""
            }`}
            className={valueStyle}
          >
            {endDate ? data?.summary.totalCustomers : totalCustomers}
          </Link>

          <CustomDateDropdown
            label="Select Customer Date Range"
            onDateChange={(start, end) => {
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
          <Link
            href={`/customer/${encodeURIComponent(
              stateli
            )}=${encodeURIComponent(selectedStateLabel)}`}
            className={valueStyle}
          >
            ₹{" "}
            {endDate ? (
              <CountUp
                end={Number(data?.summary.totalPrice)} // make sure totalRevenue is a number
                duration={2} // 2 seconds animation
                separator="," // add commas: 1000000 → 1,000,000
                prefix="" // optional
                decimals={0} // optional: show decimals
              />
            ) : (
              <CountUp
                end={Number(totalRevenue)} // make sure totalRevenue is a number
                duration={2} // 2 seconds animation
                separator="," // add commas: 1000000 → 1,000,000
                prefix="" // optional
                decimals={0} // optional: show decimals
              />
            )}
          </Link>
          <CustomDateDropdown
            label="Select Revenue Date Range"
            onDateChange={(start, end) => {
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
            href={`/customer/${encodeURIComponent(
              stateli
            )}=${encodeURIComponent(selectedStateLabel)}`}
            className={valueStyle}
          >
            {endDate ? data?.summary.totalStates : selectedStateValue}
          </Link>
          <CustomDropdown
            label="Select State"
            id="state"
            options={mapStatesToOptions}
            selectedValue={selectedStateValue}
            onSelect={(value, label) => {
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
            href={`/customer/${encodeURIComponent(cityli)}=${encodeURIComponent(
              selectedCityLabel
            )}`}
            className={valueStyle}
          >
            {endDate ? data?.summary.totalCities : selectedCityValue}
          </Link>
          <CustomDropdown
            label="Select City"
            id="city"
            options={mapCitiesToOptions}
            selectedValue={selectedCityValue}
            onSelect={(value, label) => {
              setSelectedCityLabel(String(label)); // string name like "Lucknow"
              setSelectedCityValue(Number(value)); // numeric count
            }}
          />
        </div>
      </div>

      <Offcanvas
        show={showAddSidebar}
        onClose={() => setShowAddSidebar(false)}
        title="Add Customer"
      >
        <div className="p-4">
          <AddCustomer onClose={() => setShowAddSidebar(false)} />
        </div>
      </Offcanvas>

      <Offcanvas
        show={showDetailsSidebar}
        onClose={() => setShowDetailsSidebar(false)}
        title="Customer Info"
      >
        {selectedCustomerId && (
          <CustomerDetails customerId={selectedCustomerId} />
        )}
      </Offcanvas>
    </div>
  );
};

export default CustomerAnalytics;
