"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = { waterMethodData: any[] };

const WaterMethod: React.FC<Props> = ({ waterMethodData }) => {
  const router = useRouter();

  const handleTickClick = (id?: string) => {
    if (!id) return;
    const url = `/customer/${encodeURIComponent("waterMethod")}=${encodeURIComponent(
      id
    )}`;

    // SPA navigation (recommended)
    router.push(url);

    // OR open in a new tab:
    // window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div style={{ width: "100%", height: 410 }}>
      <h1 className="text-sm mb-4">Water Method</h1>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={waterMethodData}
          margin={{ top: 10, right: 10, left: 0, bottom: 90 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#008ac7" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#008ac7" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            interval={0}
            // annotate props as any to avoid strict typing issues from recharts in TS
            tick={(props: any) => {
              const { x, y, payload } = props;
              // payload.value -> label shown on axis
              // payload.payload -> the full data object for that tick (so _id should be here)
              const id = payload?.payload?._id ?? payload?.value;

              return (
                <text
                  x={x}
                  y={y + 10}
                  textAnchor="end"
                  transform={`rotate(-30, ${x}, ${y + 10})`}
                  fontSize={12}
                  // ensure the SVG text accepts pointer events and shows pointer cursor
                  style={{
                    cursor: "pointer",
                    fill: "#008ac7",
                    pointerEvents: "all",
                    userSelect: "none",
                  }}
                  onClick={() => handleTickClick(id)}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleTickClick(id);
                  }}
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
            dataKey="value"
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

export default WaterMethod;
