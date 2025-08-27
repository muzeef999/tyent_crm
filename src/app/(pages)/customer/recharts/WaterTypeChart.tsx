import React from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f"];

const WaterTypeChart: React.FC<{ waterType: any[] }> = ({ waterType }) => {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <h1 className="text-sm mb-4">Water Type</h1>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="20%"
          outerRadius="90%"
          barSize={20}
          data={waterType}
        >
          <RadialBar
            
            background
            cornerRadius={10}
            dataKey="value"
            label={{ position: "insideStart", fill: "#fff" }}
          >
            {waterType.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </RadialBar>
          <Legend />
          <Tooltip />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WaterTypeChart;
