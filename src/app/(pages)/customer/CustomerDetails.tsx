"use client";

import { getCustomerInDetail } from "@/services/serviceApis";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

interface Service {
  _id: string;
  visitNo: number;
  serviceDate: string | Date;
  serviceType: string[];
  status: string;
  updatedAt:string | Date;
}

interface CustomerDetailsProps {
  customerId: string;
}

const CustomerDetails = ({ customerId }: CustomerDetailsProps) => {
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["customerInDetails", customerId],
    queryFn: () => getCustomerInDetail(customerId),
    enabled: !!customerId,
  });

  if (isLoading)
    return (
      <div className="p-6 text-center text-gray-500">
        Loading customer info...
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-600">
        Error loading customer data
      </div>
    );

  const customer = response?.message;

  // Directly use API arrays
  const upcomingServices: Service[] = customer?.upcomingServices || [];
  const pastServices: Service[] =
    customer?.completedServices || customer?.serviceHistory || [];

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* ========== 🧾 BASIC INFO ========== */}
      <section className="border rounded-xl shadow-lg bg-white overflow-hidden">
        <div className="bg-primary text-white px-6 py-3 text-lg font-semibold">
          👤 Customer Info
        </div>
        <div className="p-6 grid grid-cols-2 gap-4 text-sm text-gray-700">
          <p>
            <strong>Name:</strong> {customer?.name}
          </p>
          <p>
            <strong>Contact:</strong> {customer?.contactNumber}
          </p>
          <p>
            <strong>Email:</strong> {customer?.email || "—"}
          </p>
          <p>
            <strong>Model:</strong> {customer?.serialNumber?.name || "—"}
          </p>
          <p>
            <strong>Invoice No:</strong> {customer?.invoiceNumber}
          </p>
          <p>
            <strong>Price:</strong> ₹{customer?.price}
          </p>
          <p>
            <strong>AMC:</strong>{" "}
            <span
              className={
                customer?.amcRenewed === "YES"
                  ? "text-green-600 font-medium"
                  : "text-red-500 font-medium"
              }
            >
              {customer?.amcRenewed || "—"}
            </span>
          </p>
          <p>
            <strong>Warranty:</strong> {customer?.warrantyYears} year(s)
          </p>
          <p>
            <strong>Installed By:</strong> {customer?.installedBy?.name || "—"}
          </p>
          <p>
            <strong>Sales Manager:</strong>{" "}
            {customer?.marketingManager?.name || "—"}
          </p>
          <p>
            <strong>DOB:</strong>{" "}
            {customer?.DOB
              ? format(new Date(customer.DOB), "dd MMM yyyy")
              : "—"}
          </p>
        </div>
        <div className="px-6 pb-6 space-y-2 text-gray-700 text-sm">
          <p>
            <strong>Address:</strong> {customer?.address || "—"}
          </p>
          <p>
            <strong>Remarks:</strong> {customer?.remarks || "—"}
          </p>
          <p>
            <strong>Purchased on:</strong>{" "}
            {customer?.purchaseDate
              ? format(new Date(customer.purchaseDate), "dd MMM yyyy")
              : "—"}
          </p>
        </div>
      </section>

     {/* ========== 🔧 UPCOMING SERVICES ========== */}
<section className="border rounded-xl shadow-lg bg-white overflow-hidden">
  <div className="bg-primary text-white px-6 py-3 text-lg font-semibold">
    📅 Upcoming Services
  </div>
  <div className="overflow-x-auto">
    {upcomingServices.length === 0 ? (
      <p className="text-gray-500 text-sm">No upcoming services scheduled.</p>
    ) : (
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Visit
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Service Date
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Service  Status
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Service  Type
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {upcomingServices.map((service: Service) => (
            <tr key={service._id}>
              <td className="px-4 py-2 text-gray-800 font-medium">
                Visit #{service.visitNo}
              </td>
              <td className="px-4 py-2 text-gray-500">
                {format(new Date(service.serviceDate), "dd MMM yyyy")}
              </td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    service.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : service.status === "ONGOING"
                      ? "bg-blue-100 text-blue-800"
                      : service.status === "COMPLETED"
                      ? "bg-green-100 text-green-800"
                      : service.status === "CANCELLED"
                      ? "bg-red-100 text-red-800"
                      : service.status === "CLOSED"
                      ? "bg-gray-200 text-gray-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {service.status}
                </span>
              </td>
              <td className="px-4 py-2 text-gray-600">
                {service.serviceType.join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
</section>

{/* ========== 🛠️ SERVICE HISTORY ========== */}
<section className="border rounded-xl shadow-lg bg-white overflow-hidden">
  <div className="bg-primary text-white px-6 py-3 text-lg font-semibold">
    🕓 Service History
  </div>
  <div className="overflow-x-auto">
    {pastServices.length === 0 ? (
      <p className="text-gray-500 text-sm">No past services found.</p>
    ) : (
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Visit
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Service Date
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Completed Date
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
             Service Status
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Service  Type
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {pastServices.map((history: Service) => (
            <tr key={history._id}>
              <td className="px-4 py-2 text-gray-800 font-medium">
                Visit #{history.visitNo}
              </td>
              <td className="px-4 py-2 text-gray-500">
                {format(new Date(history.serviceDate), "dd MMM yyyy")}
              </td>
              <td className="px-4 py-2 text-gray-500">
                {format(new Date(history.updatedAt || history.serviceDate), "dd MMM yyyy")}
              </td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    history.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : history.status === "ONGOING"
                      ? "bg-blue-100 text-blue-800"
                      : history.status === "COMPLETED"
                      ? "bg-green-100 text-green-800"
                      : history.status === "CANCELLED"
                      ? "bg-red-100 text-red-800"
                      : history.status === "CLOSED"
                      ? "bg-gray-200 text-gray-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {history.status}
                </span>
              </td>
              <td className="px-4 py-2 text-gray-600">
                {history.serviceType.join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>

      </section>
    </div>
  );
};

export default CustomerDetails;
