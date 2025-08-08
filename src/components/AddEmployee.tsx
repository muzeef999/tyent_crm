"use client";

import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEmployee } from "@/services/serviceApis";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { Employee } from "@/types/customer";
import { toast } from "sonner";

// Enum options from your schema
const roleOptions = [
  "Admin",
  "Manager",
  "Customer Service",
  "Leads Manager",
  "Accounts",
  "Employee",
  "Technician",
  "HR",
];

const statusOptions = ["ACTIVE", "INACTIVE", "ON_LEAVE"];

const AddEmployeeForm = ({ onClose }: { onClose: () => void }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Employee>({
  name: "",
  email: "",
  contactNumber: "",
  role: "",
  department: "",
  status: "",
  joiningDate: "",
  lastWorkingDate: "",
  address: "",
});

  const { mutate, isPending } = useMutation({
    mutationFn: (newEmployee: Employee) => createEmployee(newEmployee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee added successfully!")
      onClose();
    },
    onError: (error) => {
      toast.success("Error adding employee: " + getErrorMessage(error))
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
      />

      <Input
        label="Contact Number"
        name="contactNumber"
        value={formData.contactNumber}
        onChange={handleChange}
      />

      <div>
        <label className="block text-sm font-medium mb-1">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
          required
        >
          <option value="">Select Role</option>
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Department"
        name="department"
        value={formData.department}
        onChange={handleChange}
      />

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
        >
          <option value="">Select Status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Joining Date"
        name="joiningDate"
        type="date"
        value={formData.joiningDate ? formData.joiningDate.toString() : ""}
        onChange={handleChange}
      />

      <Input
        label="Last Working Date"
        name="lastWorkingDate"
        type="date"
        value={formData.lastWorkingDate ? formData.lastWorkingDate.toString() : ""}
        onChange={handleChange}
      />

      <Input
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
      />

      <Button
        type="submit"
        variant="primary"
        disabled={isPending}
      >
        {isPending ? "Saving..." : "Add Employee"}
      </Button>
    </form>
  );
};

export default AddEmployeeForm;
