"use client";

import Link from "next/link";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ModelBarChart: React.FC<{ barData: any[] }> = ({ barData }) => {
  const CustomBar: React.FC<any> = (props) => {
    const { x, y, width, height, payload, model="model" } = props;

    const url = `/customer/${encodeURIComponent(model)}=${encodeURIComponent(payload.name)}`;

    return (
      <Link href={url}>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="#008ac7"
          style={{ cursor: "pointer" }}
        />
      </Link>
    );
  };

  return (
    <div>
      <h1 className="text-sm mb-4">Machine Model Analytics</h1>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={barData}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="value"
            barSize={30}
            shape={<CustomBar />} // use the custom bar shape
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ModelBarChart;
