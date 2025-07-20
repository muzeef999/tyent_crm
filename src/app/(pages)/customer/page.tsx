"use client";
import useReactQuery from "@/hooks/useReactQueary";
import { getCustomers } from "@/services/serviceApis";
import { Customer } from "@/types/customer";
import { getErrorMessage } from "@/utils/getErrorMessage";
import React from "react";

const Page = () => {
  const {
    data: customers,
    isLoading,
    error,
  } = useReactQuery({
    queryKey: ["users"],
    queryFn: () => getCustomers(),
  });

  if (error) {
    return (
      <div className="text-red-600 p-4"> Error: {getErrorMessage(error)} </div>
    );
  }
  return (
    <>
      <table className="w-full  customtable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Model</th>
            <th>Invoice</th>
            <th>Price</th>
            <th>AMC</th>
            <th>Installed By</th>
            <th>upcoming-Services</th>
            <th>Avg-rating /5</th>
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
            : customers.data?.map((customer: Customer) => (
                <tr key={customer._id} className="transition">
                  <td>{customer.name}</td>
                  <td>{customer.contactNumber}</td>
                  <td>{customer.installedModel}</td>
                  <td>{customer.invoiceNumber}</td>
                  <td>₹{customer.price}</td>
                  <td>
                    <span
                      className={`${
                        customer.amcRenewed === "YES"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
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
                </tr>
              ))}
        </tbody>
      </table>
    </>
  );
};

export default Page;
