import React from "react";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

const CustomerDashboard = () => {
  return (
    <div className="p-4 space-y-4 rounded-lg">

      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 bg-white rounded-lg shadow">
            <Skeleton height={20} width={80} />
            <Skeleton height={30} width={120} className="mt-2" />
            <Skeleton height={20} width={100} className="mt-2" />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        
        {/* Pie Chart */}
        <div className="p-4 bg-white rounded-lg shadow">
          <Skeleton circle={true} height={120} width={120} />
          <div className="mt-2 space-y-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} height={15} width={100} />
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="p-4 bg-white rounded-lg shadow">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} height={20} width={`80%`} className="mb-2" />
          ))}
        </div>
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <Skeleton height={200} />
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <Skeleton height={200} />
        </div>
      </div>

    </div>
  );
};

export default CustomerDashboard;
