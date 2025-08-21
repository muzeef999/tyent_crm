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

const WaterType = [
  {
    label: "RO",
    options: [
      { label: "Company Installed", value: "RO_company" },
      { label: "Third-Party Installed", value: "RO_third-party" },
    ],
  },
  {
    label: "Bore",
    options: [
      { label: "Company Installed", value: "Bore_company" },
      { label: "Third-Party Installed", value: "Bore_third-party" },
    ],
  },
  {
    label: "Municipal",
    options: [
      { label: "Company Installed", value: "Municipal_company" },
      { label: "Third-Party Installed", value: "Municipal_third-party" },
    ],
  },
];

const WaterMethod = [
  {
    label: "Direct",
    options: [{ label: "Direct", value: "Direct" }],
  },
  {
    label: "Booster Pump",
    options: [
      { label: "Company Installed", value: "Booster_company" },
      { label: "Third-Party Installed", value: "Booster_third-party" },
    ],
  },
  {
    label: "Pressure Tank",
    options: [
      { label: "Company Installed", value: "Pressure_company" },
      { label: "Third-Party Installed", value: "Pressure_third-party" },
    ],
  },
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
  alternativeNumber: "",
  invoiceNumber: "",
  serialNumber: "",
  warrantyYears: "",
  amcRenewed: "",
  remarks: "",
  DOB: "",
  installedBy: "",
  marketingManager: "",
  tdsValue: "",
  phValue: "",
  inputWaterFlow: "",
  waterType: "",
  waterMethod: "",
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

    if (productData?.data) {
      toast.success("✅ Product found: " + productData.data.name);

      setFormData((prev) => ({
        ...prev,
        serialNumber: productData.data.serialNumber, // ✅ save ID
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

  const formatIndianPrice = (value: string) => {
    if (!value) return "";
    const numericValue = value.replace(/\D/g, ""); // keep only digits
    return new Intl.NumberFormat("en-IN").format(Number(numericValue));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;

    validateField(name, value);

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (target as HTMLInputElement).checked,
      }));
    } else if (name === "price") {
      const rawValue = value.replace(/\D/g, ""); // only digits
      setFormData((prev) => ({
        ...prev,
        [name]: formatIndianPrice(rawValue), // formatted for UI
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
      price: Number(formData.price.replace(/,/g, "")),

      DOB: new Date(formData.DOB).toISOString(),
    };
    mutation.mutate(preparedData);
  };

  if (isLoading) return <p>Setting Up...</p>;
  if (isError) return <p>Unknown Error</p>;

  return (
    <form onSubmit={handleSubmit}>
      <section className="border-b pb-3">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Customer Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          {/* Input Fields */}
          {[
            {
              name: "name",
              label: "Full Name",
              placeholder: "Enter full name",
            },
            {
              name: "email",
              label: "Email",
              type: "email",
              placeholder: "example@mail.com",
            },
            {
              name: "contactNumber",
              label: "Contact Number",
              placeholder: "Enter phone number",
            },
            {
              name: "alternativeNumber",
              label: "Alternative Number",
              placeholder: "Enter alternative phone number",
            },

            { name: "address", label: "Address", placeholder: "Enter address" },

            {
              name: "remarks",
              label: "Remarks",
              placeholder: "Any notes...",
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
              />
              {errors[name] && (
                <p className="text-red-600 -mt-4 text-sm">{errors[name]}</p>
              )}
            </div>
          ))}

          <Input
            name="DOB"
            label="Date of Birth"
            type="date"
            value={formData.DOB}
            onChange={handleChange}
          />
        </div>
      </section>

      <section className="border-b pb-3">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 mt-2">
          Machine Details:
        </h2>

        {/* 🔍 Serial Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
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

          <div className="flex flex-col h-22">
            <Input
              name={"invoiceNumber"}
              label={"Invoice Number"}
              placeholder={"INV-2025-..."}
              type={"text"}
              value={formData.invoiceNumber}
              onChange={handleChange}
            />
            {errors.invoiceNumber && (
              <p className="text-red-600 -mt-4 text-sm">
                {errors.invoiceNumber}
              </p>
            )}
          </div>

          <div className="flex flex-col h-22">
            <Input
              name={"price"}
              label={"Price"}
              placeholder={"₹"}
              type={"text"}
              value={formData.price}
              onChange={handleChange}
            />
            {errors.price && (
              <p className="text-red-600 -mt-4 text-sm">{errors.price}</p>
            )}
          </div>
          <div className="flex flex-col h-22">
            <CustomDropdown
              label="Marketing Manager"
              id="marketingManager"
              options={MarkingMangerOptions}
              selectedValue={formData.marketingManager || ""}
              onSelect={(value) =>
                setFormData((prev) => ({ ...prev, marketingManager: value }))
              }
            />
          </div>
          <div className="flex flex-col h-22">
            <CustomDropdown
              label="Installed By"
              id="installedBy"
              options={TechincianOptions}
              selectedValue={formData.installedBy || ""}
              onSelect={(value) =>
                setFormData((prev) => ({ ...prev, installedBy: value }))
              }
            />
          </div>
          <div className="flex flex-col h-22">
            <CustomDropdown
              label="AMC Package"
              id="amcRenewed"
              options={amcOptions}
              selectedValue={formData.amcRenewed || ""}
              onSelect={(value) =>
                setFormData((prev) => ({ ...prev, amcRenewed: value }))
              }
            />
          </div>

          <div className="flex flex-col h-22">
            <CustomDropdown
              label="AMC (Years)"
              id="warrantyYears"
              options={warrantyOptions}
              selectedValue={formData.warrantyYears || ""}
              onSelect={(value) =>
                setFormData((prev) => ({ ...prev, warrantyYears: value }))
              }
            />
          </div>
        </div>
      </section>

      <section className="pb-3">
        <h1 className="text-xl font-semibold text-gray-800 mb-2 mt-2">
          Installation Parameters:
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-6">
          <CustomDropdown
            label="Water Type"
            id="waterType"
            options={WaterType}
            selectedValue={formData.waterType || ""}
            onSelect={(value) =>
              setFormData((prev) => ({ ...prev, waterType: value }))
            }
          />

          <CustomDropdown
            label="Water Method"
            id="waterMethod"
            options={WaterMethod}
            selectedValue={formData.waterMethod || ""}
            onSelect={(value) =>
              setFormData((prev) => ({ ...prev, waterMethod: value }))
            }
          />

          <div className="flex flex-col h-22">
            <Input
              name={"phValue"}
              label={"Input Water pH"}
              placeholder={"7.5pH"}
              type={"text"}
              value={formData.phValue}
              onChange={handleChange}
            />
            {errors.phValue && (
              <p className="text-red-600 -mt-4 text-sm">{errors.phValue}</p>
            )}
          </div>
          <div className="flex flex-col h-22">
            <Input
              name={"tdsValue"}
              label={"Input Water TDS (ppm)"}
              placeholder={"350"}
              type={"text"}
              value={formData.tdsValue}
              onChange={handleChange}
            />
            {errors.tdsValue && (
              <p className="text-red-600 -mt-4 text-sm">{errors.tdsValue}</p>
            )}
          </div>
        </div>
      </section>

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
