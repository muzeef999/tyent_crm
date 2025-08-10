"use client";
import TableLoading from "@/components/ui/TableLoading";
import { getLeads } from "@/services/serviceApis";
import { Leads } from "@/types/customer";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Page = () => {
  const {
    data: leads,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["Lead"],
    queryFn: () => getLeads(),
  });

  console.log("leads", leads);

  if (error) {
    return (
      <div className="text-red-600 p-4">Error: {getErrorMessage(error)}</div>
    );
  }

  return (
    <>
      <div className="p-6 overflow-x-auto">
        <table className="w-full customtable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Number</th>
              <th>location</th>
              <th>status</th>
              <th>assignedTo</th>
              <th>Lead Data</th>
              <th>message</th>
              
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableLoading />
            ) : (
              leads?.map((lead: Leads) => (
                <tr
                  key={lead.id}
                  className="transition hover:bg-gray-50 cursor-pointer border-t"
                  // onClick={() => handleRowClick(customer._id!)}
                >
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.number}</td>
                  <td>{lead.location}</td>
                  <td>{lead.status}</td>
                  <td>{lead.assignedTo}</td>
                  <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td>{lead.message}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Page;
