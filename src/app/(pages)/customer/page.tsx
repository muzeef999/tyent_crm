"use client";

import useReactQuery from "@/hooks/useReactQueary";
import { getCustomers } from "@/services/serviceApis";
import { Customer } from "@/types/customer";
import { getErrorMessage } from "@/utils/getErrorMessage";
import React, { useState } from "react";
import Offcanvas from "@/components/ui/Offcanvas";
import CustomerDetails from "@/components/CustomerDetails";
import Button from "@/components/ui/Button";
import { IoIosAdd } from "react-icons/io";
import AddCustomer from "@/components/AddCustomer";

const Page = () => {
  const {
    data: customers,
    isLoading,
    error,
  } = useReactQuery({
    queryKey: ["customers"],
    queryFn: () => getCustomers(),
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

  if (error) {
    return (
      <div className="text-red-600 p-4">Error: {getErrorMessage(error)}</div>
    );
  }

  return (
    <>
      {/* 🔹 Top Section */}
      <div className="flex flex-wrap justify-between items-center bg-background px-6 py-4 gap-4">
        <div>
          <p className="text-gray-600">Just ask me — I’ve got your back! 🚀</p>
        </div>

        <div>
          <p className="text-gray-600">
            Great experiences begin with great customers.
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
            {isLoading
              ? Array.from({ length: 15 }).map((_, idx) => (
                  <tr key={idx} className="border-t">
                    <td colSpan={9} className="px-4 py-3">
                      <div className="h-5 w-full rounded-md shimmer"></div>
                    </td>
                  </tr>
                ))
              : customers.data?.map((customer: Customer) => (
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
                    <td>
                      <span
                        className={
                          customer.amcRenewed === "YES"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {customer.amcRenewed}
                      </span>
                    </td>
                    <td>{customer.installedBy}</td>
                    <td>
                      <button className="text-blue-600 hover:underline">
                        View
                      </button>
                    </td>
                    <td>{5}/5</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

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
