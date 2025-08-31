import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const getPath = (x: any, y: any, width: any, height: any) => {
  return `M${x},${y + height}
    C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
    ${x + width / 2},${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height}
    ${x + width},${y + height}
    Z`;
};

const TriangleBar = (props: any) => {
  const { fill, x, y, width, height } = props;
  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

const Warranty: React.FC<{ warranty: { name: string; value: number }[] }> = ({
  warranty,
}) => {
  const colors = [
    "#FF6B6B",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#FFA94D",
    "#4DABF7",
    "#51CF66",
  ];

  return (
    <div style={{ width: "100%", height: 350 }}>
      <h2>Warranty Data</h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={warranty}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="value"
            shape={<TriangleBar />}
            label={{ position: "top", fill: "#333", fontSize: 12 }}
          >
            {warranty.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Warranty;
