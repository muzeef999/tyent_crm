"use client";
import AddService from "@/components/AddService";
import AssignService from "@/components/AssignService";
import TypeSearch from "@/components/TypeSearch";
import Button from "@/components/ui/Button";
import Offcanvas from "@/components/ui/Offcanvas";
import TableLoading from "@/components/ui/TableLoading";
import { getServices } from "@/services/serviceApis";
import { Service } from "@/types/customer";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useState } from "react";
import { IoIosAdd } from "react-icons/io";

const Page = () => {
  const [searchText, setSearchText] = useState("");
  const [showAddSidebar, setShowAddSidebar] = useState<boolean>(false);
  const [showupDateSidebar, setShowupDateSidebar] = useState<boolean>(false);

  const {
    data: service,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["services"],
    queryFn: () => getServices(),
  });

  if (error)
    return (
      <div className="text-red-600 p-4">Error: {getErrorMessage(error)}</div>
    );

  return (
    <>
       <div className="flex  justify-between items-start bg-background px-6 py-4 gap-4">
        <div>
          <TypeSearch onSearch={setSearchText} />
        </div>

        <div>
          <p className="text-gray-600">
            Total services:{" "}
            <span className="font-medium">{322300}</span>,  this month services
            <span className="font-medium">{234}</span>,{" "}
            unsatisfied customers:{" "}

            <span className="font-medium">{3}</span>
            not assigned services
            <span className="font-medium">{3}</span>
              pending services
            <span className="font-medium">{3}</span>
          </p>
        </div>

        <Button variant="primary" onClick={() => setShowAddSidebar(true)}>
          <IoIosAdd size={22} />
          Add Servuce
        </Button>
      </div>

      <div className="p-6 overflow-x-auto">
        <table className="w-full min-w-[1000px]  customtable">
          <thead>
            <tr>
              <th>Scheduled On</th>
              <th>Model</th>
              <th>assignedDate</th>
              <th>closingDate</th>
              <th>serviceType</th>
              <th>Avg-rating /5</th>
              <th>Status</th>
              <th>notes</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableLoading />
            ) : (
              service.data?.map((item: Service) => (
                <tr
                  key={item._id?.toString()}
                    className="transition hover:bg-gray-50 cursor-pointer border-t"
                  onClick={() => setShowupDateSidebar(true)}
                >
                  <td>
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
                  <td>{item.customerId.installedModel}</td>

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
                  <td>5/5</td>
                  <td>ongoing</td>
                  <td>{item.notes}</td>
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
          <AssignService onClose={() => setShowupDateSidebar(false)} />
        </div>
      </Offcanvas>
    </>
  );
};

export default Page;
