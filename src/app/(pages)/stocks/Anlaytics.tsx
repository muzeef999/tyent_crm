"use client";
import TypeSearch from "@/components/TypeSearch";
import Button from "@/components/ui/Button";
import Offcanvas from "@/components/ui/Offcanvas";
import { useAuth } from "@/hooks/useAuth";
import { getProducts } from "@/services/serviceApis";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import AddProduct from "./AddProduct";
import Link from "next/link";

const Anlaytics = () => {
  const { user } = useAuth();
  const [showAddSidebar, setShowAddSidebar] = useState(false);
  const [searchText, setSearchText] = useState("");

  const {
    data: productAnalysis,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(""),
  });

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Error loading data</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center shadow-sm bg-white sha p-2 rounded-xl mb-4">
        <div>
          <h1 className="font-medium text-2xl text-black">
            Hello,{user?.customer}
          </h1>
          <p className="text-md">{user?.designation}</p>
        </div>

        <div>
          <div className="flex-1 min-w-[580px]">
            <TypeSearch
              onSearch={setSearchText}
              placeHolderData={"🔍 Search serial number"}
            />
          </div>
        </div>

        <Button variant="primary" onClick={() => setShowAddSidebar(true)}>
          <IoIosAdd size={22} />
          Add Product
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {productAnalysis?.message?.map((product: any, index: number) => (
          <Link
            href={`/stocks/${product.name}`}
            key={index}
            className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center justify-center hover:shadow-lg transition duration-200"
          >
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-2xl font-bold text-blue-600">{product.count}</p>
          </Link>
        ))}
      </div>

      <Offcanvas
        show={showAddSidebar}
        onClose={() => setShowAddSidebar(false)}
        title="Add Product"
      >
        <div className="p-4">
          <AddProduct onClose={() => setShowAddSidebar(false)} />
        </div>
      </Offcanvas>
    </div>
  );
};

export default Anlaytics;
