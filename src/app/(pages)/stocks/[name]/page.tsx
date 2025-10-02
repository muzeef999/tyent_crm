"use client";
import TableLoading from "@/components/ui/TableLoading";
import { getProducts } from "@/services/serviceApis";
import { useQuery } from "@tanstack/react-query";
import React, { use } from "react";

const Page = ({ params }: { params: Promise<{ name: string }> }) => {
  const { name } = use(params);
  const type = name ? decodeURIComponent(name) : "";

  const { data: stockProducts, isLoading, error } = useQuery({
    queryKey: ["products", type],
    queryFn: () => getProducts(type),
  });

  if (error) {
    return <p className="p-6 text-red-500">Error fetching data</p>;
  }

  return (
    <div className="p-6 overflow-x-auto">
      <table className="w-full border border-gray-200 customtable p-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Serial Number</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Assigned To</th>
            <th className="p-2 text-left">Updated At</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <TableLoading />
          ) : stockProducts && stockProducts?.data?.length > 0 ? (
            stockProducts?.data.map((product: any) => (
              <tr
                key={product._id}
                className="transition hover:bg-gray-50 cursor-pointer border-t"
              >
                <td>{product.serialNumber}</td>
                <td>{product.name}</td>
                <td>{product.status}</td>
                <td>{product.assignedTo || "-"}</td>
                <td>
                  {product.updatedAt
                    ? new Date(product.updatedAt).toLocaleDateString("en-GB")
                    : "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center p-4">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Page;
