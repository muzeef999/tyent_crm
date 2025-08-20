"use client";
import { getCustomers } from "@/services/serviceApis";
import { Customer } from "@/types/customer";
import { getErrorMessage } from "@/utils/getErrorMessage";
import React, { useState } from "react";
import Offcanvas from "@/components/ui/Offcanvas";
import CustomerDetails from "@/app/(pages)/customer/CustomerDetails";
import Button from "@/components/ui/Button";
import { IoIosAdd } from "react-icons/io";
import TypeSearch from "@/components/TypeSearch";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@/components/ui/Pagination";
import TableLoading from "@/components/ui/TableLoading";
import { formatIndianRupees } from "@/utils/formatIndianRupees";
import useDebounce from "@/hooks/useDebounce";
import CustomerAnalytics from "@/app/(pages)/customer/CustomerAnalytics";
import AddCustomer from "@/app/(pages)/customer/AddCustomer";

const Page = () => {
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: ["customers", page, limit, debouncedSearchText],
    queryFn: () =>
      getCustomers({
        page,
        limit,
        searchQuery: debouncedSearchText, // ✅ fixed param name
      }),
  });

  const [showAddSidebar, setShowAddSidebar] = useState(false);
  const [showDetailsSidebar, setShowDetailsSidebar] = useState(false);
  const [selectedCustomerId, setSelectedCustomer] = useState<string | null>(
    null
  );

  const handleRowClick = (customerId: string) => {
    setSelectedCustomer(customerId);
    setShowDetailsSidebar(true);
  };

  // ✅ Correct extraction
  const customers: Customer[] = data?.data || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages || 1;

  const customerStats = {
    totalCustomers: pagination?.total || 0,
    newCustomers: 10,
    unsatisfiedCustomers: 5,
  };
  if (error) {
    return (
      <div className="text-red-600 p-4">Error: {getErrorMessage(error)}</div>
    );
  }

  return (
    <>
      {/* 🔹 Top Section */}
      <div className="flex flex-wrap justify-between items-start bg-background px-6 py-4 gap-4">
        <div>
          <TypeSearch onSearch={setSearchText} />
        </div>

        <Button variant="primary" onClick={() => setShowAddSidebar(true)}>
          <IoIosAdd size={22} />
          Add Customer
        </Button>
      </div>

      {/* 🔹 Table Section */}
      <div className="p-6 overflow-x-auto">
        <CustomerAnalytics {...customerStats} />
        <br />

        <table className="min-w-[1000px] w-full customtable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email ID</th>
              <th>Contact Number</th>
              <th>Date of Birth (DOB)</th>
              <th colSpan={2}>Address</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableLoading />
            ) : (
              customers.map((customer) => (
                <tr
                  key={customer._id}
                  className="transition hover:bg-gray-50 cursor-pointer border-t"
                  onClick={() => handleRowClick(customer._id!)}
                >
                  <td data-tooltip={customer.name}>{customer.name}</td>
                  <td data-tooltip={customer.email}>{customer.email}</td>
                  <td data-tooltip={customer.contactNumber}>
                    {customer.contactNumber}{" "}
                  </td>
                  <td data-tooltip={customer.DOB}>{customer?.DOB}</td>
                  <td colSpan={2} data-tooltip={customer.address}>
                    {customer.address}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* 🔹 Offcanvas for Add Customer */}
      <Offcanvas
        show={showAddSidebar}
        onClose={() => setShowAddSidebar(false)}
        title="Add Customer"
      >
        <div className="p-4">
          <AddCustomer onClose={() => setShowAddSidebar(false)} />
        </div>
      </Offcanvas>

      {/* 🔹 Offcanvas for Customer Details */}
      <Offcanvas
        show={showDetailsSidebar}
        onClose={() => setShowDetailsSidebar(false)}
        title="Customer Info"
      >
        {selectedCustomerId && (
          <CustomerDetails customerId={selectedCustomerId} />
        )}
      </Offcanvas>
    </>
  );
};

export default Page;
