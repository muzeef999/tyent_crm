import mongoose from "mongoose";
const { Schema } = mongoose;
import "./Customer";

const serviceSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    visitNo: { type: Number },
    serviceDate: { type: Date },
    nextDueDate: { type: Date },
    notes: { type: String },
    paymentIds: [{ type: Schema.Types.ObjectId, ref: "Payment" }],
    assignedDate: { type: Date },
    status: {
      type: String,
      enum: ["PENDING", "ONGOING", "COMPLETED", "CANCELLED", "CLOSED"],
      default: "PENDING", // optional, sets default status
    },
    closingDate: { type: Date },
    serviceType: [
      {
        type: String,
        enum: [
          "GENERAL_SERVICE",
          "PAID_SERVICE",
          "IN_WARRANTY_BREAKDOWN", 
          "FILTER_REPLACEMENT",
          "INSTALLATION",
          "RE_INSTALLATION",
          "FEASIBILITY",
          "SPARE_PART_REPLACEMENT",
          "DEEP_CLEANING",
          "SPMS_PLUS_REPLACEMENT",
          "JOGDIAL_REPLACEMENT",
          "DISPLAY_REPLACEMENT",
          "PH_LEVEL_NOT_STABLE",
          "UNPLEASANT_WATER_TASTE",
          "TOUCH_PANEL_UNRESPONSIVE",
          "RO_SYSTEM_MALFUNCTIONING",
          "PRESSURE_TANK_NOT_FUNCTIONING",
        ],
      },
    ],

    employeeId: { type: Schema.Types.ObjectId, ref: "Employee" },
  },
  { timestamps: true }
);


serviceSchema.index({ serviceDate: 1 });
serviceSchema.index({ status: 1 });
serviceSchema.index({ employeeId: 1 });

const Service =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);

export default Service;
