"use client";
import { employeAssignTask } from "@/services/serviceApis";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

const Page = () => {
  const id = "68a1751e34285f7b0874cffd";
 
  const { data, isLoading, error } = useQuery({
  queryKey: ["employeAssignTask", id],
  queryFn: () => employeAssignTask(id),
  enabled: !!id,
});

  const [editableServiceId, setEditableServiceId] = useState(null);
  const [statusValue, setStatusValue] = useState("");

  if (!id) return <div className="text-center text-gray-500 mt-10">No employee ID provided</div>;
  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error fetching data</div>;

  const employee = data?.message;

  const handleEditClick = (service:any) => {
    setEditableServiceId(service._id);
    setStatusValue(service.status);
  };

  const handleSaveClick = (service:any) => {
    // Here you can call your API to update the status
    console.log("Saving status", service._id, statusValue);
    setEditableServiceId(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Employee Info */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-6">
          <h1 className="text-2xl font-semibold mb-2">{employee?.name}</h1>
          <p className="text-gray-600 mb-1">Email: {employee?.email}</p>
          <p className="text-gray-600 mb-1">Contact: {employee?.contactNumber}</p>
          <p className="text-gray-600">Designation: {employee?.designation}</p>
        </div>

        {/* Assigned Services */}
        <h2 className="text-xl font-semibold mb-4">Assigned Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {employee?.assignedServices?.map((service :any) => (
            <div key={service._id} className="bg-white shadow-lg rounded-xl p-5 hover:shadow-2xl transition-shadow duration-300">
              <div className="mb-2">
                <span className="font-semibold text-gray-700">Customer:</span> {service.customerId.name}
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-700">Serial Number:</span> {service.customerId.serialNumber}
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-700">Visit No:</span> {service.visitNo}
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-700">Service Type:</span> {service.serviceType.join(", ")}
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-700">Service Date:</span>{" "}
                {new Date(service.serviceDate).toLocaleString()}
              </div>

              {/* Editable Status */}
              <div className="mb-2 flex items-center gap-2">
                <span className="font-semibold text-gray-700">Status:</span>
                {editableServiceId === service._id ? (
                  <>
                    <select
                      value={statusValue}
                      onChange={(e) => setStatusValue(e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                    </select>
                    <button
                      onClick={() => handleSaveClick(service)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <span className={`px-2 py-1 rounded ${
                      service.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : service.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {service.status}
                    </span>
                    <button
                      onClick={() => handleEditClick(service)}
                      className="text-blue-600 hover:underline ml-2"
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
