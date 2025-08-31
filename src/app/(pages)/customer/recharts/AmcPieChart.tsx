import { useRouter } from 'next/navigation';
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const AMC_COLORS: Record<string, string> = {
  SERVICE_AMC: "#0088FE",
  SERVICE_FILTER_AMC: "#00C49F",
  COMPREHENSIVE_AMC: "#FFBB28",
  UNKNOWN: "#FF8042",
};

const RADIAN = Math.PI / 180;

interface PieLabelProps {
  cx: number;
  cy: number;
  midAngle?: number;
  outerRadius: number;
  percent?: number;
  name?: string;
  index?: number;
}

const AmcPieChart: React.FC<{ pieData: any[] }> = ({ pieData }) => {
  const router = useRouter();

  const handleBarClick = (data: any) => {
    if (data?.name) {
      const amc = "amc";
      const url = `/customer/${encodeURIComponent(amc)}=${encodeURIComponent(data.name)}`;
      router.push(url);
    }
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    name,
    index,
  }: PieLabelProps) => {
    const radius = outerRadius + 20; // push labels outside
    const x = cx + radius * Math.cos(-midAngle! * RADIAN);
    const y = cy + radius * Math.sin(-midAngle! * RADIAN);

    // Get slice color (fallback to gray if not found)
    const color = AMC_COLORS[name || ""] || "#555";

    return (
      <text
        x={x}
        y={y}
        fill={color} // 👈 label color same as slice
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        transform={`rotate(10, ${x}, ${y})`} // 👈 tilt labels 90°
      >
        {`${name} ${(percent! * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h1 className="text-md mb-4">Customer AMC Analytics</h1>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            onClick={handleBarClick}
            cursor="pointer"
            labelLine={true}                 // 👈 leader line enabled
            label={renderCustomizedLabel}    // 👈 custom label
            outerRadius={70}
            dataKey="value"
          >
            {pieData.map((entry) => (
              <Cell
                key={entry.name}
                fill={AMC_COLORS[entry.name] || "#ccc"}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AmcPieChart;
