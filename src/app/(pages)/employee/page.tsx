"use client";
import AddEmployee from "@/components/AddEmployee";
import TypeSearch from "@/components/TypeSearch";
import Button from "@/components/ui/Button";
import Offcanvas from "@/components/ui/Offcanvas";
import Pagination from "@/components/ui/Pagination";
import TableLoading from "@/components/ui/TableLoading";
import useDebounce from "@/hooks/useDebounce";
import { getEmployees } from "@/services/serviceApis";
import { Employee } from "@/types/customer";
import { getErrorMessage } from "@/utils/getErrorMessage";
import {  useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { IoIosAdd } from "react-icons/io";

const Page = () => {
  const [showAddSidebar, setShowAddSidebar] = useState(false); // fixed
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(10);

  const {
    data: employees,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: () =>
      getEmployees({ page, limit, searchQuery: debouncedSearchText }),
  });

 
  const pagination = employees?.pagination;
  const totalPages = pagination?.totalPages || 1;

  const totalCustomers = pagination?.total || 0;
  const newCustomers = 10;
  const unsatisfiedCustomers = 5;

  if (error)
    return <div className="text-red-500">Error: {getErrorMessage(error)}</div>;

  return (
    <>
      <div className="flex flex-wrap justify-between items-start bg-background px-6 py-4 gap-4">
        <div>
          <TypeSearch onSearch={setSearchText} />
        </div>

        <div>
          <p className="text-gray-600">
            Total customers:{" "}
            <span className="font-medium">{totalCustomers}</span>, new customers
            this month: <span className="font-medium">{newCustomers}</span>,{" "}
            unsatisfied customers:{" "}
            <span className="font-medium">{unsatisfiedCustomers}</span>
          </p>
        </div>

        <Button variant="primary" onClick={() => setShowAddSidebar(true)}>
          <IoIosAdd size={22} />
          Add Customer
        </Button>
      </div>

      <div className="p-6 overflow-x-auto">
        <table className="w-full min-w-[1000px] customtable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Desigination</th>
              <th>Joining Date</th>
              <th>Last Working Date</th>
              <th>phone Contact</th>
              <th>Gmail Contact</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableLoading />
            ) : (
              employees?.data?.map((employee: Employee) => (
                <tr key={employee._id}>
                  <td>{employee.name}</td>
                  <td>{employee.status}</td>
                  <td>{employee?.designation}</td>
                  <td>
                    {employee.joiningDate
                      ? new Date(employee.joiningDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    {employee.lastWorkingDate
                      ? new Date(employee.lastWorkingDate).toLocaleDateString()
                      : "continue"}
                  </td>
                  <td>{employee.contactNumber}</td>
                  <td>{employee.email}</td>
                  <td>{employee.address}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      <div className="mb-26">
        <Pagination
          totalCustomers={totalCustomers}
          page={page}
          limit={limit}
          totalPages={totalPages}
          onPageChange={setPage}
          setLimit={setLimit} // ✅ correct prop name
        />
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
