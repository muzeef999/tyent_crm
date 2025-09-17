import Input from "@/components/ui/Input";
import useDebounce from "@/hooks/useDebounce";
import { getCustomers } from "@/services/serviceApis";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { LiaSearchSolid } from "react-icons/lia";

type AddServiceProp = {
  onClose: () => void;
};

const AddService: React.FC<AddServiceProp> = ({ onClose }) => {
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // debounce to avoid API spam
  const debouncedSearchText = useDebounce(searchText, 500);

  const {
    data: searchCustomer,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["SearchCustomers", debouncedSearchText],
    queryFn: () => getCustomers({ q: debouncedSearchText }),
    enabled: !!debouncedSearchText, // only run when user types
  });

  return (
    <div className="relative w-full max-w-md">
      {/* Search Box */}
      <div className="flex w-full items-center bg-gray-100 border border-gray-300 rounded-md">
        <div className="p-2">
        <LiaSearchSolid className="text-gray-500" size={20} />
        </div>
        <Input
          type="search"
          value={searchText}
          onFocus={() => {
            if (searchCustomer?.data?.length > 0) setIsOpen(true);
          }}
          onBlur={() => {
            // small delay so click works
            setTimeout(() => setIsOpen(false), 200);
          }}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by contact, serial, invoice, or email"
          className="flex-1 border-0 focus:ring-0 focus:outline-none bg-gray-100"
        />
      </div>

      {/* Dropdown */}
      {isOpen && searchCustomer?.data?.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
          {searchCustomer.data.slice(0, 5).map((cust: any) => (
            <li
              key={cust._id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSearchText(cust.contactNumber || cust.serialNumber || "");
                setIsOpen(false);
              }}
            >
              {cust.name} — {cust.contactNumber} — {cust.serialNumber} — {cust.invoiceNumber}
            </li>
          ))}
        </ul>
      )}

      {/* Status */}
      {isLoading && <div className="mt-2 text-sm text-gray-500">Loading...</div>}
      {isError && <div className="mt-2 text-sm text-red-500">Error fetching customer</div>}
    </div>
  );
};

export default AddService;
