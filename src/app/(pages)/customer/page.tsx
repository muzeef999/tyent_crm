"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getCustomerAnalysis } from "@/services/serviceApis";
import { CustomerAnalyticsResponse } from "@/types/customer";
import AmcPieChart from "./recharts/AmcPieChart";
import ModelBarChat from "./recharts/ModelBarChat";
import Warranty from "./recharts/Warranty";
import WaterMethod from "./recharts/WaterMethod";
import CustomerAnalytics from "./CustomerAnalytics";
import WaterTypeChart from "./recharts/WaterTypeChart";
import dynamic from "next/dynamic";
const CustomerSkeltom = dynamic(() => import("@/components/skeleton/CustomerDashboard"),{  ssr:false})


const Page: React.FC = () => {
 
  const { data, isLoading, error } = useQuery<CustomerAnalyticsResponse>({
    queryKey: ["customers"],
    queryFn: () => getCustomerAnalysis(),
  });

  


  if (isLoading) return  <div className="p-4  h-100vh"> 
      <CustomerSkeltom />
    </div>;
  if (error) return <div className="text-red-500">Error loading data</div>;

  // Transform AMC data for PieChart
  const pieData =
    data?.analytics.amc.map((item) => ({
      name:item._id,
      value: item.count,
    })) || [];

  const barData =
    data?.analytics.model.map((item) => ({
      name: item._id, 
      value: item.count,
    })) || []; 

  const waterMethodData =
    data?.analytics.waterMethod.map((item) => ({
      name:item._id,
      value: item.count,
    })) || [];

    const WaterType =
      data?.analytics.waterType.map((item) => ({
        name:item._id,
        value: item.count,
      })) || [];

      const Warrantyd = data?.analytics.warranty.map((item) => ({
        name: item._id,
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
        <div className="col-span-12 customer-grid-col">
          <WaterMethod waterMethodData={waterMethodData} />
        </div>


        <div className="col-span-8 customer-grid-col">
          <Warranty  warranty = {Warrantyd}/>
        </div>

        <div className="col-span-4 customer-grid-col">
          <WaterTypeChart waterType={WaterType} />
        </div>


      </div>

      <br />
      <br />

    </>
  );
};

export default Page;
