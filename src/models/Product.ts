// models/Product.ts
import { Product } from "@/types/customer";
import mongoose, { Schema, Document } from "mongoose";

const ProductSchema = new Schema<Product>(
  {
    serialNumber: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    stock: {
      type: Number,
      default: 1, // initial stock
    },
    status: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      default: "In Stock",
      required:true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer", // product can be assigned to a customer
      default: null,
    },
  },
  { _id: false, timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model<Product>("Product", ProductSchema);
