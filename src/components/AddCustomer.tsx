"use client";

import Input from "@/components/ui/Input";
import { createCustomer } from "@/services/serviceApis";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";


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

const AddCustomer:React.FC<AddCustomerProps> = ({onClose}) => {
  const [formData, setFormData] = useState(initialFormData);

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
      <Input
        name="installedModel"
        label="Installed Model"
        placeholder="Enter model"
        value={formData.installedModel}
        onChange={handleChange}
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
      <Input
        name="warrantyYears"
        label="Warranty (Years)"
        placeholder="1 / 2 / 3"
        value={formData.warrantyYears}
        onChange={handleChange}
      />
      <Input
        name="amcRenewed"
        label="AMC Renewed"
        placeholder="YES / NO"
        value={formData.amcRenewed}
        onChange={handleChange}
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
      <Input
        name="installedBy"
        label="Installed By"
        placeholder="Technician Name"
        value={formData.installedBy}
        onChange={handleChange}
      />
      <Input
        name="marketingManager"
        label="Marketing Manager"
        placeholder="Manager Name"
        value={formData.marketingManager}
        onChange={handleChange}
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
