"use client";
import { getCustomerInDetail } from "@/services/serviceApis";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

const CustomerDetails = ({ customerId }: { customerId: string }) => {
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["customerInDetails", customerId],
    queryFn: () => getCustomerInDetail(customerId),
    enabled: !!customerId,
  });

  if (isLoading) return <div className="p-4">Loading customer info...</div>;
  if (error)
    return <div className="text-red-600 p-4">Error loading customer data</div>;

  const customer = response?.message;

  return (
    <div className="p-4 space-y-6">
      {/* ========== 🧾 BASIC INFO ========== */}
      <section className="border p-4 rounded-lg shadow-sm bg-white">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">
          👤 Customer Info
        </h2>
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
          <p>
            <strong>Name:</strong> {customer.name}
          </p>
          <p>
            <strong>Contact:</strong> {customer.contactNumber}
          </p>
          <p>
            <strong>Email:</strong> {customer.email || "—"}
          </p>
          <p>
            <strong>Model:</strong> {customer?.serialNumber?.name}
          </p>
          <p>
            <strong>Invoice No:</strong> {customer.invoiceNumber}
          </p>

          <p>
            <strong>Price:</strong> ₹{customer.price}
          </p>
          <p>
            <strong>AMC:</strong>{" "}
            <span
              className={
                customer.amcRenewed === "YES"
                  ? "text-green-600"
                  : "text-red-500"
              }
            >
              {customer.amcRenewed}
            </span>
          </p>
          <p>
            <strong>Warranty:</strong> {customer.warrantyYears} year(s)
          </p>
          <p>
            <strong>Installed By:</strong> {customer.installedBy?.name}
          </p>
          <p>
            <strong>Sales Manager:</strong> {customer.marketingManager?.name}
          </p>
          <p>
            <strong>DOB:</strong>{" "}
            {format(new Date(customer.DOB), "dd MMM yyyy")}
          </p>
        </div>
        <p className="mt-2">
          <strong>Address:</strong> {customer.address || "—"}
        </p>
        <p>
          <strong>Remarks:</strong> {customer.remarks}
        </p>
        <p>
          <strong>Purchased on:</strong> {format(new Date(customer.createdAt), "dd MMM yyyy")}
        </p>
      </section>

      {/* ========== 🔧 UPCOMING SERVICES ========== */}
      <section className="border p-4 rounded-lg shadow-sm bg-white">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">
          📅 Upcoming Services
        </h2>
        {customer.upcomingServices.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No upcoming services scheduled.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200 text-sm">
            {customer.upcomingServices.map((service: any) => (
              <li key={service._id} className="py-2">
                <div className="flex justify-between">
                  <span>Visit #{service.visitNo}</span>
                  <span>
                    {format(new Date(service.serviceDate), "dd MMM yyyy")}
                  </span>
                </div>
                <div className="text-gray-600 mt-1">
                  {service.serviceType.join(", ")}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ========== 🛠️ SERVICE HISTORY ========== */}
      <section className="border p-4 rounded-lg shadow-sm bg-white">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">
          🕓 Service History
        </h2>
        {customer.serviceHistory.length === 0 ? (
          <p className="text-gray-500 text-sm">No past services found.</p>
        ) : (
          <ul className="divide-y divide-gray-200 text-sm">
            {customer.serviceHistory.map((history: any, index: number) => (
              <li key={index} className="py-2">
                <div className="flex justify-between">
                  <span>Visit #{history.visitNo}</span>
                  <span>
                    {format(new Date(history.serviceDate), "dd MMM yyyy")}
                  </span>
                </div>
                <div className="text-gray-600 mt-1">
                  {history.serviceType.join(", ")}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default CustomerDetails;
