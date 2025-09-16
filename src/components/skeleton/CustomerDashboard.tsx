"use client";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CustomerDashboard = () => {
  return (
    <div className="p-4 space-y-4 rounded-lg">

        {/* Header Section */}
            <div className="flex justify-between items-center">
              <div>
                <Skeleton height={30} width={220} /> {/* Title */}
                <Skeleton height={20} width={280} className="mt-2" /> {/* Subtitle */}
              </div>
              <Skeleton height={40} width={120} /> {/* Button */}
            </div>
            
      {/* Top Stats - CustomerAnalytics cards (4 cards row) */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-xl p-4 w-full bg-white border border-gray-200 shadow-md"
          >
            <div className="flex justify-between items-center">
              <Skeleton height={15} width={100} /> {/* title */}
              <Skeleton circle height={28} width={28} /> {/* icon */}
            </div>
            <Skeleton height={30} width={120} className="mt-4" /> {/* value */}
            <Skeleton height={35} className="mt-4" /> {/* dropdown/date */}
          </div>
        ))}
      </div>

      {/* Row 2: Pie (col-span-4) + Bar (col-span-8) */}
      <div className="grid grid-cols-12 gap-4 mt-6">
        <div className="col-span-4 customer-grid-col p-4 bg-white rounded-lg shadow">
          {/* Pie Skeleton */}
          <div className="flex flex-col items-center justify-center">
            <Skeleton circle height={160} width={160} />
            <div className="mt-4 space-y-2 w-full flex flex-col items-center">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} height={12} width={100} />
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-8 customer-grid-col p-4 bg-white rounded-lg shadow">
          {/* Bar Skeleton */}
          <div className="flex flex-col justify-center">
            {[...Array(8)].map((_, i) => (
              <Skeleton
                key={i}
                height={20}
                width={`${70 + Math.random() * 25}%`}
                className="mb-3"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Full width WaterMethod */}
      <div className="grid grid-cols-12 gap-4 mt-6">
        <div className="col-span-12 customer-grid-col p-4 bg-white rounded-lg shadow">
          <Skeleton height={250} /> {/* placeholder for WaterMethod chart */}
        </div>
      </div>

      {/* Row 4: Warranty (col-span-8) + WaterType (col-span-4) */}
      <div className="grid grid-cols-12 gap-4 mt-6">
        <div className="col-span-8 customer-grid-col p-4 bg-white rounded-lg shadow">
          <Skeleton height={250} /> {/* Warranty bar chart */}
        </div>
        <div className="col-span-4 customer-grid-col p-4 bg-white rounded-lg shadow">
          <div className="flex flex-col items-center justify-center">
            <Skeleton circle height={140} width={140} />
            <div className="mt-4 space-y-2 w-full flex flex-col items-center">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} height={12} width={90} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
