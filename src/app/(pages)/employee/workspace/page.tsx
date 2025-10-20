"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createPayment, employeAssignTask, updateService } from "@/services/serviceApis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import TypeSearch from "@/components/TypeSearch";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import { FiUser, FiHash, FiClipboard, FiCalendar, FiPhone } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import CustomDropdown from "@/components/ui/CustomDropdown";
import Cookies from "js-cookie";

const STATUS_OPTIONS = [
  { label: "Pending", value: "PENDING" },
  { label: "Ongoing", value: "ONGOING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Closed", value: "CLOSED" },
];

const PAYMENT_MODES = [
  { label: "CASH", value: "CASH" },
  { label: "CARD", value: "CARD" },
  { label: "UPI", value: "UPI" },
  { label: "NET BANKING", value: "NET_BANKING" },
];

const SERVICE_OPTIONS = [
  { label: "General Service(₹500)", value: "GENERAL_SERVICE" },
  { label: "Paid Service(₹800)", value: "PAID_SERVICE" },
  { label: "In Warranty Breakdown(₹0)", value: "IN_WARRANTY_BREAKDOWN" },
  { label: "Filter Replacement(₹300)", value: "FILTER_REPLACEMENT" },
  { label: "Installation(₹700)", value: "INSTALLATION" },
  { label: "Re-Installation(₹600)", value: "RE_INSTALLATION" },
  { label: "Feasibility(₹200)", value: "FEASIBILITY" },
  { label: "Spare Part Replacement(₹400)", value: "SPARE_PART_REPLACEMENT" },
  { label: "Deep Cleaning(₹900)", value: "DEEP_CLEANING" },
  { label: "SPMS+ Replacement(₹500)", value: "SPMS_PLUS_REPLACEMENT" },
  { label: "Jogdial Replacement(₹350)", value: "JOGDIAL_REPLACEMENT" },
  { label: "Display Replacement(₹600)", value: "DISPLAY_REPLACEMENT" },
  { label: "PH Level Not Stable(₹450)", value: "PH_LEVEL_NOT_STABLE" },
  { label: "Unpleasant Water Taste(₹250)", value: "UNPLEASANT_WATER_TASTE" },
  { label: "Touch Panel Unresponsive(₹300)", value: "TOUCH_PANEL_UNRESPONSIVE" },
  { label: "RO System Malfunctioning(₹1000)", value: "RO_SYSTEM_MALFUNCTIONING" },
  { label: "Pressure Tank Not Functioning(₹700)", value: "PRESSURE_TANK_NOT_FUNCTIONING" },
];

const SERVICE_PRICES: Record<string, number> = {
  GENERAL_SERVICE: 500,
  PAID_SERVICE: 800,
  IN_WARRANTY_BREAKDOWN: 0,
  FILTER_REPLACEMENT: 300,
  INSTALLATION: 700,
  RE_INSTALLATION: 600,
  FEASIBILITY: 200,
  SPARE_PART_REPLACEMENT: 400,
  DEEP_CLEANING: 900,
  SPMS_PLUS_REPLACEMENT: 500,
  JOGDIAL_REPLACEMENT: 350,
  DISPLAY_REPLACEMENT: 600,
  PH_LEVEL_NOT_STABLE: 450,
  UNPLEASANT_WATER_TASTE: 250,
  TOUCH_PANEL_UNRESPONSIVE: 300,
  RO_SYSTEM_MALFUNCTIONING: 1000,
  PRESSURE_TANK_NOT_FUNCTIONING: 700,
};

