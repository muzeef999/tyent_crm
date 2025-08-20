import mongoose from "mongoose";
const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    name: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    price: { type: Number, required: true },
    payments: [{ type: Schema.Types.ObjectId, ref: "Payment" }],
    invoiceNumber: { type: String, required: true },
    serialNumber: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    warrantyYears: { type: String },
    amcRenewed: {
      type: String,
      enum: ["SERVICE_AMC", "SERVICE_FILTER_AMC", "COMPREHENSIVE_AMC"],
    },
    serviceHistory: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    upcomingServices: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    remarks: { type: String },
    DOB: { type: Date },
    installedBy: { type: Schema.Types.ObjectId, ref: "Employee" },
    marketingManager: { type: Schema.Types.ObjectId, ref: "Employee" },
    R0: { type: Boolean },
    pressureTank: { type: Boolean },
  },
  { timestamps: true }
);

export default mongoose.models.Customer ||
  mongoose.model("Customer", customerSchema);
