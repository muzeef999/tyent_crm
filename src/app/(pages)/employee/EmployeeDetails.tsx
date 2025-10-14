"use client";

import React, { useState, useMemo } from "react";
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

  const [activeTab, setActiveTab] = useState("ALL");

  // Safely extract employee
  const employee: Employee | null = response?.message || null;
  const isTechnician = employee?.designation?.toLowerCase() === "technician";

  // -------------------
  // ✅ Hooks must be called before any return
  // -------------------

  // Analytics counts
  const analytics = useMemo(() => {
    const counts: Record<string, number> = { PENDING: 0, ONGOING: 0, COMPLETED: 0 };
    (employee?.assignedServices || []).forEach((s) => {
      if (s?.status && s.status in counts) {
        counts[s.status] = (counts[s.status] || 0) + 1;
      }
    });
    return counts;
  }, [employee?.assignedServices]);

  // Filter services by active tab
  const filteredServices = useMemo(() => {
    const services = employee?.assignedServices || [];
    if (activeTab === "ALL") return services;
    return services.filter((s) => s.status === activeTab);
  }, [activeTab, employee?.assignedServices]);

  // -------------------
  // Loading / Error / Null checks
  // -------------------
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

  if (!employee) return <div className="p-6 text-center">No employee data found.</div>;

  // -------------------
  // Component render
  // -------------------
  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* 🧾 EMPLOYEE BASIC INFO */}
      <section className="border rounded-xl shadow-lg bg-white overflow-hidden">
        <div className="bg-primary text-white px-6 py-3 text-lg font-semibold">
          👤 Employee Info
        </div>
        <div className="p-6 grid grid-cols-2 gap-4 text-sm text-gray-700">
          <p><strong>Name:</strong> {employee.name}</p>
          <p><strong>Contact:</strong> {employee.contactNumber}</p>
          <p><strong>Email:</strong> {employee.email || "—"}</p>
          <p><strong>Designation:</strong> {employee.designation || "—"}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                employee.status === "ACTIVE"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {employee.status}
            </span>
          </p>
          <p>
            <strong>Joining Date:</strong>{" "}
            {employee.joiningDate
              ? format(new Date(employee.joiningDate), "dd MMM yyyy")
              : "—"}
          </p>
          <p>
            <strong>Last Working Date:</strong>{" "}
            {employee.lastWorkingDate
              ? format(new Date(employee.lastWorkingDate), "dd MMM yyyy")
              : "—"}
          </p>
          <p><strong>Aadhar No:</strong> {employee.aadharNumber || "—"}</p>
          <p><strong>PAN No:</strong> {employee.panNumber || "—"}</p>
        </div>
        <div className="px-6 pb-6 text-gray-700 text-sm space-y-2">
          <p><strong>Address:</strong> {employee.address || "—"}</p>
          <p>
            <strong>Created At:</strong>{" "}
            {employee.createdAt
              ? format(new Date(employee.createdAt), "dd MMM yyyy")
              : "—"}
          </p>
          <p>
            <strong>Last Updated:</strong>{" "}
            {employee.updatedAt
              ? format(new Date(employee.updatedAt), "dd MMM yyyy")
              : "—"}
          </p>
        </div>
      </section>

      {/* 🛠️ ASSIGNED SERVICES (Technician only) */}
      {isTechnician && (
        <section className="border rounded-xl shadow-lg bg-white overflow-hidden">
          <div className="bg-primary text-white px-6 py-3 text-lg font-semibold">
            🛠️ Assigned Services ({employee.assignedServices?.length || 0})
          </div>

          {/* Analytics Tabs */}
          <div className="flex space-x-4 p-4 border-b">
            {["PENDING", "ONGOING", "COMPLETED"].map((status) => (
              <div
                key={status}
                className="flex-1 text-center cursor-pointer"
                onClick={() => setActiveTab(status)}
              >
                <div
                  className={`text-sm font-semibold ${
                    activeTab === status ? "text-primary" : "text-gray-600"
                  }`}
                >
                  {status}
                </div>
                <div className="text-xl font-bold">{analytics[status] || 0}</div>
              </div>
            ))}
            <div
              className="flex-1 text-center cursor-pointer"
              onClick={() => setActiveTab("ALL")}
            >
              <div
                className={`text-sm font-semibold ${
                  activeTab === "ALL" ? "text-primary" : "text-gray-600"
                }`}
              >
                ALL
              </div>
              <div className="text-xl font-bold">{employee.assignedServices?.length || 0}</div>
            </div>
          </div>

          {/* Table */}
          <div className="p-6 overflow-x-auto">
            {filteredServices.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Visit No
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Contact
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Service Date
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Service Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredServices.map((service: Service) => (
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
