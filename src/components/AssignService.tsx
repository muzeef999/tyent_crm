import React, { useState } from "react";

type AssignedServiceProp = {
  onClose: () => void;
  onSubmit: (formData: any) => void; // You’ll connect this to your useMutation
};

const AssignService: React.FC<AssignedServiceProp> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    visitNo: "",
    serviceDate: "",
    nextDueDate: "",
    notes: "",
    paymentIds: "",
    assignedDate: "",
    closingDate: "",
    serviceType: [],
    employeeId: "",
  });

  // Handle change for normal inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle multi-select change for serviceType
  const handleServiceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    // setFormData((prev) => ({ ...prev, serviceType: selected }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert comma-separated paymentIds into array
    const payload = {
      ...formData,
      visitNo: formData.visitNo ? Number(formData.visitNo) : undefined,
      paymentIds: formData.paymentIds
        ? formData.paymentIds.split(",").map((id) => id.trim())
        : [],
    };
    onSubmit(payload); // You’ll pass your mutation call here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label>Visit No</label>
        <input
          type="number"
          name="visitNo"
          value={formData.visitNo}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Service Date</label>
        <input
          type="date"
          name="serviceDate"
          value={formData.serviceDate}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Next Due Date</label>
        <input
          type="date"
          name="nextDueDate"
          value={formData.nextDueDate}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Payment IDs (comma separated)</label>
        <input
          type="text"
          name="paymentIds"
          placeholder="id1,id2,id3"
          value={formData.paymentIds}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Assigned Date</label>
        <input
          type="date"
          name="assignedDate"
          value={formData.assignedDate}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Closing Date</label>
        <input
          type="date"
          name="closingDate"
          value={formData.closingDate}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Service Type</label>
        <select
          name="serviceType"
          multiple
          value={formData.serviceType}
          onChange={handleServiceTypeChange}
        >
          <option value="GENERAL_SERVICE">General Service</option>
          <option value="PAID_SERVICE">Paid Service</option>
          <option value="IN_WARRANTY_BREAKDOWN">In Warranty Breakdown</option>
          <option value="FILTER_REPLACEMENT">Filter Replacement</option>
          <option value="INSTALLATION">Installation</option>
          <option value="RE_INSTALLATION">Re-Installation</option>
          <option value="FEASIBILITY">Feasibility</option>
          <option value="SPARE_PART_REPLACEMENT">Spare Part Replacement</option>
          <option value="DEEP_CLEANING">Deep Cleaning</option>
          <option value="SPMS_PLUS_REPLACEMENT">SPMS Plus Replacement</option>
          <option value="JOGDIAL_REPLACEMENT">Jogdial Replacement</option>
          <option value="DISPLAY_REPLACEMENT">Display Replacement</option>
        </select>
      </div>

      <div>
        <label>Employee ID</label>
        <input
          type="text"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-2">
        <button type="submit">Assign / Update Service</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AssignService;
