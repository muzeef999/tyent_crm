import React, { useState } from "react";
import Input from "./ui/Input";
import Button from "./ui/Button";
import CustomDropdown from "./ui/CustomDropdown"; // import your dropdown
import { getEmployees } from "@/services/serviceApis";
import { useQuery } from "@tanstack/react-query";
import { Employee } from "@/types/customer";

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
};

const AssignService: React.FC<AssignedServiceProp> = ({ onClose }) => {
  const [employeeId, setEmployeeId] = useState("");

  const {
    data: employees,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["employees"],
    queryFn:()=> getEmployees({getAll: true}),
  });

  const employeeOptions = employees?.data
    ?.filter((d: Employee) => d.designation === "Technician")
    .map((emp: Employee) => ({
      label: emp.name, // assuming employee object has 'name' field
      value: emp._id, // MongoDB ObjectId
    }));



  const [formData, setFormData] = useState({
    visitNo: "",
    serviceDate: "",
    nextDueDate: "",
    notes: "",
    paymentIds: "",
    assignedDate: "",
    closingDate: "",
    serviceType: "", // single select now
    employeeId: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      visitNo: formData.visitNo ? Number(formData.visitNo) : undefined,
      paymentIds: formData.paymentIds
        ? formData.paymentIds.split(",").map((id) => id.trim())
        : [],
    };

    console.log("Submitting payload:", payload);
  };

  if (isLoading) return <p>Loading employees...</p>;
  if (isError) return <p>Error loading employees</p>;

  return (
    <form onSubmit={handleSubmit}>
      {/* Other inputs */}

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder=""
          label="Visit No"
          type="number"
          name="visitNo"
          value={formData.visitNo}
          onChange={handleChange}
          required
        />

        <Input
          label="Service Date"
          type="date"
          name="serviceDate"
          value={formData.serviceDate}
          onChange={handleChange}
        />

        <Input
          label="Next Due Date"
          type="date"
          name="nextDueDate"
          value={formData.nextDueDate}
          onChange={handleChange}
        />

        <Input
          label="Assigned Date"
          type="date"
          name="assignedDate"
          value={formData.assignedDate}
          onChange={handleChange}
        />

        <Input
          label="Closing Date"
          type="date"
          name="closingDate"
          value={formData.closingDate}
          onChange={handleChange}
        />

        <CustomDropdown
          label="Service Type"
          id="serviceType"
          options={serviceTypeOptions}
          selectedValue={formData.serviceType}
          onSelect={(value) =>
            setFormData((prev) => ({ ...prev, serviceType: value }))
          }
        />

        <Input
          label="Payment Attach (comma separated IDs)"
          type="text"
          name="paymentIds"
          placeholder="id1,id2,id3"
          value={formData.paymentIds}
          onChange={handleChange}
        />

        <CustomDropdown
          label="Assign Technician"
          options={employeeOptions}
          selectedValue={employeeId}
          onSelect={setEmployeeId} // sets employeeId on selection
          id="employeeId"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block mb-1 font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div className="flex gap-2">
        <Button variant="primary" type="submit">
          Assign / Update Service
        </Button>
      </div>
    </form>
  );
};

export default AssignService;
