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

// Enum options from your schema

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="eg:- Muzeef Shaik"
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <Input
          label="Email"
          placeholder="eg:- shaikmuzeef9999@gmail.com"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />

        <Input
          label="Contact Number"
          name="contactNumber"
          type="tel" // Use type="tel" for phone numbers
          value={formData.contactNumber || ""}
          onChange={handleChange}
          placeholder="Enter 10-digit phone number starting with 6-9"
        />

        <Input
          label="Aadhaar Number"
          name="aadharNumber"
          placeholder="Enter 12-digit Aadhaar number"
          value={formData.aadharNumber}
          onChange={handleChange}
        />

        {/* PAN Number */}
        <Input
          label="PAN Number"
          name="panNumber"
          placeholder="Enter PAN (ABCDE1234F)"
          value={formData.panNumber}
          onChange={handleChange}
        />

        <CustomDropdown
          label="Desigination"
          id="designation"
          options={designationTypeOptions}
          selectedValue={formData.designation || ""}
          onSelect={(value) =>
            setFormData((prev) => ({ ...prev, designation: value }))
          }
        />

        <CustomDropdown
          label="Status"
          id="status"
          options={statusOptions}
          selectedValue={formData.status || ""}
          onSelect={(value) =>
            setFormData((prev) => ({ ...prev, status: value }))
          }
        />

        <Input
          label="Joining Date"
          name="joiningDate"
          type="date"
          value={formData.joiningDate || ""}
          onChange={handleChange}
        />
      </div>

      

      <Input
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
      />

      <Button type="submit" variant="primary" disabled={isPending}>
        {isPending ? "Saving..." : "Add Employee"}
      </Button>
    </form>
  );
};

export default AddEmployeeForm;
