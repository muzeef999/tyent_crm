// models/Balance.ts
import { Balance } from "@/types/customer";
import mongoose, { Schema } from "mongoose";



const BalanceSchema = new Schema<Balance>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  locationId: { type: Schema.Types.ObjectId, ref: "Location", required: true },
  qty: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Balance || mongoose.model<Balance>("Balance", BalanceSchema);
