"use client";

import { getProducts } from "@/services/serviceApis";
import { Product } from "@/types/customer";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import Anlaytics from "./Anlaytics";

const Products = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (error) {
    return <p className="text-red-500">Failed to load products ❌</p>;
  }

  const products: Product[] = data?.message || [];

  return (
    <div className="overflow-x-auto">
     <Anlaytics />
    </div>
  );
};

export default Products;
