"use client";

import Input from "@/components/ui/Input";
import {
  createCustomer,
  getEmployees,
  getProductsIndetail,
} from "@/services/serviceApis";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import CustomDropdown from "@/components/ui/CustomDropdown";
import { Employee } from "@/types/customer";
import { customerValidation } from "@/validations/Validation";
import { useFieldValidator } from "@/hooks/useFieldValidator";
import debounce from "lodash.debounce";
import Button from "@/components/ui/Button";

const warrantyOptions = [
  { label: "1 Year", value: "1" },
  { label: "2 Years", value: "2" },
  { label: "3 Years", value: "3" },
];

const amcOptions = [
  { label: "Service AMC", value: "SERVICE_AMC" },
  { label: "Service + Filter AMC", value: "SERVICE_FILTER_AMC" },
  { label: "Comprehensive AMC", value: "COMPREHENSIVE_AMC" },
];

type AddCustomerProps = {
  onClose: () => void;
};

const initialFormData = {
  name: "",
  contactNumber: "",
  email: "",
  address: "",
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
  tdsValue: "",
  phValue: "",
  inputWaterFlow: "",
};

const AddCustomer: React.FC<AddCustomerProps> = ({ onClose }) => {
  const [formData, setFormData] = useState(initialFormData);
  const { errors, validateField } = useFieldValidator(customerValidation);

  const [serial, setSerial] = useState("");

  // 🔍 Auto search for product by serial
  const {
    data: productData,
    error: productError,
    isFetching: isSearching,
  } = useQuery({
    queryKey: ["product", serial],
    queryFn: () => getProductsIndetail(serial),
    enabled: Boolean(serial), // only fetch if serial is not empty
    staleTime: 1000 * 30,
  });

  useEffect(() => {
    if (productError) {
      toast.error("❌ Serial number not found!");
    }
    if (productData?.message) {
      toast.success("✅ Product found: " + productData.message.name);
      setFormData((prev) => ({
        ...prev,
        installedModel: productData.message.name,
        serialNumber: productData.message._id
      }));
    }
  }, [productError, productData]);

  // ✅ remove debounce from updating formData
  const handleSerialChange = (value: string) => {
    setFormData((prev) => ({ ...prev, serialNumber: value })); // always update formData
    debouncedSearch(value); // only search is debounced
  };

  // ✅ create debounced function just for searching
  const debouncedSearch = React.useMemo(
    () =>
      debounce((value: string) => {
        setSerial(value);
      }, 400),
    []
  );

  // employees list
  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: () => getEmployees({ getAll: true }),
  });

  const employees = response?.data;

  console.log(employees);

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
        {
          name: "price",
          label: "Price",
          placeholder: "₹",
        },
        {
          name: "invoiceNumber",
          label: "Invoice Number",
          placeholder: "INV-2025-...",
        },

        {
          name: "remarks",
          label: "Remarks",
          placeholder: "Any notes...",
        },

        {
          name: "tdsValue",
          label: "Input TDS",
          placeholder: "350",
        },
        {
          name: "phValue",
          label: "Input Ph values",
          placeholder: "7.5pH",
        },
        {
          name: "inputWaterFlow",
          label: "Input Water Flow",
          placeholder: "350",
        },
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
          {errors[name] && (
            <p className="text-red-600 -mt-4 text-sm">{errors[name]}</p>
          )}
        </div>
      ))}

      {/* 🔍 Serial Search */}
      <div>
        <Input
          name="serialNumber"
          label="Serial Number"
          placeholder="SN..."
          value={formData.serialNumber}
          onChange={(e) => handleSerialChange(e.target.value)}
        />
        {productData?.data ? (
          <p className="text-green-600 -mt-4 text-sm">
            {productData?.data?.name}
          </p>
        ) : (
          <p className="text-red-500 -mt-4 text-sm">Not found</p>
        )}
        {isSearching && <p>Searching...</p>}
      </div>

      <CustomDropdown
        label="AMC Package"
        id="amcRenewed"
        options={amcOptions}
        selectedValue={formData.amcRenewed || ""}
        onSelect={(value) =>
          setFormData((prev) => ({ ...prev, amcRenewed: value }))
        }
      />
      <CustomDropdown
        label="AMC (Years)"
        id="warrantyYears"
        options={warrantyOptions}
        selectedValue={formData.warrantyYears || ""}
        onSelect={(value) =>
          setFormData((prev) => ({ ...prev, warrantyYears: value }))
        }
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
      <div className="flex mt-2 gap-2 col-span-full md:col-span-1">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="R0"
            checked={formData.R0}
            onChange={handleChange}
          />
          RO Installed
        </label>

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
        <Button variant="primary" type="submit">
          Save Customer
        </Button>
      </div>
    </form>
  );
};

export default AddCustomer;
