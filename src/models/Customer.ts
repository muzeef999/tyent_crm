import mongoose from "mongoose";
const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    name: { type: String, required: true },
    contactNumber: { type: String, required: true },
    alternativeNumber: { type: String },
    email: { type: String },
    address: { type: String },
    price: { type: Number, required: true },
    payments: [{ type: Schema.Types.ObjectId, ref: "Payment" }],
    invoiceNumber: { type: String, required: true },
    serialNumber: { type: Schema.Types.ObjectId, ref: "Product", required: true },
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
    waterType: {
      type: String,
      enum: [
        "RO_company",
        "RO_third-party",
        "Bore",
        "Municipal",
      ],
      required: true,
    },
    waterMethod: {
      type: String,
      enum: [
        "Direct",
        "Booster_company",
        "Booster_third-party",
        "Pressure_company",
        "Pressure_third-party",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Customer ||
  mongoose.model("Customer", customerSchema);
