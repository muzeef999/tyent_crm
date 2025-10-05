"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { getEmployeeById } from "@/services/serviceApis";

interface Customer {
  _id: string;
  name: string;
  contactNumber: string;
  alternativeNumber?: string;
  address: string;
  serialNumber: string;
}

interface Service {
  _id: string;
  customerId: Customer;
  visitNo: number;
  serviceDate: string | Date;
  status: string;
  serviceType: string[];
  assignedDate?: string | Date;
}

interface Employee {
  _id: string;
  name: string;
  email: string;
  contactNumber: string;
  designation: string;
  status: string;
  joiningDate: string | Date;
  lastWorkingDate?: string | Date | null;
  address: string;
  assignedServices: Service[];
  aadharNumber: string;
  panNumber: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface EmployeeDetailsProps {
  employeeId: string;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employeeId }) => {
  const { data: response, isLoading, error } = useQuery({
    queryKey: ["employeeInDetails", employeeId],
    queryFn: () => getEmployeeById(employeeId),
    enabled: !!employeeId,
  });

  if (isLoading)
    return (
      <div className="p-6 text-center text-gray-500">
        Loading employee info...
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-600">
        Error loading employee data
      </div>
    );

  const employee: Employee = response?.message;

  const isTechnician =
    employee?.designation?.toLowerCase() === "technician";

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* 🧾 EMPLOYEE BASIC INFO */}
      <section className="border rounded-xl shadow-lg bg-white overflow-hidden">
        <div className="bg-primary text-white px-6 py-3 text-lg font-semibold">
          👤 Employee Info
        </div>
        <div className="p-6 grid grid-cols-2 gap-4 text-sm text-gray-700">
          <p><strong>Name:</strong> {employee?.name}</p>
          <p><strong>Contact:</strong> {employee?.contactNumber}</p>
          <p><strong>Email:</strong> {employee?.email || "—"}</p>
          <p><strong>Designation:</strong> {employee?.designation || "—"}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                employee?.status === "ACTIVE"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {employee?.status}
            </span>
          </p>
          <p>
            <strong>Joining Date:</strong>{" "}
            {employee?.joiningDate
              ? format(new Date(employee.joiningDate), "dd MMM yyyy")
              : "—"}
          </p>
          <p>
            <strong>Last Working Date:</strong>{" "}
            {employee?.lastWorkingDate
              ? format(new Date(employee.lastWorkingDate), "dd MMM yyyy")
              : "—"}
          </p>
          <p><strong>Aadhar No:</strong> {employee?.aadharNumber || "—"}</p>
          <p><strong>PAN No:</strong> {employee?.panNumber || "—"}</p>
        </div>
        <div className="px-6 pb-6 text-gray-700 text-sm space-y-2">
          <p><strong>Address:</strong> {employee?.address || "—"}</p>
          <p>
            <strong>Created At:</strong>{" "}
            {employee?.createdAt
              ? format(new Date(employee.createdAt), "dd MMM yyyy")
              : "—"}
          </p>
          <p>
            <strong>Last Updated:</strong>{" "}
            {employee?.updatedAt
              ? format(new Date(employee.updatedAt), "dd MMM yyyy")
              : "—"}
          </p>
        </div>
      </section>

      {/* 🛠️ ASSIGNED SERVICES (Technician only) */}
      {isTechnician && (
        <section className="border rounded-xl shadow-lg bg-white overflow-hidden">
          <div className="bg-primary text-white px-6 py-3 text-lg font-semibold">
            🛠️ Assigned Services ({employee?.assignedServices?.length || 0})
          </div>
          <div className="p-6 overflow-x-auto">
            {employee?.assignedServices?.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Visit No</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Service Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Service Type</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employee.assignedServices.map((service: Service, idx: number) => (
                    <tr key={service._id}>
                      <td className="px-4 py-2 text-gray-700">Visit #{service.visitNo}</td>
                      <td className="px-4 py-2 text-gray-600">{service.customerId?.name || "—"}</td>
                      <td className="px-4 py-2 text-gray-600">{service.customerId?.contactNumber || "—"}</td>
                      <td className="px-4 py-2 text-gray-600">
                        {service.serviceDate
                          ? format(new Date(service.serviceDate), "dd MMM yyyy")
                          : "—"}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            service.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : service.status === "ONGOING"
                              ? "bg-blue-100 text-blue-800"
                              : service.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {service.status || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {Array.isArray(service.serviceType)
                          ? service.serviceType.join(", ")
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-sm">No services assigned.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default EmployeeDetails;
