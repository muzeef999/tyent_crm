"use client";

import Input from "@/components/ui/Input";
import {
  createCustomer,
  getEmployees,
  getProductsIndetail,
  MarkingMangerOptionsfetch,
  TechincianOptionsfetch,
} from "@/services/serviceApis";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import CustomDropdown from "@/components/ui/CustomDropdown";
import { Cityt, Employee, Option, Statet } from "@/types/customer";
import { customerValidation } from "@/validations/Validation";
import { useFieldValidator } from "@/hooks/useFieldValidator";
import debounce from "lodash.debounce";
import Button from "@/components/ui/Button";
import { State, City } from "country-state-city";
import Accordion from "@/components/ui/Accordion";

const warrantyOptions = [
  { label: "1 Year", value: "1" },
  { label: "2 Years", value: "2" },
  { label: "3 Years", value: "3" },
];

const warrantyMachiene = [
  { label: "1 Year", value: "1" },
  { label: "2 Years", value: "2" },
  { label: "3 Years", value: "3" },
];

const warrantyPlates = [
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
      { label: "Company Installed No-warranty", value: "RO_company" },
      {
        label: "Company Installed 1-year warranty",
        value: "RO_third-party",
      },
      { label: "Third-Party Installed", value: "RO_third-party" },
    ],
  },
  {
    label: "Bore",
    options: [{ label: "Bore", value: "Bore" }],
  },
  {
    label: "Municipal",
    options: [{ label: "Municipal", value: "Municipal" }],
  },
];

const mapStatesToOptions = (states: Statet[]): Option[] =>
  states.map((s) => ({
    label: s.name,
    value: s.isoCode, // use isoCode for unique state value
  }));

const mapCitiesToOptions = (cities: Cityt[]): Option[] =>
  cities.map((c) => ({
    label: c.name,
    value: c.name, // or use `${c.name}-${c.stateCode}` if you need uniqueness
  }));

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
  warrantyYears: "",
  amcRenewed: "",
  remarks: "",
  DOB: "",
  installedBy: "",
  marketingManager: "",
  tdsValue: "",
  phValue: "",
  waterType: "",
  waterMethod: "",
  purchaseDate:"",
  warrantyMachineYears: "",
  warrantyPlatesYears: "",
  state: "",
  city: "",
};

const AddCustomer: React.FC<AddCustomerProps> = ({ onClose }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [productId, setProductId] = useState(""); // Store the product ObjectId
  const [serialInput, setSerialInput] = useState(""); // Store the serial number input
  const { errors, validateField } = useFieldValidator(customerValidation);
  const [openSection, setOpenSection] = useState<string | null>("customer"); // default open

  const [serial, setSerial] = useState("");

  const customerFields = [
    "name",
    "email",
    "contactNumber",
    "alternativeNumber",
    "address",
    "DOB",
    "state",
    "city",
  ];
  const machineFields = [
    "serialNumber",
    "invoiceNumber",
    "price",
    "marketingManager",
    "installedBy",
    "amcRenewed",
    "warrantyYears",
    "warrantyMachineYears",
    "warrantyPlatesYears",
  ];
  const installationFields = [
    "waterType",
    "waterMethod",
    "phValue",
    "tdsValue",
    "remarks",
  ];

  const hasCustomerError = customerFields.some((f) => !!errors[f]);
  const hasMachineError = machineFields.some((f) => !!errors[f]);
  const hasInstallationError = installationFields.some((f) => !!errors[f]);

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
      setProductId(""); // Clear product ID on error
    }

    if (productData?.data) {
      setProductId(productData.data._id); // Store the product ObjectId
    }
  }, [productError, productData]);

  // ✅ create debounced function just for searching
  const debouncedSearch = React.useMemo(
    () =>
      debounce((value: string) => {
        setSerial(value);
      }, 400),
    []
  );

  const handleSerialChange = (value: string) => {
    setSerialInput(value); // Store the input value for display
    debouncedSearch(value); // only search is debounced
  };

  const {
    data: managerResponse,
  } = useQuery({
    queryKey: ["MarkingMangerOptions"],
    queryFn: () => MarkingMangerOptionsfetch(),
  });


    const {
    data: techResponse,
  } = useQuery({
    queryKey: ["TechincianOptions"],
    queryFn: () => TechincianOptionsfetch(),
  });



const TechincianOptions = techResponse?.data?.map((emp:any) => ({
  label: emp.name,
  value: emp._id,
}));

