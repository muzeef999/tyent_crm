"use client";
import { getProducts } from "@/services/serviceApis";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Anlaytics = () => {
  const { data:productAnalysis, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(), 
  });

  console.log("product", productAnalysis);
  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error loading data</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Product Analytics</h2>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {productAnalysis?.message?.map((product: any, index: number) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center justify-center hover:shadow-lg transition duration-200"
          >
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-2xl font-bold text-blue-600">{product.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Anlaytics;
