"use client";

import { getCustomerInDetail } from "@/services/serviceApis";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

interface Service {
  _id: string;
  visitNo: number;
  serviceDate: string | Date;
  serviceType: string[];
}

interface CustomerDetailsProps {
  customerId: string;
}

const CustomerDetails = ({ customerId }: CustomerDetailsProps) => {
  const { data: response, isLoading, error } = useQuery({
    queryKey: ["customerInDetails", customerId],
    queryFn: () => getCustomerInDetail(customerId),
    enabled: !!customerId,
  });

  if (isLoading) return <div className="p-6 text-center text-gray-500">Loading customer info...</div>;
  if (error) return <div className="p-6 text-center text-red-600">Error loading customer data</div>;

  const customer = response?.message;

  // Today's date
  const today = new Date();

  // Filter upcoming and past services
  const upcomingServices: Service[] = customer?.upcomingServices?.filter(
    (service: Service) => new Date(service.serviceDate) >= today
  ) || [];

  const pastServices: Service[] = customer?.serviceHistory?.filter(
    (service: Service) => new Date(service.serviceDate) < today
  ) || [];

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* ========== 🧾 BASIC INFO ========== */}
      <section className="border rounded-xl shadow-lg bg-white overflow-hidden">
        <div className="bg-primary text-white px-6 py-3 text-lg font-semibold">
          👤 Customer Info
        </div>
        <div className="p-6 grid grid-cols-2 gap-4 text-sm text-gray-700">
          <p><strong>Name:</strong> {customer?.name}</p>
          <p><strong>Contact:</strong> {customer?.contactNumber}</p>
          <p><strong>Email:</strong> {customer?.email || "—"}</p>
          <p><strong>Model:</strong> {customer?.serialNumber?.name || "—"}</p>
          <p><strong>Invoice No:</strong> {customer?.invoiceNumber}</p>
          <p><strong>Price:</strong> ₹{customer?.price}</p>
          <p>
            <strong>AMC:</strong>{" "}
            <span className={customer?.amcRenewed === "YES" ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
              {customer?.amcRenewed || "—"}
            </span>
          </p>
          <p><strong>Warranty:</strong> {customer?.warrantyYears} year(s)</p>
          <p><strong>Installed By:</strong> {customer?.installedBy?.name || "—"}</p>
          <p><strong>Sales Manager:</strong> {customer?.marketingManager?.name || "—"}</p>
          <p>
            <strong>DOB:</strong>{" "}
            {customer?.DOB ? format(new Date(customer.DOB), "dd MMM yyyy") : "—"}
          </p>
        </div>
        <div className="px-6 pb-6 space-y-2 text-gray-700 text-sm">
          <p><strong>Address:</strong> {customer?.address || "—"}</p>
          <p><strong>Remarks:</strong> {customer?.remarks || "—"}</p>
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
        <div className="p-6">
          {upcomingServices.length === 0 ? (
            <p className="text-gray-500 text-sm">No upcoming services scheduled.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {upcomingServices.map((service: Service) => (
                <li key={service._id} className="py-3 flex flex-col md:flex-row md:justify-between md:items-center">
                  <span className="font-medium text-gray-800">Visit #{service.visitNo}</span>
                  <span className="text-gray-500">{format(new Date(service.serviceDate), "dd MMM yyyy")}</span>
                  <div className="text-gray-600 mt-1 md:mt-0">{service.serviceType.join(", ")}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ========== 🛠️ SERVICE HISTORY ========== */}
      <section className="border rounded-xl shadow-lg bg-white overflow-hidden">
        <div className="bg-primary text-white px-6 py-3 text-lg font-semibold">
          🕓 Service History
        </div>
        <div className="p-6">
          {pastServices.length === 0 ? (
            <p className="text-gray-500 text-sm">No past services found.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {pastServices.map((history: Service) => (
                <li key={history._id} className="py-3 flex flex-col md:flex-row md:justify-between md:items-center">
                  <span className="font-medium text-gray-800">Visit #{history.visitNo}</span>
                  <span className="text-gray-500">{format(new Date(history.serviceDate), "dd MMM yyyy")}</span>
                  <div className="text-gray-600 mt-1 md:mt-0">{history.serviceType.join(", ")}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default CustomerDetails;
