"use client";
import useReactQuery from "@/hooks/useReactQueary";
import { getServices } from "@/services/serviceApis";
import { Service } from "@/types/customer";
import { getErrorMessage } from "@/utils/getErrorMessage";
import dayjs from "dayjs";
import React from "react";

const Page = () => {
  const {
    data: service,
    isLoading,
    error,
  } = useReactQuery({
    queryKey: ["services"],
    queryFn: () => getServices(),
  });

  if (isLoading) return <div>Loading...</div>;

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
            {service.data?.map((item: Service) => (
              <tr key={item._id?.toString()}>
                <td>
                  {item.serviceDate
                    ? (() => {
                        const serviceDate = dayjs(item.serviceDate);
                        const today = dayjs();

                        const formattedDate = serviceDate.format("DD/MM/YYYY");

                        const isFuture = serviceDate.isAfter(today);
                        const diffDays = Math.abs(
                          today.diff(serviceDate, "day")
                        );

                        if (diffDays < 30) {
                          return `${formattedDate} • ${
                            isFuture
                              ? `in ${diffDays} day${diffDays === 1 ? "" : "s"}`
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
                 {item.customerId.installedModel}
                </td>

                <td>
                 {item.assignedDate ? "Muzeef" : "Not assigned" }
                </td>
                
                <td>
                  {item.closingDate
                    ?  "1/15/2025"
                    : "Not closed"}
                </td>
                
                <td>{item.serviceType?.join(", ")}</td>
                <td>5/5</td>
                <td>ongoing</td>
                <td>{item.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Page;
