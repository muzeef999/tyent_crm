import React, { useEffect, useRef, useState } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { IoIosAdd } from "react-icons/io";
import { getEmployees, getServiceById, updateService } from "@/services/serviceApis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Employee } from "@/types/customer";
import { CiEdit } from "react-icons/ci";
import { toast } from "sonner";

const serviceTypeOptions = [
  { label: "General Service", value: "GENERAL_SERVICE" },
  { label: "Paid Service", value: "PAID_SERVICE" },
  { label: "In Warranty Breakdown", value: "IN_WARRANTY_BREAKDOWN" },
  { label: "Filter Replacement", value: "FILTER_REPLACEMENT" },
  { label: "Installation", value: "INSTALLATION" },
  { label: "Re-Installation", value: "RE_INSTALLATION" },
  { label: "Feasibility", value: "FEASIBILITY" },
  { label: "Spare Part Replacement", value: "SPARE_PART_REPLACEMENT" },
  { label: "Deep Cleaning", value: "DEEP_CLEANING" },
  { label: "SPMS Plus Replacement", value: "SPMS_PLUS_REPLACEMENT" },
  { label: "Jogdial Replacement", value: "JOGDIAL_REPLACEMENT" },
  { label: "Display Replacement", value: "DISPLAY_REPLACEMENT" },
  { label: "PH Level Not Stable", value: "PH_LEVEL_NOT_STABLE" },
  { label: "Unpleasant Water Taste", value: "UNPLEASANT_WATER_TASTE" },
  { label: "Touch Panel Unresponsive", value: "TOUCH_PANEL_UNRESPONSIVE" },
  { label: "RO System Malfunctioning", value: "RO_SYSTEM_MALFUNCTIONING" },
  { label: "Pressure Tank Not Functioning Properly", value: "PRESSURE_TANK_NOT_FUNCTIONING" },
];

type AssignedServiceProp = {
  onClose: () => void;
  id: string;
};