const MarkingMangerOptions = managerResponse?.data?.map((emp:any) => ({
  label: emp.name,
  value: emp._id,
}));


  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      toast.success("Customer added successfully!");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setFormData(initialFormData);
      setSerialInput(""); // Clear serial input
      setProductId(""); // Clear product ID
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

    // Validate that we have a product ID
    if (!productId) {
      toast.error(
        "Please select a valid product by searching with a serial number"
      );
      return;
    }

    const preparedData = {
      ...formData,
      serialNumber: productId, // Use the product ObjectId, not the input text
      price: Number(formData.price.replace(/,/g, "")),
      DOB: formData.DOB && new Date(formData.DOB).toISOString(),
    };

    mutation.mutate(preparedData);
  };


  const handleToggleAccordion = (id: string) => {
    setOpenSection((prev) => (prev === id ? "" : id)); // only one open at a time
  };

  return (
    <form onSubmit={handleSubmit} className=" hide-scrollbar">
      <Accordion
        title="Customer Details"
        id="customer"
        isOpen={openSection === "customer"}
        onToggle={handleToggleAccordion}
        hasError={hasCustomerError}
      >
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

          <div className="flex flex-col h-22">
            <Input
              name={"address"}
              label={"Address"}
              placeholder={"Enter address"}
              type={"text"}
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && (
              <p className="text-red-600 -mt-4 text-sm">
                {errors.address}
              </p>
            )}
          </div>


          <div className="flex flex-col h-22">
            <CustomDropdown
              label="State of Residence"
              id="state"
              options={mapStatesToOptions(State.getStatesOfCountry("IN"))}
              selectedValue={formData.state || ""}
              onSelect={(value, option) =>
                setFormData((prev) => ({ ...prev, state: String(value) }))
              }
            />
          </div>

          <div className="flex flex-col h-22">
            <CustomDropdown
              label="City of Residence"
              id="city"
              options={mapCitiesToOptions(
                City.getCitiesOfState("IN", formData.state)
              )}
              selectedValue={formData.city || ""}
              onSelect={(value) =>
                setFormData((prev) => ({ ...prev, city: String(value) }))
              }
            />
          </div>
          <Input
            name="DOB"
            label="Date of Birth"
            type="date"
            value={formData.DOB}
            max={new Date().toISOString().split("T")[0]} 
            onChange={handleChange}
          />



          <div className="flex flex-col h-22">
            <Input
              name="purchaseDate"
              label="Purchase Date"
              type="date"
               max={new Date().toISOString().split("T")[0]} 
              value={formData.purchaseDate}
              onChange={handleChange}
            />
          </div>

        </div>
      </Accordion>

      <Accordion
        title="Machine Details"
        id="machine"
        isOpen={openSection === "machine"}
        onToggle={handleToggleAccordion}
        hasError={hasMachineError}
      >
        {/* 🔍 Serial Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <div>
            <Input
              name="serialNumber"
              label="Serial Number"
              placeholder="SN..."
              value={serialInput} // Use the separate state for input value
              onChange={(e) => handleSerialChange(e.target.value)}
            />
            {productData?.data ? (
              <p className="text-green-600 -mt-4 text-sm">
                ✓ {productData?.data?.name} - Found
              </p>
            ) : serialInput && !isSearching ? (
              <p className="text-red-500 -mt-4 text-sm">Product not found</p>
            ) : null}
            {isSearching && (
              <p className="text-blue-500 -mt-4 text-sm">Searching...</p>
            )}
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
                setFormData((prev) => ({
                  ...prev,
                  marketingManager: String(value),
                }))
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
                setFormData((prev) => ({ ...prev, installedBy: String(value) }))
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
                setFormData((prev) => ({ ...prev, amcRenewed: String(value) }))
              }
            />
          </div>
          <div className="flex flex-col h-22">
            <CustomDropdown
              label="AMC (Years)"
              id="warrantyYears"
              options={warrantyOptions}
              selectedValue={formData.warrantyYears || ""}
              onSelect={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  warrantyYears: String(value),
                }));
              }}
            />
          </div>
          <div className="flex flex-col h-22">
            <CustomDropdown
              label="Warranty (Years) on Machine"
              id="warrantyMachineYears"
              options={warrantyMachiene}
              selectedValue={formData.warrantyMachineYears || ""}
              onSelect={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  warrantyMachineYears: String(value),
                }))
              }
            />
          </div>

          <div className="flex flex-col h-22">
            <CustomDropdown
              label="Warranty (Years) on Plates"
              id="warrantyPlatesYears"
              options={warrantyPlates}
              selectedValue={formData.warrantyPlatesYears || ""}
              onSelect={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  warrantyPlatesYears: String(value),
                }))
              }
            />
          </div>
        </div>
      </Accordion>

      <Accordion
        title="Installation Parameters"
        id="installation"
        isOpen={openSection === "installation"}
        onToggle={handleToggleAccordion}
        hasError={hasInstallationError}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-6">
          <CustomDropdown
            label="Input Water Source"
            id="waterType"
            options={WaterType}
            selectedValue={formData.waterType || ""}
            onSelect={(value) =>
              setFormData((prev) => ({ ...prev, waterType: String(value) }))
            }
          />

          <CustomDropdown
            label="Input Water Method"
            id="waterMethod"
            options={WaterMethod}
            selectedValue={formData.waterMethod || ""}
            onSelect={(value) =>
              setFormData((prev) => ({ ...prev, waterMethod: String(value) }))
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

          <div className="flex flex-col -mt-6 h-22">
            <Input
              name={"remarks"}
              label={"Remarks"}
              placeholder={"Any notes..."}
              type={"text"}
              value={formData.remarks}
              onChange={handleChange}
            />
            {errors.remarks && (
              <p className="text-red-600 -mt-4 text-sm">{errors.remarks}</p>
            )}
          </div>
        </div>
      </Accordion>

      {/* Submit Button */}
      <div className="col-span-full justify-end flex">
        <Button variant="primary" type="submit" disabled={!productId}>
          Save Customer
        </Button>
      </div>
    </form>
  );
};

export default AddCustomer;
