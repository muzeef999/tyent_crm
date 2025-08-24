import mongoose from "mongoose";
const { Schema } = mongoose;

const employeeSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, requred: true, unique: true },
    contactNumber: { type: String, requred: true, unique: true },
    designation: {
      type: String,
      enum: [
        "Admin",
        "Super Admin",
        "Marketing Manager",
        "Technical Manager",
        "Telecall Manager",
        "Stock Manager",
        "Account Manager",
        "Technician",
        "Telecaller",
        "Stock Clerk",
        "Accountant",
        "Customer Support",
        "Intern",
        "HR Executive",
        "Sales Executive",
      ],
    },
    status: { type: String, enum: ["ACTIVE", "INACTIVE", "ON_LEAVE"] },
    joiningDate: { type: Date, required: true },
    lastWorkingDate: { type: Date },
    address: { type: String },
    assignedServices: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    aadharNumber: {
      type: String,
      unique: true,
      match: [/^[2-9]{1}[0-9]{11}$/, "Invalid Aadhaar number format"],
      required: true,
    },
    panNumber: {
      type: String,
      unique: true,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format"],

      required: true,
    },
  },
  { timestamps: true }
);

const Employee =
  mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

export default Employee;
