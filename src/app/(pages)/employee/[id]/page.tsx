"use client";
import AddEmployee from "@/components/AddEmployee";
import Button from "@/components/ui/Button";
import Offcanvas from "@/components/ui/Offcanvas";
import Pagination from "@/components/ui/Pagination";
import TableLoading from "@/components/ui/TableLoading";
import useDebounce from "@/hooks/useDebounce";
import { getEmployees } from "@/services/serviceApis";
import { Employee } from "@/types/customer";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { use, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import EmployeeDetails from "../EmployeeDetails";

const Page = () => {
  const [showAddSidebar, setShowAddSidebar] = useState(false); // fixed
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);
  const [showDetailsSidebar, setShowDetailsSidebar] = useState(false);
    const [selectedEmployeeId, setSelectedEmployee] = useState<string | null>(
      null
    );
  

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(10);


  const { id } = useParams();

// Safely decode `id`
const designation = Array.isArray(id)
  ? decodeURIComponent(id[0]) // If it's an array, take the first one
  : id
  ? decodeURIComponent(id)    // If it's a string
  : undefined;                // If nothing

const {
  data: employees,
  isLoading,
  error,
} = useQuery({
  queryKey: ["employees", { page, limit, designation}], // better caching
  queryFn: () => getEmployees({ page, limit, designation }),
  enabled: true, // prevents query from running when type is undefined
});


const handleRowClick = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    setShowDetailsSidebar(true);
  };

  const pagination = employees?.pagination;
  const totalPages = pagination?.totalPages || 1;

  const totalCustomers = pagination?.total || 0;
  

  if (error)
    return <div className="text-red-500">Error: {getErrorMessage(error)}</div>;

  return (
    <>

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
                <tr key={employee._id} 
                                 className="transition hover:bg-gray-50 cursor-pointer border-t"

                onClick={() => handleRowClick(employee._id!)}>
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
        show={showDetailsSidebar}
        onClose={() => setShowDetailsSidebar(false)}
        title="Customer Info"
      >
        {selectedEmployeeId && (
          <EmployeeDetails employeeId={selectedEmployeeId} />
        )}
      </Offcanvas>

    </>
  );
};

export default Page;
