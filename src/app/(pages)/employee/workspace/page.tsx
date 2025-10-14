"use client";
import TypeSearch from "@/components/TypeSearch";
import { useAuth } from "@/hooks/useAuth";
import { employeAssignTask, updateService } from "@/services/serviceApis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { use, useState } from "react";
import {
  FiUser,
  FiHash,
  FiClipboard,
  FiSettings,
  FiCalendar,
  FiMail,
  FiPhone,
  FiBriefcase,
} from "react-icons/fi";
import { toast } from "sonner";

const STATUS_OPTIONS = ["PENDING", "ONGOING", "COMPLETED", "CANCELLED", "CLOSED"];



const Page = () => {

  const { user} = useAuth();

 
  const id = user?.id;
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["employeAssignTask", id],
    queryFn: () => employeAssignTask(id as string),
    enabled: !!id,
  });


  

  const [searchText, setSearchText] = useState("");

  const [editableServiceId, setEditableServiceId] = useState<string | null>(null);
  const [statusValue, setStatusValue] = useState("");

  const mutation = useMutation({
    mutationFn: ({
      id,
      updatedFields,
    }: {
      id: string;
      updatedFields: Record<string, any>;
    }) => updateService(id, updatedFields),
    onSuccess: () => {
      toast.success("Status Updated Successfully 🎉");
      queryClient.invalidateQueries({ queryKey: ["employeAssignTask", id] });
      setEditableServiceId(null);
    },
    onError: () => {
      toast.error("Failed to update status ❌");
    },
  });

  if (!id) return <div className="text-center text-gray-500 mt-10">No employee ID provided</div>;
  if (isLoading) return <div className="text-center mt-10 animate-pulse">Loading services...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error fetching data</div>;

  const employee = data?.message;

  const handleEditClick = (service: any) => {
    setEditableServiceId(service._id);
    setStatusValue(service.status);
  };

  const handleSaveClick = (service: any) => {
    mutation.mutate({
      id: service._id,
      updatedFields: { status: statusValue },
    });
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Employee Info */}
        
     


     <div className="flex justify-between items-center shadow-sm bg-white sha p-2 rounded-xl mb-4">
        <div>
          <h1 className="font-medium text-2xl text-black">
            Hello,{user?.customer}
          </h1>
          <p className="text-md">{user?.designation}</p>
        </div>

        <div>
          <div className="flex-1 relative min-w-[580px]">
            <TypeSearch
              onSearch={setSearchText}
              placeHolderData={
                "🔍 Search customer by contact number, email, invoice, or serial number"
              }
            />

            
          </div>
        </div>

        <div>
          {
            "manger name"
          }
        </div>

      </div>






        {/* Assigned Services */}
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Assigned Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {employee?.assignedServices?.map((service: any) => (
            <div
              key={service._id}
              className="bg-white shadow-md rounded-xl p-5 border border-gray-100 hover:shadow-2xl transition-all duration-300"
            >
              <div className="mb-2 flex items-center gap-2">
                <FiUser className="text-gray-500" />
                <span className="font-semibold text-gray-700">Customer:</span>{" "}
                {service.customerId.name}
              </div>
              <div className="mb-2 flex items-center gap-2">
                <FiHash className="text-gray-500" />
                <span className="font-semibold text-gray-700">Serial Number:</span>{" "}
                {service.customerId.serialNumber}
              </div>
              <div className="mb-2 flex items-center gap-2">
                <FiClipboard className="text-gray-500" />
                <span className="font-semibold text-gray-700">Visit No:</span>{" "}
                {service.visitNo}
              </div>
              <div className="mb-2 flex items-center gap-2">
                <FiSettings className="text-gray-500" />
                <span className="font-semibold text-gray-700">Service Type:</span>{" "}
                {service.serviceType.join(", ")}
              </div>
              <div className="mb-4 flex items-center gap-2">
                <FiCalendar className="text-gray-500" />
                <span className="font-semibold text-gray-700">Service Date:</span>{" "}
                {new Date(service.serviceDate).toLocaleString()}
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-700">Status:</span>
                {editableServiceId === service._id ? (
                  <>
                    <select
                      value={statusValue}
                      onChange={(e) => setStatusValue(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-400"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleSaveClick(service)}
                      className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-700 transition"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        service.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : service.status === "ONGOING"
                          ? "bg-blue-100 text-blue-700"
                          : service.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : service.status === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {service.status}
                    </span>
                    <button
                      onClick={() => handleEditClick(service)}
                      className="ml-3 text-blue-600 hover:underline text-sm"
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
