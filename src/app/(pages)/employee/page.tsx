"use client";
import AddEmployee from "@/components/AddEmployee";
import Button from "@/components/ui/Button";
import Offcanvas from "@/components/ui/Offcanvas";
import { createEmployee, getEmployees } from "@/services/serviceApis";
import { Employee } from "@/types/customer";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { IoIosAdd } from "react-icons/io";

const Page = () => {
  const [showAddSidebar, setShowAddSidebar] = useState(false); // fixed

  const {
    data: employees,
    isLoading,
    error,
  } = useQuery({ queryKey: ["employees"], queryFn: getEmployees });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (employee: Employee) => createEmployee(employee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      alert("Employee added successfully!");
    },
    onError: (error) => {
      alert("Error adding employee: " + getErrorMessage(error));
    },
  });

  const handleAddEmployee = () => {
    const newEmployee: Employee = {
      name: "Nelima Shaik",
      role: "Frontend Developer",
      status: "ACTIVE",
      joiningDate: new Date(),
      department: "Engineering",
      contactNumber: "+91 9876543210",
    };
    mutate(newEmployee);
  };

  if (isLoading) return <div>Loading...</div>;

  if (error)
    return <div className="text-red-500">Error: {getErrorMessage(error)}</div>;

  return (
    <>
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
          Add Employee
        </Button>
      </div>

      <div className="p-6 overflow-x-auto">
        <table className="w-full min-w-[1000px] customtable">
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
            {employees?.data?.map((employee: Employee) => (
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

      <Offcanvas
        show={showAddSidebar}
        onClose={() => setShowAddSidebar(false)}
        title="Add Employee" // fixed title
      >
        <div className="p-4">
          <AddEmployee onClose={() => setShowAddSidebar(false)} />
        </div>
      </Offcanvas>
    </>
  );
};

export default Page;
