import { useRouter } from "next/navigation";
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

   const router = useRouter(); 

  const handleBarClick = (data: any) => {
    if (data?.name) {
      router.push(`customer/?model=${data.name}`);
    }
  };
  return (
    <div>
      <h1 className="text-sm  mb-4">Machine Model Analytics</h1>
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
          <Bar dataKey="value"
                fill="#008ac7"
                 barSize={30} 
                 onClick={handleBarClick} 
            cursor="pointer" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ModelBarChart;
