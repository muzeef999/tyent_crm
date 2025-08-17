import { getBalances } from "@/services/serviceApis";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import TableLoading from "../ui/TableLoading";
import { Balance } from "@/types/customer";

const Balances = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["balance"],
    queryFn: () => getBalances(),
  });

  const balanceData: Balance[] = data?.message || [];

  if (error) {
    return (
      <div className="text-red-600 p-4">Error: {getErrorMessage(error)}</div>
    );
  }
  return (
    <table className="min-w-[1000px] w-full customtable">
      <thead>
        <tr>
          <th>Product</th>
          <th>Location</th>
          <th>Quantity</th>
          <th>Updated At</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <TableLoading />
        ) : (
          <>
            {balanceData.map((item) => (
              <tr key={item._id}>
                <td>{item.productId}</td>
              </tr>
            ))}
          </>
        )}
      </tbody>
    </table>
  );
};

export default Balances;
