"use client";

import { getCustomers } from "@/services/serviceApis";
import { Customer } from "@/types/customer";
import { getErrorMessage } from "@/utils/getErrorMessage";
import React, { useEffect, useState } from "react";
import Offcanvas from "@/components/ui/Offcanvas";
import CustomerDetails from "@/components/CustomerDetails";
import Button from "@/components/ui/Button";
import { IoIosAdd } from "react-icons/io";
import AddCustomer from "@/components/AddCustomer";
import TypeSearch from "@/components/TypeSearch";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Pagination from "@/components/ui/Pagination";
import TableLoading from "@/components/ui/TableLoading";

// ✅ Debounce Hook
function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

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
    placeholderData: keepPreviousData,
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

  const totalCustomers = pagination?.total || 0;
  const newCustomers = 10;
  const unsatisfiedCustomers = 5;

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

        <div>
          <p className="text-gray-600">
            Total customers:{" "}
            <span className="font-medium">{totalCustomers}</span>, new customers
            this month: <span className="font-medium">{newCustomers}</span>,{" "}
            unsatisfied customers:{" "}
            <span className="font-medium">{unsatisfiedCustomers}</span>
          </p>
        </div>

        <Button variant="primary" onClick={() => setShowAddSidebar(true)}>
          <IoIosAdd size={22} />
          Add Customer
        </Button>
      </div>

      {/* 🔹 Table Section */}
      <div className="p-6 overflow-x-auto">
        <table className="min-w-[1000px] w-full customtable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Model</th>
              <th>Invoice</th>
              <th>Price</th>
              <th>AMC</th>
              <th>Installed By</th>
              <th>Upcoming Services</th>
              <th>Avg Rating /5</th>
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
                  <td>{customer.name}</td>
                  <td>{customer.contactNumber}</td>
                  <td>{customer.installedModel}</td>
                  <td>{customer.invoiceNumber}</td>
                  <td>₹{customer.price}</td>
                  <td
                    className={
                      customer.amcRenewed === "YES"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {customer.amcRenewed}
                  </td>
                  <td>{customer.installedBy}</td>
                  <td>
                    <button className="text-blue-600 hover:underline">
                      View
                    </button>
                  </td>
                  <td>5/5</td>
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
