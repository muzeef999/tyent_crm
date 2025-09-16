"use client";
import { getCustomers } from "@/services/serviceApis";
import { Customer } from "@/types/customer";
import { getErrorMessage } from "@/utils/getErrorMessage";
import React, { use, useState } from "react";
import Offcanvas from "@/components/ui/Offcanvas";
import CustomerDetails from "@/app/(pages)/customer/CustomerDetails";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@/components/ui/Pagination";
import TableLoading from "@/components/ui/TableLoading";

const Page =  ({ params }: { params: Promise<{ id: string }> }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(10);

  const {id} = use(params); 
 const type = id ? decodeURIComponent(id) : undefined; // Only decode if id exists



  const { data, isLoading, error } = useQuery({
    queryKey: ["customers", page, limit, type],
    queryFn: () => getCustomers({ page, limit, type}),
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

  if (error) {
    return (
      <div className="text-red-600 p-4">Error: {getErrorMessage(error)}</div>
    );
  }

  return (
    <>
    <div className="p-6 overflow-x-auto">
      <table className="w-full customtable p-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email ID</th>
            <th>Contact Number</th>
            <th>Alternative Number</th>
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
                <td data-tooltip={customer.alternativeNumber}>
                  {customer.alternativeNumber}
                </td>
                <td data-tooltip={customer?.DOB}>
                  {customer?.DOB
                    ? new Date(customer.DOB).toLocaleDateString("en-GB")
                    : ""}
                </td>

                <td colSpan={2} data-tooltip={customer.address}>
                  {customer.address}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>

      <div className="mb-26">
        <Pagination
          totalCustomers={totalCustomers}
          page={page}
          limit={limit}
          totalPages={totalPages}
          onPageChange={setPage}
          setLimit={setLimit} // ✅ correct prop name
        />
      </div>

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
