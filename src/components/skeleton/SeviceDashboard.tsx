"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SeviceDashboard = () => {
  return (
    <div className="p-4 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <Skeleton height={30} width={220} /> {/* Title */}
          <Skeleton height={20} width={280} className="mt-2" /> {/* Subtitle */}
        </div>
        <Skeleton height={40} width={120} /> {/* Button */}
      </div>

      {/* Reports + Stats Section */}
      <div className="grid grid-cols-12 gap-4">
        {/* Reports (Left Side) */}
        <div className="col-span-12 md:col-span-4">
          <div className="p-4 bg-white rounded-lg shadow space-y-4">
            <Skeleton height={25} width="80%" />
            <Skeleton height={200} /> {/* Placeholder chart */}
          </div>
        </div>

        {/* Stats Cards (Right Side) */}
        <div className="col-span-12 md:col-span-8">
          {/* Top Info Row */}
          <div className="flex justify-between items-center pb-4">
            <Skeleton height={20} width={200} />
            <Skeleton height={25} width={100} />
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center"
              >
                <div>
                  <Skeleton height={15} width={120} />
                  <Skeleton height={25} width={60} className="mt-2" />
                </div>
                <Skeleton circle height={40} width={40} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section (Charts) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <Skeleton height={250} />
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <Skeleton height={250} />
        </div>
      </div>
    </div>
  );
};

export default SeviceDashboard;
