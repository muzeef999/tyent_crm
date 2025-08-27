// models/Serial.ts
import { Serial } from "@/types/customer";
import mongoose, { Schema, } from "mongoose";



const SerialSchema = new Schema<Serial>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  serialNo: { type: String, required: true, unique: true },
  status: { type: String, enum: ["IN_STOCK", "DEMO", "INSTALLED", "SCRAP"], required: true },
  locationId: { type: Schema.Types.ObjectId, ref: "Location", required: true },
  holderId: { type: Schema.Types.ObjectId },
  notes: { type: String },
  history: [{
    date: { type: Date, required: true },
    fromLocationId: { type: Schema.Types.ObjectId, ref: "Location" },
    toLocationId: { type: Schema.Types.ObjectId, ref: "Location" },
    action: { type: String, enum: ["RECEIVE", "DISPATCH", "TRANSFER", "DEMO_ASSIGN", "DEMO_RETURN", "INSTALL", "SCRAP"], required: true },
    ref: { type: String },
    userId: { type: Schema.Types.ObjectId }
  }]
}, { timestamps: true });


SerialSchema.index({ productId: 1, locationId: 1 });

export default mongoose.models.Serial || mongoose.model<Serial>("Serial", SerialSchema);
