import mongoose from "mongoose";

const { Schema } = mongoose;

const LocationSchema = new Schema(
  {
    employeeId: { 
      type: Schema.Types.ObjectId, 
      ref: "Employee" 
    },
    type: {
      type: String,
      required: true,
      enum: ["WAREHOUSE", "OFFICE", "EMPLOYEE"],
    },
    city: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Register the model
const Location = mongoose.models.Location || mongoose.model("Location", LocationSchema);

export default Location;