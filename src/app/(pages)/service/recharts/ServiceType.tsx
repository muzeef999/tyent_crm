"use client";
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
import { useRouter } from "next/navigation";

const ServiceTypeChart: React.FC<{
  ServiceType: { type: string; count: number }[];
}> = ({ ServiceType }) => {
  const router = useRouter();

  const handleClick = (type: string) => {
    // Navigate with query string
    router.push(`/service/${encodeURIComponent(type)}`);
  };

  return (
    <div style={{ width: "100%", height: 410 }}>
      <h1 className="text-sm mb-4">Service Type</h1>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={ServiceType}
          margin={{ top: 10, right: 0, left: 0, bottom: 100 }}
        >
          <defs>
            <CartesianGrid strokeDasharray="3 3" />
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#008ac7" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#008ac7" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="type"
            interval={0}
            tick={(props) => {
              const { x, y, payload } = props;
              return (
                <text
                  x={x}
                  y={y + 10}
                  textAnchor="end"
                  transform={`rotate(-30, ${x}, ${y + 10})`}
                  fontSize={12}
                  style={{ cursor: "pointer", fill: "#008ac7" }}
                  onClick={() => handleClick(payload.value)}
                >
                  {payload.value}
                </text>
              );
            }}
          />

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
