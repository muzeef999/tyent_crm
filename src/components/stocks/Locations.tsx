import { getLocation } from "@/services/serviceApis";
import { Location } from "@/types/customer";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import TableLoading from "../ui/TableLoading";
import { useAuth } from "@/hooks/useAuth";
import TypeSearch from "../TypeSearch";
import { IoIosAdd } from "react-icons/io";
import Button from "../ui/Button";

const Locations = () => {
  const { data, isLoading, } = useQuery({
    queryKey: ["location"],
    queryFn: getLocation,
  });

  const [showAddSidebar, setShowAddSidebar] = useState(false);
    const [searchText, setSearchText] = useState("");
    

  const locationData: Location[] = data?.message || [];
  const { user }  = useAuth();
  return (
    <>
    
      <div className="flex justify-between items-center shadow-sm bg-white sha p-2 rounded-xl mb-4">
        <div>
          <h1 className="font-medium text-2xl text-black">
            Hello,{user?.customer}
          </h1>
          <p className="text-md">{user?.designation}</p>
        </div>

        <div>
          <div className="flex-1 min-w-[580px]">
            <TypeSearch onSearch={setSearchText} placeHolderData={"🔍 Search serial number"} />
          </div>
        </div>

        <Button variant="primary" onClick={() => setShowAddSidebar(true)}>
          <IoIosAdd size={22} />
          Add Product
        </Button>
      </div>
    
    <table className="min-w-[1000px] w-full customtable">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>City</th>
          <th>active</th>
          <th>Email</th>
          <th>Number</th>
          <th>Status</th>
          <th>Designation</th>
          <th>Updated At</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={8}>
              <TableLoading />
            </td>
          </tr>
        ) : (
          locationData.map((item) => (
            <tr key={item._id} className="border-t">
              <td className="p-2">{item?.employeeId?.name}</td>
              <td className="p-2">{item?.type}</td>
              <td className="p-2">{item?.city}</td>
              <td className="p-2">{item?.active}</td>
              <td className="p-2">{item?.employeeId?.email}</td>
              <td className="p-2">{item?.employeeId?.contactNumber}</td>
              <td className="p-2">{item?.employeeId?.status}</td>
              <td className="p-2">{item?.employeeId?.designation}</td>

              <td className="p-2">
                {new Date(item?.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
    </>
  );
};

export default Locations;
