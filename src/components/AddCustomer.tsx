"use client";

import Input from "@/components/ui/Input";
import { createCustomer, getEmployees } from "@/services/serviceApis";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";
import CustomDropdown from "./ui/CustomDropdown";
import { Employee } from "@/types/customer";
import Button from "./ui/Button";
import { customerValidation } from "@/validations/Validation";
import { useFieldValidator } from "@/hooks/useFieldValidator";

const warrantyOptions = [
  { label: "1 Year", value: "1" },
  { label: "2 Years", value: "2" },
  { label: "3 Years", value: "3" },
  { label: "4 Years", value: "4" },
  { label: "5 Years", value: "5" },
  { label: "6 Years", value: "6" },
];

const amcOptions = [
  { label: "Yes", value: "YES" },
  { label: "No", value: "NO" },
];

const installedModelOptions = [
  { label: "NMP-5", value: "NMP-5" },
  { label: "NMP-7", value: "NMP-7" },
  { label: "NMP-9", value: "NMP-9" },
  { label: "NMP-11", value: "NMP-11" },
  { label: "UCE-9", value: "UCE-9" },
  { label: "UCE-11", value: "UCE-11" },
  { label: "UCE-13", value: "UCE-13" },
  { label: "Hbride-H2", value: "Hbride-H2" },
  { label: "H-rich", value: "H-rich" },
];

type AddCustomerProps = {
  onClose: () => void;
};

const initialFormData = {
  name: "",
  contactNumber: "",
  email: "",
  address: "",
  installedModel: "",
  price: "",
  invoiceNumber: "",
  serialNumber: "",
  warrantyYears: "",
  amcRenewed: "",
  remarks: "",
  DOB: "",
  installedBy: "",
  marketingManager: "",
  R0: false,
  pressureTank: false,
};

const AddCustomer: React.FC<AddCustomerProps> = ({ onClose }) => {
  const [formData, setFormData] = useState(initialFormData);
  const { errors, validateField } = useFieldValidator(customerValidation);

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["employees"],
    queryFn: () => getEmployees({ getAll: true }),
  });

  const employees = response?.data;

  const TechincianOptions = employees
    ?.filter((d: Employee) => d.designation === "Technician")
    .map((emp: Employee) => ({ label: emp.name, value: emp._id }));

  const MarkingMangerOptions = employees
    ?.filter((d: Employee) => d.designation === "Marketing Manager")
    .map((emp: Employee) => ({ label: emp.name, value: emp._id }));

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      toast.success("Customer added successfully!");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setFormData(initialFormData);
      onClose();
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || "Something went wrong");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    validateField(name, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const preparedData = {
      ...formData,
      price: Number(formData.price),
      DOB: new Date(formData.DOB).toISOString(),
    };
    mutation.mutate(preparedData);
  };

  if (isLoading) return <p>Setting Up...</p>;
  if (isError) return <p>Unknown Error</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-x-6"
    >
      {/* Input Fields */}
      {[
        { name: "name", label: "Full Name", placeholder: "Enter full name" },
        {
          name: "contactNumber",
          label: "Contact Number",
          placeholder: "Enter phone number",
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "example@mail.com",
        },
        { name: "address", label: "Address", placeholder: "Enter address" },
      ].map(({ name, label, placeholder, type = "text" }) => (
        <div key={name} className="flex flex-col h-22">
          <Input
            name={name}
            label={label}
            placeholder={placeholder}
            type={type}
            value={formData[name as keyof typeof formData] as string}
            onChange={handleChange}
            required={name === "name" || name === "contactNumber"}
          />
          {errors[name] && <p className="text-red-600 -mt-4 text-sm">{errors[name]}</p>}
        </div>
      ))}

      {/* Dropdowns */}
      <CustomDropdown
        label="Installed Model"
        id="installedModel"
        options={installedModelOptions}
        selectedValue={formData.installedModel || ""}
        onSelect={(value) =>
          setFormData((prev) => ({ ...prev, installedModel: value }))
        }
      />

      <Input
        name="price"
        label="Price"
        type="number"
        placeholder="₹"
        value={formData.price}
        onChange={handleChange}
      />

      <Input
        name="invoiceNumber"
        label="Invoice Number"
        placeholder="INV-2025-..."
        value={formData.invoiceNumber}
        onChange={handleChange}
      />

      <Input
        name="serialNumber"
        label="Serial Number"
        placeholder="SN..."
        value={formData.serialNumber}
        onChange={handleChange}
      />

      <CustomDropdown
        label="Warranty (Years)"
        id="warrantyYears"
        options={warrantyOptions}
        selectedValue={formData.warrantyYears || ""}
        onSelect={(value) =>
          setFormData((prev) => ({ ...prev, warrantyYears: value }))
        }
      />

      <CustomDropdown
        label="AMC Renewed"
        id="amcRenewed"
        options={amcOptions}
        selectedValue={formData.amcRenewed || ""}
        onSelect={(value) =>
          setFormData((prev) => ({ ...prev, amcRenewed: value }))
        }
      />

      <Input
        name="remarks"
        label="Remarks"
        placeholder="Any notes..."
        value={formData.remarks}
        onChange={handleChange}
      />

      <Input
        name="DOB"
        label="Date of Birth"
        type="date"
        value={formData.DOB}
        onChange={handleChange}
      />

      <CustomDropdown
        label="Installed By"
        id="installedBy"
        options={TechincianOptions}
        selectedValue={formData.installedBy || ""}
        onSelect={(value) =>
          setFormData((prev) => ({ ...prev, installedBy: value }))
        }
      />

      <CustomDropdown
        label="Marketing Manager"
        id="marketingManager"
        options={MarkingMangerOptions}
        selectedValue={formData.marketingManager || ""}
        onSelect={(value) =>
          setFormData((prev) => ({ ...prev, marketingManager: value }))
        }
      />

      {/* Checkboxes */}
      <div className="flex flex-col gap-2 col-span-full md:col-span-1">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="R0"
            checked={formData.R0}
            onChange={handleChange}
          />
          RO Installed
        </label>
      </div>

      <div className="flex flex-col gap-2 col-span-full md:col-span-1">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="pressureTank"
            checked={formData.pressureTank}
            onChange={handleChange}
          />
          Pressure Tank Included
        </label>
      </div>

      {/* Submit Button */}
      <div className="col-span-full">
        <Button variant="primary" type="submit" >
          Save Customer
        </Button>
      </div>
    </form>
  );
};

export default AddCustomer;
