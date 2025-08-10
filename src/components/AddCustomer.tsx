"use client";

import Input from "@/components/ui/Input";
import { createCustomer, getEmployees } from "@/services/serviceApis";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";
import CustomDropdown from "./ui/CustomDropdown";
import { Employee } from "@/types/customer";

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

  const {
    data: employees,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });

  const TechincianOptions = employees?.data
    ?.filter((d: Employee) => d.designation === "Technician")
    .map((emp: Employee) => ({
      label: emp.name, // assuming employee object has 'name' field
      value: emp._id, // MongoDB ObjectId
    }));

  const MarkingMangerOptions = employees?.data
    ?.filter((d: Employee) => d.designation === "Marketing Manager")
    .map((emp: Employee) => ({
      label: emp.name, // assuming employee object has 'name' field
      value: emp._id, // MongoDB ObjectId
    }));

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
      const Error = getErrorMessage(error);
      toast.error(Error || "Something went wrong");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;

    if (type === "checkbox") {
      const checkbox = target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: checkbox.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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


  if(isLoading) {
    return<p>Seeting Up</p>
  }

  if(isError){
    return<p>unknow Error</p>
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <Input
        name="name"
        label="Full Name"
        placeholder="Enter full name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <Input
        name="contactNumber"
        label="Contact Number"
        placeholder="Enter phone number"
        value={formData.contactNumber}
        onChange={handleChange}
        required
      />
      <Input
        name="email"
        label="Email"
        type="email"
        placeholder="example@mail.com"
        value={formData.email}
        onChange={handleChange}
      />
      <Input
        name="address"
        label="Address"
        placeholder="Enter address"
        value={formData.address}
        onChange={handleChange}
      />

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

      {/* ✅ Boolean Inputs */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="R0"
          checked={formData.R0}
          onChange={handleChange}
        />
        <label htmlFor="R0">RO Installed</label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="pressureTank"
          checked={formData.pressureTank}
          onChange={handleChange}
        />
        <label htmlFor="pressureTank">Pressure Tank Included</label>
      </div>

      <div className="col-span-full">
        <button
          type="submit"
          className="bg-primary text-white py-2 px-6 rounded hover:bg-opacity-90 transition"
        >
          Save Customer
        </button>
      </div>
    </form>
  );
};

export default AddCustomer;
