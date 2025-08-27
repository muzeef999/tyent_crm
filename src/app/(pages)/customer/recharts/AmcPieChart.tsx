import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";


const AMC_COLORS: Record<string, string> = {
  Service_amc: "#0088FE",
  Service_filter_amc: "#00C49F",
  Comprehensive_amc: "#FFBB28",
  Unknown: "#FF8042",
};


const AmcPieChart: React.FC<{ pieData: any[] }> = ({ pieData }) => {
  return (
    
    <div style={{ width: "100%", height: 300 }}>
      <h1 className="text-md  mb-4">Customer AMC Analytics</h1>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent! * 100).toFixed(0)}%`
            }
            outerRadius={100}
            dataKey="value"
          >
            {pieData.map((entry) => (
              <Cell key={entry.name} fill={AMC_COLORS[entry.name] || "#ccc"} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

    </div>
  )
}

export default AmcPieChart