const AssignService: React.FC<AssignedServiceProp> = ({ onClose, id }) => {
  const [employeeId, setEmployeeId] = useState("");
  const [editingField, setEditingField] = useState<string | null>(null);
  const editRef = useRef<HTMLDivElement>(null);

  const { data: employees, isLoading, isError } = useQuery({
    queryKey: ["employees"],
    queryFn: () => getEmployees({ getAll: true }),
  });

  const { data: getEmployeesDataId } = useQuery({
    queryKey: ["Assingdata", id],
    queryFn: () => getServiceById(id),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, updatedFields }: { id: string; updatedFields: Record<string, any> }) =>
      updateService(id, updatedFields),
    onSuccess: () => {
      toast.success("Updated Successfully");
      queryClient.invalidateQueries({ queryKey: ["Assingdata", id] });
      setEditingField(null); // close edit after success
    },
  });

  const employeeOptions = employees?.data
    ?.filter((d: Employee) => d.designation === "Technician")
    .map((emp: Employee) => ({ label: emp.name, value: emp._id }));

  const vistNoRef = useRef<HTMLInputElement>(null);
  const serviceDateRef = useRef<HTMLInputElement>(null);
  const assignedDateRef = useRef<HTMLInputElement>(null);
  const closingDateRef = useRef<HTMLInputElement>(null);
  const serviceTypeRef = useRef<HTMLSelectElement>(null);
  const statusRef = useRef<HTMLInputElement>(null);

  if (isLoading) return <p>Loading employees...</p>;
  if (isError) return <p>Error loading employees</p>;

  const serviceData = getEmployeesDataId?.message;

  const handleUpdate = (field: string, value: any) => {
    mutation.mutate({
      id: serviceData._id,
      updatedFields: { [field]: value },
    });
  };

  return (
    <div className="space-y-6">
      {serviceData && (
        <div className="bg-background">
          <div className="flex flex-col">

            {/* Customer Information */}
            <div className="rounded-lg shadow-md p-6 mb-6 space-y-2">
              <h3 className="font-semibold text-lg text-primary border-b pb-1">Customer Information</h3>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{serviceData?.customerId?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{serviceData?.customerId?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact Number</p>
                  <p className="font-medium">{serviceData?.customerId?.contactNumber}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{serviceData?.customerId?.address}</p>
              </div>
            </div>

            {/* Product Information */}
            <div className="rounded-lg shadow-md p-6 mb-6 space-y-2">
              <h3 className="font-semibold text-lg text-primary border-b pb-1">Product Information</h3>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-600">Installed Model</p>
                  <p className="font-medium">{serviceData?.customerId?.installedModel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-medium">{serviceData?.customerId?.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Warranty Years</p>
                  <p className="font-medium">{serviceData?.customerId?.warrantyYears}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">AMC Renewed</p>
                  <p className="font-medium">{serviceData?.customerId?.amcRenewed}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Remarks</p>
                <p className="font-medium">{serviceData?.customerId?.remarks || "N/A"}</p>
              </div>
            </div>

            {/* Service Information */}
            <div className="rounded-lg shadow-md p-6 mb-6 space-y-2">
              <h3 className="font-semibold text-lg text-primary border-b pb-1">Service Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Visit No */}
                <div>
                  <p className="text-sm text-gray-600">Visit No</p>
                  {editingField === "visitNo" ? (
                    <input
                      type="number"
                      ref={vistNoRef}
                      defaultValue={serviceData.visitNo}
                      className="border px-2 py-1 rounded w-full"
                      onBlur={() => {
                        if (vistNoRef.current) handleUpdate("visitNo", Number(vistNoRef.current.value));
                      }}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{serviceData.visitNo || "N/A"}</p>
                      <CiEdit size={20} className="cursor-pointer" onClick={() => setEditingField("visitNo")} />
                    </div>
                  )}
                </div>

                {/* Service Date */}
                <div>
                  <p className="text-sm text-gray-600">Service Date</p>
                  {editingField === "serviceDate" ? (
                    <input
                      type="date"
                      ref={serviceDateRef}
                      defaultValue={serviceData.serviceDate ? new Date(serviceData.serviceDate).toISOString().split("T")[0] : ""}
                      className="border px-2 py-1 rounded w-full"
                      onBlur={() => {
                        if (serviceDateRef.current) handleUpdate("serviceDate", serviceDateRef.current.value);
                      }}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{serviceData.serviceDate ? new Date(serviceData.serviceDate).toLocaleDateString() : "N/A"}</p>
                      <CiEdit size={20} className="cursor-pointer" onClick={() => setEditingField("serviceDate")} />
                    </div>
                  )}
                </div>

                {/* Assigned Date */}
                <div>
                  <p className="text-sm text-gray-600">Assigned Date</p>
                  {editingField === "assignedDate" ? (
                    <input
                      type="date"
                      ref={assignedDateRef}
                      defaultValue={serviceData.assignedDate ? new Date(serviceData.assignedDate).toISOString().split("T")[0] : ""}
                      className="border px-2 py-1 rounded w-full"
                      onBlur={() => {
                        if (assignedDateRef.current) handleUpdate("assignedDate", assignedDateRef.current.value);
                      }}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{serviceData.assignedDate ? new Date(serviceData.assignedDate).toLocaleDateString() : "N/A"}</p>
                      <CiEdit size={20} className="cursor-pointer" onClick={() => setEditingField("assignedDate")} />
                    </div>
                  )}
                </div>

                {/* Closing Date */}
                <div>
                  <p className="text-sm text-gray-600">Closing Date</p>
                  {editingField === "closingDate" ? (
                    <input
                      type="date"
                      ref={closingDateRef}
                      defaultValue={serviceData.closingDate ? new Date(serviceData.closingDate).toISOString().split("T")[0] : ""}
                      className="border px-2 py-1 rounded w-full"
                      onBlur={() => {
                        if (closingDateRef.current) handleUpdate("closingDate", closingDateRef.current.value);
                      }}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{serviceData.closingDate ? new Date(serviceData.closingDate).toLocaleDateString() : "N/A"}</p>
                      <CiEdit size={20} className="cursor-pointer" onClick={() => setEditingField("closingDate")} />
                    </div>
                  )}
                </div>

                {/* Service Type */}
                <div>
                  <p className="text-sm text-gray-600">Service Type</p>
                  {editingField === "serviceType" ? (
                    <select
                      ref={serviceTypeRef}
                      multiple
                      defaultValue={serviceData.serviceType}
                      className="border px-2 py-1 rounded w-full"
                      onBlur={() => {
                        if (serviceTypeRef.current) {
                          const values = Array.from(serviceTypeRef.current.selectedOptions).map(opt => opt.value);
                          handleUpdate("serviceType", values);
                        }
                      }}
                    >
                      {serviceTypeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex flex-wrap gap-1 items-center">
                      {serviceData.serviceType?.map((type: string) => (
                        <span key={type} className="px-2 py-1 bg-gray-100 rounded">{type}</span>
                      ))}
                      <CiEdit size={20} className="cursor-pointer" onClick={() => setEditingField("serviceType")} />
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Employee Information */}
            <div className="rounded-lg shadow-md p-6 mb-6 space-y-2">
              <div className="w-full flex justify-between items-center border-b">
                <h3 className="font-semibold text-lg text-primary pb-1">Assigned Technician</h3>
                <Button variant="primary"><IoIosAdd /> Another Technician</Button>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{serviceData?.employeeId?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact Number</p>
                  <p className="font-medium">{serviceData?.employeeId?.contactNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Designation</p>
                  <p className="font-medium">{serviceData?.employeeId?.designation}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Notes</p>
                <p className="font-medium">{serviceData?.notes || "N/A"}</p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AssignService;