const Page = () => {
  const { user } = useAuth();
  const id = user?.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedTab, setSelectedTab] = useState("PENDING");
  const [editableServiceId, setEditableServiceId] = useState<string | null>(null);
  const [statusValue, setStatusValue] = useState("");
  const [serviceType, setServiceType] = useState<{ label: string; value: string }[]>([]);
  const [notes, setNotes] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH"); // default payment mode
  const [editOpen, setEditOpen] = useState(true);

  const { data, isLoading, error } = useQuery({
    queryKey: ["employeAssignTask", id],
    queryFn: () => employeAssignTask(id as string),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: ({ id, updatedFields }: { id: string; updatedFields: Record<string, any> }) => updateService(id, updatedFields),
    onSuccess: () => {
      toast.success("Updated Successfully 🎉");
      queryClient.invalidateQueries({ queryKey: ["employeAssignTask", id] });
      setEditableServiceId(null);
    },
    onError: () => toast.error("Update failed ❌"),
  });

  const paymentMutation = useMutation({
    mutationFn: (paymentData: any) => createPayment(paymentData),
    onSuccess: () => {
      toast.success("Payment recorded successfully 💰");
      queryClient.invalidateQueries({ queryKey: ["employeAssignTask", id] });
    },
    onError: () => toast.error("Payment failed ❌"),
  });

  if (!id)
    return <div className="text-center text-gray-500 mt-10">No employee ID found</div>;
  if (isLoading) return <div className="text-center mt-10 animate-pulse">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">Error fetching data</div>;

  const employee = data?.message;
  const filteredServices = employee?.assignedServices?.filter((s: any) => s.status === selectedTab);

  const totalPrice = (services: { label: string; value: string }[]) =>
    services.reduce((sum, s) => sum + (SERVICE_PRICES[s.value] || 0), 0);

  const handleSaveClick = (service: any) => {
    mutation.mutate({
      id: service._id,
      updatedFields: {
        status: statusValue,
        serviceType: serviceType.map((s) => s.value),
        notes,
      },
    });
  };

  const handlePayment = (service: any) => {
    const amount = totalPrice(serviceType.length ? serviceType : service.serviceType.map((v: string) => ({ value: v, label: v })));
    paymentMutation.mutate({
      customerId: service.customerId._id,
      serviceId: service._id,
      amount,
      modeOfPayment: paymentMode,
      pendingAmount: 0,
      status: "PAID",
      invoiceNumber: `INV-${Date.now()}`,
    });
  };

  const handleLogout = async () => {
    try {
      Cookies.remove("token");
      toast.success("Logged out successfully");
      router.push("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center shadow-sm bg-white p-4 rounded-xl mb-6">
          <div>
            <h1 className="font-semibold text-2xl text-black">
              Hello, {user?.customer || "Employee"}
            </h1>
            <p className="text-sm text-gray-500">{user?.designation}</p>
          </div>
          <div className="flex-1 mx-6 min-w-[300px]">
            <TypeSearch
              onSearch={() => {}}
              placeHolderData="🔍 Search customer by contact/email/serial..."
            />
          </div>
          <Button variant="primary" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto">
          {STATUS_OPTIONS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedTab(tab.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                selectedTab === tab.value
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white border text-gray-700 hover:bg-blue-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredServices?.length ? (
            filteredServices.map((service: any) => (
              <div
                key={service._id}
                className="bg-white relative rounded-xl p-5 shadow hover:shadow-lg transition"
              >
                {/* Edit Icon */}
                <div className="absolute bg-primary top-2 right-2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700">
                  {editOpen ? (
                    <CiEdit
                      className="text-white"
                      size={20}
                      onClick={() => {
                        setEditableServiceId(service._id);
                        setServiceType(
                          service.serviceType.map((v: string) => ({
                            label: SERVICE_OPTIONS.find((s) => s.value === v)?.label || v,
                            value: v,
                          }))
                        );
                        setNotes(service.notes || "");
                        setStatusValue(service.status);
                        setEditOpen(true);
                      }}
                    />
                  ) : (
                    <MdOutlineCancel
                      className="text-white"
                      onClick={() => setEditOpen(true)}
                      size={20}
                    />
                  )}
                </div>

                {/* Customer Info */}
                <div className="flex items-center gap-2 mb-2">
                  <FiUser className="text-gray-500" />
                  <span className="font-medium">Customer:</span>{" "}
                  {service.customerId.name}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <FiPhone className="text-gray-500" />
                  <span className="font-medium">Phone:</span>
                  <a
                    href={`tel:${service.customerId.contactNumber}`}
                    className="text-blue-600 hover:underline"
                  >
                    {service.customerId.contactNumber}
                  </a>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <FiHash className="text-gray-500" />
                  <span className="font-medium">Serial:</span>{" "}
                  {service.customerId.serialNumber}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <FiClipboard className="text-gray-500" />
                  <span className="font-medium">Visit No:</span>{" "}
                  {service.visitNo}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <FiCalendar className="text-gray-500" />
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(service.serviceDate).toLocaleString()}
                </div>

                {/* Editable Mode */}
                {editableServiceId === service._id ? (
                  <div className="space-y-3 mt-3">
                    <CustomDropdown
                      label="Service Type"
                      id="serviceType"
                      options={SERVICE_OPTIONS}
                      selectedValue={serviceType.map((s) => s.value)}
                      multi
                      onSelect={(value) => {
                        const valuesArray = Array.isArray(value) ? value : [value];
                        setServiceType(
                          valuesArray.map((v) => {
                            const strV = String(v);
                            return {
                              label:
                                SERVICE_OPTIONS.find((s) => s.value === strV)?.label || strV,
                              value: strV,
                            };
                          })
                        );
                      }}
                    />

                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes..."
                      className="w-full border rounded-lg p-2 text-sm resize-none"
                    />

                    <div className="text-gray-600 text-sm">
                      Total Price:{" "}
                      <span className="font-semibold text-green-600">
                        ₹{totalPrice(serviceType)}
                      </span>
                    </div>

                    <CustomDropdown
                      label="Status"
                      id="statusValue"
                      options={STATUS_OPTIONS}
                      selectedValue={statusValue}
                      onSelect={(value) => {
                        if (Array.isArray(value)) {
                          setStatusValue(String(value[0] ?? ""));
                        } else {
                          setStatusValue(String(value));
                        }
                      }}
                    />

                    <CustomDropdown
                      label="Payment Mode"
                      id="paymentMode"
                      options={PAYMENT_MODES}
                      selectedValue={paymentMode}
                      onSelect={(value) => setPaymentMode(String(value))}
                    />

                    <Button
                      variant="primary"
                      onClick={() => {
                        handleSaveClick(service);
                        handlePayment(service);
                      }}
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Service Type:</span>{" "}
                      {service.serviceType.join(", ")}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Notes:</span>{" "}
                      {service.notes || "—"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Total:</span> ₹
                      {totalPrice(serviceType)}
                    </p>
                    <div className="mt-3">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-medium ${
                          service.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : service.status === "ONGOING"
                            ? "bg-blue-100 text-blue-700"
                            : service.status === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : service.status === "CANCELLED"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {service.status}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-2">
              No services found under “{selectedTab}”
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
