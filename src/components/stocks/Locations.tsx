import { getLocation } from "@/services/serviceApis";
import { Location } from "@/types/customer";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import TableLoading from "../ui/TableLoading";

const Locations = () => {
  const { data, isLoading, } = useQuery({
    queryKey: ["location"],
    queryFn: getLocation,
  });

  const locationData: Location[] = data?.message || [];

  return (
    <table className="min-w-[1000px] w-full customtable">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>City</th>
          <th>active</th>
          <th>Email</th>
          <th>Number</th>
          <th>Status</th>
          <th>Designation</th>
          <th>Updated At</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={8}>
              <TableLoading />
            </td>
          </tr>
        ) : (
          locationData.map((item) => (
            <tr key={item._id} className="border-t">
              <td className="p-2">{item?.employeeId?.name}</td>
              <td className="p-2">{item?.type}</td>
              <td className="p-2">{item?.city}</td>
              <td className="p-2">{item?.active}</td>
              <td className="p-2">{item?.employeeId?.email}</td>
              <td className="p-2">{item?.employeeId?.contactNumber}</td>
              <td className="p-2">{item?.employeeId?.status}</td>
              <td className="p-2">{item?.employeeId?.designation}</td>

              <td className="p-2">
                {new Date(item?.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default Locations;
