import mongoose from "mongoose";
const { Schema } = mongoose;


const paymentSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service" }, // NEW
    amount: { type: Number, required: true },
    modeOfPayment: { type: String, enum: ["CASH", "CARD", "UPI", "NET_BANKING"] },
    receivedDate: { type: Date, default: Date.now },
    pendingAmount: { type: Number, default: 0 }, // Change to number
    status: { type: String, enum: ["PAID", "PARTIALLY", "PENDING"], default: "PAID" },
    remarks: { type: String },
    invoiceNumber: { type: String, required: true },
  },
  { timestamps: { createdAt: "createDate", updatedAt: true } } // update updatedAt when you save
);

const payments =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default payments;
