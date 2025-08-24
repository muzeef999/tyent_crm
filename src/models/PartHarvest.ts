// models/PartHarvest.ts
import { PartHarvest } from "@/types/customer";
import mongoose, { Schema } from "mongoose";



const PartHarvestSchema = new Schema<PartHarvest>({
  sourceProductId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  sourceSerialId: { type: Schema.Types.ObjectId, ref: "Serial" },
  partProductId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  qty: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.models.PartHarvest || mongoose.model<PartHarvest>("PartHarvest", PartHarvestSchema);

