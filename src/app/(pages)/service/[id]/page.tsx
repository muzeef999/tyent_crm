"use client";
import AddService from "@/app/(pages)/service/AddService";
import Offcanvas from "@/components/ui/Offcanvas";
import TableLoading from "@/components/ui/TableLoading";
import { getServiceById, getServices } from "@/services/serviceApis";
import { Service } from "@/types/customer";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useParams, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import AssignService from "../AssignService";

const Page = () => {
  const [showAddSidebar, setShowAddSidebar] = useState<boolean>(false);
  const [showupDateSidebar, setShowupDateSidebar] = useState<boolean>(false);
  const [employeeId, setEmployeeId] = useState(" ");

   const { id } = useParams<{ id: string }>();

  // Decode if it's URL encoded
  const query = id ? decodeURIComponent(id) : "";

  console.log("🟢 Decoded Query:", query);

  const { data: service, isLoading, error } = useQuery({
    queryKey: ["services", query],
    queryFn: () => getServices(query),
    enabled: !!query,
  });

  const { data: getEmployeesDataId } = useQuery({
    queryKey: ["Assingdata", employeeId],
    queryFn: () => getServiceById(employeeId),
    enabled: !!employeeId,
  });

  if (error)
    return (
      <div className="text-red-600 p-4">Error: {getErrorMessage(error)}</div>
    );

  return (
    <>
      <div className="p-6 overflow-x-auto">
        <table className="w-full min-w-[1000px]  customtable">
          <thead>
            <tr>
              <th colSpan={2}>Scheduled On</th>
              <th>Assigned Date</th>
              <th>Closing Date</th>
              <th>Service Type</th>
              <th>Status</th>
              <th>Avg Rating /5</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableLoading />
            ) : (
              service.data?.map((item: Service) => (
                <tr
                  key={item._id}
                  className="transition hover:bg-gray-50 cursor-pointer border-t"
                  onClick={() => {
                    setEmployeeId(item._id), setShowupDateSidebar(true);
                  }}
                >
                  <td colSpan={2} className="flex-1">
                    {item.serviceDate
                      ? (() => {
                          const serviceDate = dayjs(item.serviceDate);
                          const today = dayjs();

                          const formattedDate =
                            serviceDate.format("DD/MM/YYYY");

                          const isFuture = serviceDate.isAfter(today);
                          const diffDays = Math.abs(
                            today.diff(serviceDate, "day")
                          );

                          if (diffDays < 30) {
                            return `${formattedDate} • ${
                              isFuture
                                ? `in ${diffDays} day${
                                    diffDays === 1 ? "" : "s"
                                  }`
                                : `${diffDays} day${
                                    diffDays === 1 ? "" : "s"
                                  } ago`
                            }`;
                          } else {
                            const diffMonths = Math.abs(
                              today.diff(serviceDate, "month")
                            );
                            return `${formattedDate} - ${
                              isFuture
                                ? `in ${diffMonths} month${
                                    diffMonths === 1 ? "" : "s"
                                  }`
                                : `${diffMonths} month${
                                    diffMonths === 1 ? "" : "s"
                                  } ago`
                            }`;
                          }
                        })()
                      : "N/A"}
                  </td>

                  <td>
                    {item.assignedDate
                      ? new Date(item.assignedDate).toLocaleDateString() // or .toISOString()
                      : "Not assigned"}
                  </td>

                  <td>
                    {item.closingDate
                      ? new Date(item.closingDate).toLocaleDateString() // or .toISOString()
                      : "Not closed"}
                  </td>

                  <td>{item.serviceType?.join(", ")}</td>
                  <td>{item.status}</td>

                  <td>5/5</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Offcanvas
        show={showAddSidebar}
        onClose={() => setShowAddSidebar(false)}
        title="Add New Service"
      >
        <div className="p-4">
          <AddService onClose={() => setShowAddSidebar(false)} />
        </div>
      </Offcanvas>

      <Offcanvas
        show={showupDateSidebar}
        onClose={() => setShowupDateSidebar(false)}
        title="Update Service"
      >
        <div className="p-4">
          <AssignService
            onClose={() => setShowupDateSidebar(false)}
            id={employeeId}
          />
        </div>
      </Offcanvas>
    </>
  );
};

export default Page;
