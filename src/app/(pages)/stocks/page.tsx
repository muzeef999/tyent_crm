"use client";

import { useState } from "react";
import Products from "@/app/(pages)/stocks/Products";
import Locations from "@/components/stocks/Locations";
import Balances from "@/components/stocks/Balances";
import PartHarvests from "@/components/stocks/PartHarvests";

const tabs = [
  "Products",
  "Locations",
  "Balances",
  "Part Harvests",
] as const;

const Page =()  => {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Products");
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📦 Stock Management</h1>


      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-4 ${
              activeTab === tab
                ? "border-b-2 border-blue-600 font-semibold text-blue-600"
                : "text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === "Products" && <Products />}
        {activeTab === "Locations" && <Locations />}
        {activeTab === "Balances" && <Balances />}
        {activeTab === "Part Harvests" && <PartHarvests />}
      </div>
    </div>
  );
}

export default Page;
