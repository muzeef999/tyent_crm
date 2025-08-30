import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ServiceTypeChart: React.FC<{ ServiceType: { type: string; count: number }[] }> = ({
  ServiceType,
}) => {
  console.log("ServiceType data:", ServiceType);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h1 className="text-sm mb-4">Service Type</h1>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={ServiceType}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#008ac7" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#008ac7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#008ac7"
            fillOpacity={0.5}
            fill="url(#colorValue)"
            connectNulls={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ServiceTypeChart;
