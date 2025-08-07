"use client";
import useReactQuery from "@/hooks/useReactQueary";
import { createEmployee, getEmployees } from "@/services/serviceApis";
import { Employee } from "@/types/customer";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

const Page = () => {
  const {
    data: employees,
    isLoading,
    error,
  } = useReactQuery({ queryKey: ["employees"], queryFn: () => getEmployees() });

  const queryClient = useQueryClient();


  const { mutate, isPending} = useMutation({
    mutationFn: (employee: Employee) => createEmployee(employee),
     onSuccess : () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      alert("Employee added successfully!");
     },
     onError: (error) => {
      alert("Error adding employee: " + getErrorMessage(error));
    },
  })

  const handleAddEmployee  = () => {
     const newEmployee: Employee = {
      name: "nelima Shaik",
      role: "Frontend Developer",
      status: "ACTIVE",
      joiningDate: new Date(),
      department: "Engineering",
      contactNumber: "+91 9876543210",
    };
        mutate(newEmployee);

  }

  if (isLoading) return <div>Loading...</div>;

  if (error)
    return <div className="text-red-500">Error: {getErrorMessage(error)}</div>;

  return (
    <>
      <button onClick={handleAddEmployee} disabled={isPending}>
        {" "}
        {isPending ? "Adding..." : "Add Employee"}
      </button>

     <div className='p-6 overflow-x-auto'>
      <table className="w-full min-w-[1000px]  customtable">
        <thead>
          <tr>
          <th>Name</th>
          <th>Role</th>
          <th>Status</th>
          <th>Joining Date</th>
          <th>Department</th>
          <th>Contact</th>
          </tr>
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
      </div>
    </>
  );
};

export default Page;
