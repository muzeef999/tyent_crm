// models/Product.ts
import { Product } from "@/types/customer";
import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema<Product>(
  {
    _id: {
      type: String,
    },
    serialNumber: {
      type: String,
      unique: true,
      required: true,
    },
    name: { type: String, required: true },
    stock: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      default: "In Stock",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Before validation, sync _id with serialNumber
ProductSchema.pre("validate", function (next) {
  if (this.isNew && !this._id) {
    this._id = this.serialNumber;
  }
  next();
});

export default mongoose.models.Product ||
  mongoose.model<Product>("Product", ProductSchema);
