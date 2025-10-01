import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Input from "@/components/ui/Input";
import CustomDropdown from "@/components/ui/CustomDropdown";
import { createProduct } from "@/services/serviceApis";

// Options for dropdowns
const productNames = [
  "NMP-5",
  "NMP-7",
  "NMP-9",
  "NMP-11",
  "UCE-9",
  "UCE-11",
  "UCE-13",
  "Hybrid-H2",
  "H-Rich",
];
const categories = ["IONIZER", "FILTER", "ACCESSORY"];

type AddProductProps = {
  onClose: () => void;
};

type FormData = {
  name: string;
  category: string;
  serialNumber: string;
};

const AddProduct: React.FC<AddProductProps> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "",
    serialNumber: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // TanStack Query mutation using your service
  const addProductMutation = useMutation<any, Error, FormData>(
    {
    
      mutationFn:(data: FormData) => createProduct(data),
    
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });

        onClose();
      },
      onError: (error: any) => {
        console.error("Error adding product:", error);
      },
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name) newErrors.name = "Please select a product name";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.serialNumber)
      newErrors.serialNumber = "Serial Number is required";
    if (Object.keys(newErrors).length === 0) {
      addProductMutation.mutate(formData);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4 w-96">
      {/* Name Dropdown */}
      <div className="flex flex-col">
        <CustomDropdown
          label="Product Name"
          id="name"
          options={productNames.map((name) => ({ label: name, value: name }))}
          selectedValue={formData.name}
          onSelect={(value) =>
            setFormData((prev) => ({ ...prev, name: String(value) }))
          }
        />
        {errors.name && (
          <p className="text-red-600 text-sm -mt-2">{errors.name}</p>
        )}
      </div>

      {/* Category Dropdown */}
      <div className="flex flex-col">
        <CustomDropdown
          label="Category"
          id="category"
          options={categories.map((cat) => ({ label: cat, value: cat }))}
          selectedValue={formData.category}
          onSelect={(value) =>
            setFormData((prev) => ({ ...prev, category: String(value) }))
          }
        />
        {errors.category && (
          <p className="text-red-600 text-sm -mt-2">{errors.category}</p>
        )}
      </div>

      {/* Serial Number Input */}
      <div className="flex flex-col">
        <Input
          name="serialNumber"
          label="Serial Number"
          placeholder="Enter serial number"
          type="text"
          value={formData.serialNumber}
          onChange={handleChange}
        />
        {errors.serialNumber && (
          <p className="text-red-600 text-sm -mt-2">{errors.serialNumber}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleSubmit}
        disabled={addProductMutation.status === "pending"}
      >
        {addProductMutation.status === "pending" ? "Adding..." : "Add Product"}
      </button>
    </div>
  );
};

export default AddProduct;
