"use client";

import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEmployee } from "@/services/serviceApis";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { Employee } from "@/types/customer";
import { toast } from "sonner";
import CustomDropdown from "./ui/CustomDropdown";
import { useFieldValidator } from "@/hooks/useFieldValidator";
import { employeeValidation } from "@/validations/Validation";

// Dropdown options
const designationTypeOptions = [
  { label: "Admin", value: "Admin" },
  { label: "Super Admin", value: "Super Admin" },
  { label: "Marketing Manager", value: "Marketing Manager" },
  { label: "Technical Manager", value: "Technical Manager" },
  { label: "Telecall Manager", value: "Telecall Manager" },
  { label: "Stock Manager", value: "Stock Manager" },
  { label: "Account Manager", value: "Account Manager" },
  { label: "Technician", value: "Technician" },
  { label: "Telecaller", value: "Telecaller" },
  { label: "Stock Clerk", value: "Stock Clerk" },
  { label: "Accountant", value: "Accountant" },
  { label: "Customer Support", value: "Customer Support" },
  { label: "Intern", value: "Intern" },
  { label: "HR Executive", value: "HR Executive" },
  { label: "Sales Executive", value: "Sales Executive" },
];

const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "In-Active", value: "INACTIVE" },
  { label: "On-Leave", value: "ON_LEAVE" },
];

const AddEmployeeForm = ({ onClose }: { onClose: () => void }) => {
  const queryClient = useQueryClient();
  const { errors, validateField } = useFieldValidator(employeeValidation);

  const [formData, setFormData] = useState<Employee>({
    name: "",
    email: "",
    contactNumber: "",
    designation: "",
    status: "",
    joiningDate: "",
    aadharNumber: "",
    lastWorkingDate: "",
    panNumber: "",
    address: "",
  });

  // React Query mutation
  const { mutate, isPending } = useMutation({
    mutationFn: (newEmployee: Employee) => createEmployee(newEmployee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee added successfully!");
      onClose();
    },
    onError: (error) => {
      toast.error("Error adding employee: " + getErrorMessage(error));
    },
  });

  // Handles both native input/select and custom dropdown events
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { name: string; value: string }
  ) => {
    let name: string, value: string;

    if ("target" in e) {
      name = e.target.name;
      value = e.target.value;
    } else {
      name = e.name;
      value = e.value;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="h-25">
          <Input
            placeholder="eg:- Muzeef Shaik"
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <p className="text-red-600 -mt-3">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="h-25">
          <Input
            label="Email"
            placeholder="eg:- shaikmuzeef9999@gmail.com"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-600 -mt-3">{errors.email}</p>}
        </div>

        {/* Contact Number */}
        <div className="h-25">
          <Input
            label="Contact Number"
            name="contactNumber"
            type="tel"
            value={formData.contactNumber || ""}
            onChange={handleChange}
            placeholder="Enter 10-digit phone number starting with 6-9"
          />
          {errors.contactNumber && (
            <p className="text-red-600 -mt-3">{errors.contactNumber}</p>
          )}
        </div>

        {/* Aadhaar Number */}
        <div className="h-25">
          <Input
            label="Aadhaar Number"
            name="aadharNumber"
            placeholder="Enter 12-digit Aadhaar number"
            value={formData.aadharNumber}
            onChange={handleChange}
          />
          {errors.aadharNumber && (
            <p className="text-red-600 -mt-3">{errors.aadharNumber}</p>
          )}
        </div>

        {/* PAN Number */}
        <div className="h-25">
          <Input
            label="PAN Number"
            name="panNumber"
            placeholder="Enter PAN (ABCDE1234F)"
            value={formData.panNumber}
            onChange={handleChange}
          />
          {errors.panNumber && (
            <p className="text-red-600 -mt-3">{errors.panNumber}</p>
          )}
        </div>

        {/* Designation Dropdown */}
        <CustomDropdown
          label="Designation"
          id="designation"
          options={designationTypeOptions}
          selectedValue={formData.designation || ""}
          onSelect={(value) =>
            handleChange({ name: "designation", value: String(value) })
          }
        />
        {errors.designation && (
          <p className="text-red-600 -mt-3">{errors.designation}</p>
        )}

        {/* Status Dropdown */}
        <CustomDropdown
          label="Status"
          id="status"
          options={statusOptions}
          selectedValue={formData.status || ""}
          onSelect={(value) =>
            handleChange({ name: "status", value: String(value) })
          }
        />
        {errors.status && (
          <p className="text-red-600 -mt-3">{errors.status}</p>
        )}

        {/* Joining Date */}
        <div className="h-25">
          <Input
            label="Joining Date"
            name="joiningDate"
            type="date"
            value={formData.joiningDate || ""}
            onChange={handleChange}
          />
          {errors.joiningDate && (
            <p className="text-red-600 -mt-3">{errors.joiningDate}</p>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="h-25">
        <Input
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        {errors.address && <p className="text-red-600 -mt-3">{errors.address}</p>}
      </div>

      <Button type="submit" variant="primary" disabled={isPending}>
        {isPending ? "Saving..." : "Add Employee"}
      </Button>
    </form>
  );
};

export default AddEmployeeForm;
