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

const WaterTypeChart: React.FC<{ waterType: { name: string; value: number }[] }> = ({ waterType }) => {
  const renderLegend = () => {
    return (
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {waterType.map((entry, index) => (
          <li key={entry.name} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                display: "inline-block",
                width: 12,
                height: 12,
                backgroundColor: COLORS[index % COLORS.length],
              }}
            />
            <span>{entry.name}</span>
          </li>
        ))}
      </ul>
    );
  };

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
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </RadialBar>
          <Legend content={renderLegend} />
          <Tooltip />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WaterTypeChart;
