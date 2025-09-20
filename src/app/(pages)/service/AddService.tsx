import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import useDebounce from "@/hooks/useDebounce";
import { getCustomers, createService } from "@/services/serviceApis";
import { LiaSearchSolid } from "react-icons/lia";
import { toast } from "sonner";

type AddServiceProps = {
  onClose: () => void;
};

type Customer = {
  _id: string;
  name: string;
  contactNumber?: string;
  alternativeNumber?: string;
  email?: string;
  address?: string;
  invoiceNumber?: string;
  serialNumber?: string;
  DOB?: string;
};

const serviceTypes = [
  "GENERAL_SERVICE",
  "PAID_SERVICE",
  "IN_WARRANTY_BREAKDOWN",
  "FILTER_REPLACEMENT",
  "INSTALLATION",
  "RE_INSTALLATION",
  "FEASIBILITY",
  "SPARE_PART_REPLACEMENT",
  "DEEP_CLEANING",
  "SPMS_PLUS_REPLACEMENT",
  "JOGDIAL_REPLACEMENT",
  "DISPLAY_REPLACEMENT",
  "PH_LEVEL_NOT_STABLE",
  "UNPLEASANT_WATER_TASTE",
  "TOUCH_PANEL_UNRESPONSIVE",
  "RO_SYSTEM_MALFUNCTIONING",
  "PRESSURE_TANK_NOT_FUNCTIONING",
];

const AddService: React.FC<AddServiceProps> = ({ onClose }) => {
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>(
    []
  );

  const debouncedSearchText = useDebounce(searchText, 100);
  const queryClient = useQueryClient();

  // 🔹 Search Customers
  const {
    data: searchCustomer,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useQuery({
    queryKey: ["SearchCustomers", debouncedSearchText],
    queryFn: () => getCustomers({ q: debouncedSearchText }),
    enabled: !!debouncedSearchText,
  });

  // 🔹 Mutation to create service
  const mutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
       toast.success("Service created successfully");
      onClose();
    },
    onError: (error: any) => {
      alert("Failed to create service: " + error.message);
    },
  });

  const handleSubmit = () => {
    if (!selectedCustomer) return alert("Select a customer");
    if (selectedServiceTypes.length === 0)
      return alert("Select at least one service type");

    mutation.mutate({
      customerId: selectedCustomer._id,
      serviceDate: new Date().toISOString(), // today date
      serviceType: selectedServiceTypes,
    });
  };

  const toggleServiceType = (type: string) => {
    setSelectedServiceTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="relative w-full  p-6 bg-white rounded-lg shadow-lg">
      {/* 🔹 Search Box */}

      {/* Input */}
      <Input
        type="search"
        value={searchText}
        onFocus={() => {
          if (searchCustomer?.data?.length) setIsOpen(true);
        }}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="🔍 Search by contact, serial, invoice, or email"
        className="inline-block align-middle w-[calc(100%-40px)] border-none focus:ring-0 focus:outline-none bg-gray-100"
      />

      {/* 🔹 Dropdown */}
      {isOpen && searchCustomer?.data?.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
          {searchCustomer.data.slice(0, 5).map((cust: Customer) => (
            <li
              key={cust._id}
              className={`px-4 py-2 cursor-pointer ${
                selectedCustomer?._id === cust._id
                  ? "bg-blue-100"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => {
                setSearchText(cust.contactNumber || cust.serialNumber || "");
                setSelectedCustomer(cust);
                setIsOpen(false);
              }}
            >
              {cust.name} — {cust.contactNumber} — {cust.serialNumber} —{" "}
              {cust.invoiceNumber}
            </li>
          ))}
        </ul>
      )}

      {/* 🔹 Loading / Error */}
      {isSearchLoading && (
        <div className="text-sm text-gray-500 mt-2">Loading...</div>
      )}
      {isSearchError && (
        <div className="text-sm text-red-500 mt-2">Error fetching customer</div>
      )}

      {/* 🔹 Selected Customer Info */}
      {selectedCustomer && (
        <div className="mt-2 p-3 border border-gray-200 rounded-md bg-gray-50">
          <p>
            <strong>Name:</strong> {selectedCustomer.name}
          </p>
          <p>
            <strong>Contact:</strong> {selectedCustomer.contactNumber}
          </p>
          <p>
            <strong>Email:</strong> {selectedCustomer.email}
          </p>
          <p>
            <strong>Invoice:</strong> {selectedCustomer.invoiceNumber}
          </p>
          <p>
            <strong>Serial:</strong> {selectedCustomer.serialNumber}
          </p>
        </div>
      )}

      {/* 🔹 Service Type Selection */}
      <div className="mt-4">
        <label className="block mb-1 font-semibold">Service Type</label>
        <div className="flex flex-wrap gap-2">
          {serviceTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => toggleServiceType(type)}
              className={`px-3 py-1 rounded-md border ${
                selectedServiceTypes.includes(type)
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {type.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* 🔹 Submit Button */}
      <Button
        variant="primary"
        onClick={handleSubmit}
        disabled={mutation.status === "pending"}
      >
        {mutation.status === "pending" ? "Creating..." : "Create Service"}
      </Button>
    </div>
  );
};

export default AddService;
