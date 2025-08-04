import mongoose from "mongoose";
const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    amount: { type: Number },
    modeOfPayment: { type: String },
    receivedDate: { type: Date },
    pendingAmount: { type: String },
    status: { type: String }, // PAID / PARTIALLY / PENDING
    remarks: { type: String },
    invoiceNumber: { type: String },
  },
  { timestamps: { createdAt: "createDate", updatedAt: false } }
);

const payments =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default payments;
