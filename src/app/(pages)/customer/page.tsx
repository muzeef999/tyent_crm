"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCustomerAnalysis } from "@/services/serviceApis";
import { CustomerAnalyticsResponse } from "@/types/customer";
import AmcPieChart from "./recharts/AmcPieChart";
import ModelBarChat from "./recharts/ModelBarChat";
import Warranty from "./recharts/Warranty";
import WaterMethod from "./recharts/WaterMethod";
import CustomerAnalytics from "./CustomerAnalytics";
import Button from "@/components/ui/Button";
import { IoIosAdd } from "react-icons/io";
import Offcanvas from "@/components/ui/Offcanvas";
import AddCustomer from "./AddCustomer";
import WaterTypeChart from "./recharts/WaterTypeChart";

// Define types for API response

const Page: React.FC = () => {
  const [showAddSidebar, setShowAddSidebar] = useState(false);
  const { data, isLoading, error } = useQuery<CustomerAnalyticsResponse>({
    queryKey: ["customers"],
    queryFn: getCustomerAnalysis,
  });



  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error loading data</div>;

  // Transform AMC data for PieChart
  const pieData =
    data?.analytics.amc.map((item) => ({
      name:
        (item._id || "Unknown").charAt(0).toUpperCase() +
        item._id?.slice(1).toLowerCase(),
      value: item.count,
    })) || [];

  const barData =
    data?.analytics.model.map((item) => ({
      name:
        (item._id || "Unknown").replace(/_/g, " ").charAt(0).toUpperCase() +
        item._id.slice(1).toLowerCase(),
      value: item.count,
    })) || [];

  const waterMethodData =
    data?.analytics.waterMethod.map((item) => ({
      name:
        (item._id || "Unknown").replace(/_/g, " ").charAt(0).toUpperCase() +
        item._id.slice(1).toLowerCase(),
      value: item.count,
    })) || [];

  const WaterType =
    data?.analytics.waterType.map((item) => ({
      name:
        (item._id || "Unknown").replace(/_/g, " ").charAt(0).toUpperCase() +
        item._id.slice(1).toLowerCase(),
      value: item.count,
    })) || [];
    
  const customerStats = {
    totalCustomers: data?.summary?.totalCustomers, // ✅ from backend pagination count
    totalRevenue: data?.summary?.totalPrice, // installed machines
    totalStates: data?.summary?.totalStates,
    totalCities: data?.summary?.totalCities,
    state: data?.analytics.states,
    city: data?.analytics.cities,
  };
  return (
    <>
      <div className="flex justify-between items-center  pt-4 pl-4 pr-4">
        <div>
          <h1 className="font-bold text-2xl text-black">
            Customer Analytics Dashboard
          </h1>
          <p className="text-md">Water Ionizer Management System Overview</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddSidebar(true)}>
          <IoIosAdd size={22} />
          Add Customer
        </Button>
      </div>

      <div className="grid grid-cols-12 grid-rows-[auto_auto_auto] gap-4 p-4">
        <div className="col-span-12">
          <CustomerAnalytics {...customerStats} />
        </div>
        {/* Row 2: 30% / 70% split */}
        <div className="col-span-4 customer-grid-col">
          <AmcPieChart pieData={pieData} />
        </div>
        <div className="col-span-8 customer-grid-col">
          <ModelBarChat barData={barData} />
        </div>

        {/* Row 3: 3 equal columns */}
        <div className="col-span-8 customer-grid-col">
          <WaterMethod waterMethodData={waterMethodData} />
        </div>
        <div className="col-span-4 customer-grid-col">
          <WaterTypeChart waterType={WaterType} />
        </div>


        <div className="col-span-4 customer-grid-col">
          <Warranty />
        </div>
      </div>

      <br />
      <br />

      <Offcanvas
        show={showAddSidebar}
        onClose={() => setShowAddSidebar(false)}
        title="Add Customer"
      >
        <div className="p-4">
          <AddCustomer onClose={() => setShowAddSidebar(false)} />
        </div>
      </Offcanvas>
    </>
  );
};

export default Page;
