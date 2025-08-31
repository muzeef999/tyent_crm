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

const WaterMethod: React.FC<{ waterMethodData: any[] }> = ({
  waterMethodData,
}) => {
  return (
    <div style={{ width: "100%", height: 410 }}>
      <h1 className="text-sm mb-4">Water Method</h1>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={waterMethodData}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 90,
          }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#008ac7" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#008ac7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" interval={0} tick={(props) => {
              const { x, y, payload } = props;
              return (
                <text
                  x={x}
                  y={y + 10} // move down a little
                  textAnchor="end"
                  transform={`rotate(-30, ${x}, ${y + 10})`}
                  fontSize={12}
                >
                  {payload.value}
                </text>
              );
            }} />
          <YAxis  />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#008ac7"
            fillOpacity={0.5}
            fill="url(#colorValue)"
            connectNulls={true} // makes sure gaps don’t break the area
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WaterMethod;
