"use client";
import useReactQuery from "@/hooks/useReactQueary";
import { getEmployees } from "@/services/serviceApis";
import { Employee } from "@/types/customer";
import { getErrorMessage } from "@/utils/getErrorMessage";
import React from "react";

const page = () => {
  const {
    data: employees,
    isLoading,
    error,
  } = useReactQuery({ queryKey: ["employees"], queryFn: () => getEmployees() });

  console.log("employees", employees);

  if (isLoading) return <div>Loading...</div>;

  if (error)
    return <div className="text-red-500">Error: {getErrorMessage(error)}</div>;

  return (
    <>
      <table className="w-full  customtable">
        <thead>
          <th>Name</th>
          <th>Role</th>
          <th>Status</th>
          <th>Joining Date</th>
          <th>Department</th>
          <th>Contact</th>
        </thead>
        <tbody>
          {employees.data?.map((employee: Employee) => (
            <tr key={employee._id}>
              <td>{employee.name}</td>
              <td>{employee.role}</td>
              <td>{employee.status}</td>
              <td>
                {employee.joiningDate
                  ? new Date(employee.joiningDate).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>{employee.department}</td>
              <td>{employee.contactNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default page;
