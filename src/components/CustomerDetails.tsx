// components/customer/CustomerDetails.tsx
import { Customer } from "@/types/customer";

const CustomerDetails = ({ customer }: { customer: Customer }) => {
  return (
    <div className="space-y-2">
      <p><strong>Name:</strong> {customer.name}</p>
      <p><strong>Contact:</strong> {customer.contactNumber}</p>
      <p><strong>Model:</strong> {customer.installedModel}</p>
      <p><strong>Invoice:</strong> {customer.invoiceNumber}</p>
      <p><strong>Price:</strong> ₹{customer.price}</p>
      <p>
        <strong>AMC:</strong>{" "}
        <span
          className={`${
            customer.amcRenewed === "YES" ? "text-green-500" : "text-red-500"
          }`}
        >
          {customer.amcRenewed}
        </span>
      </p>
      <p><strong>Installed By:</strong> {customer.installedBy}</p>
    </div>
  );
};

export default CustomerDetails;
