import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "@/components/ui/Button";
import useDebounce from "@/hooks/useDebounce";
import { getCustomers, createService } from "@/services/serviceApis";
import { toast } from "sonner";
import TypeSearch from "@/components/TypeSearch";

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
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
  const [showDetailsSidebar, setShowDetailsSidebar] = useState(false);

  const debouncedSearchText = useDebounce(searchText, 400);
  const queryClient = useQueryClient();

  // 🔹 Fetch customers by search text
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

  const handleRowClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetailsSidebar(true);
  };

  const toggleServiceType = (type: string) => {
    setSelectedServiceTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const handleSubmit = () => {
    if (!selectedCustomer) return alert("Select a customer");
    if (selectedServiceTypes.length === 0)
      return alert("Select at least one service type");

    mutation.mutate({
      customerId: selectedCustomer._id,
      serviceDate: new Date().toISOString(),
      serviceType: selectedServiceTypes,
    });
  };

  return (
    <div className="relative w-full p-6 bg-white rounded-lg shadow-lg">
      {/* 🔹 Search Box */}
      <TypeSearch
        onSearch={setSearchText}
        placeHolderData="🔍 Search by contact, serial, invoice, or email"
        className="inline-block w-full border-none focus:ring-0 focus:outline-none bg-gray-100"
      />

      {/* 🔹 Dropdown Results */}
      {searchText && (
        <div className="absolute bg-white w-full mt-1 rounded-md border border-gray-200 shadow-lg z-10 max-h-60 overflow-y-auto">
          {isSearchLoading && <div className="p-2 text-gray-500">Loading...</div>}

          {!isSearchLoading && searchCustomer?.data?.length === 0 && (
            <div className="p-2 text-gray-500">No results</div>
          )}

          {!isSearchLoading &&
            searchCustomer?.data?.map((customer: Customer) => (
              <div
                key={customer._id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRowClick(customer)}
              >
                {`${customer.name} > ${customer.contactNumber || "-"} > ${
                  customer.serialNumber || "-"
                } > ${customer.invoiceNumber || "-"}`}
              </div>
            ))}
        </div>
      )}

      {/* 🔹 Selected Customer Info */}
      {selectedCustomer && (
        <div className="mt-3 p-3 border border-gray-200 rounded-md bg-gray-50">
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
              className={`px-3 py-1 rounded-md border transition-all duration-200 ${
                selectedServiceTypes.includes(type)
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {type.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* 🔹 Submit Button */}
      <div className="mt-5">
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={mutation.status === "pending"}
        >
          {mutation.status === "pending" ? "Creating..." : "Create Service"}
        </Button>
      </div>
    </div>
  );
};

export default AddService;
