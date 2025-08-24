// models/Movement.ts
import { Movement } from "@/types/customer";
import mongoose, { Schema,  } from "mongoose";


const MovementSchema = new Schema<Movement>({
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ["IN", "OUT", "TRANSFER", "ADJUST"], required: true },
  reason: { type: String, enum: ["PURCHASE","SALE","INSTALL","REPLACEMENT","DEMO_ASSIGN","DEMO_RETURN","SCRAP","PART_HARVEST","OPENING"], required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  qty: { type: Number, required: true },
  serialIds: [{ type: Schema.Types.ObjectId, ref: "Serial" }],
  fromLocationId: { type: Schema.Types.ObjectId, ref: "Location" },
  toLocationId: { type: Schema.Types.ObjectId, ref: "Location" },
  refDoc: { type: String },
  notes: { type: String },
  userId: { type: Schema.Types.ObjectId },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Movement || mongoose.model<Movement>("Movement", MovementSchema);
