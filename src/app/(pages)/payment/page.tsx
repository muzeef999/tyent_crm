"use client"
import { getPayments } from "@/services/serviceApis";
import { Payment } from "@/types/customer";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const page = () => {
  const {
    data: paymentData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["payment"],
    queryFn: () => getPayments(),
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
    </>
  );
};

export default page;
