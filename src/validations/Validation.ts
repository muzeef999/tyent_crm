// validations/employeeValidation.js
import { z } from "zod";

export const employeeValidation = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(50),
  email: z.string().email(),
  contactNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number format")
    .transform((val) => val.replace(/[^0-9]/g, "")),

  designation: z
    .enum([
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
    ])
    .optional(),

  status: z.enum(["ACTIVE", "INACTIVE", "ON_LEAVE"]).optional(),

  joiningDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"), // required

  lastWorkingDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional()
    .or(z.literal("")), // allow empty string

  address: z.string(),
  assignedServices: z.array(z.string()).optional(),
  aadharNumber: z
    .string()
    .min(12, "Aadhaar number must be 12 digits")
    .regex(/^[2-9]{1}[0-9]{11}$/, "Invalid Aadhaar number format"),

  panNumber: z
    .string()
    .regex(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      "Invalid PAN number format (e.g., ABCDE1234F)"
    ),
});

export const customerValidation = z
  .object({
    // Required fields
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .max(30, { message: "Name must be less than 30 characters" }),
    contactNumber: z
      .string()
      .min(8, { message: "Contact number is required" })
      .max(15, "Phone Number be less than 15 charcaters")
      .trim(),
    email: z.string().email().or(z.literal("")),
    address: z.string(),
    invoiceNumber: z.string().optional(),
    serialNumber: z.string().optional(),
    warrantyYears: z.string().optional(),
    remarks: z.string().optional(),

    // Enum fields
    installedModel: z
      .enum([
        "NMP-5",
        "NMP-7",
        "NMP-9",
        "NMP-11",
        "UCE-9",
        "UCE-11",
        "UCE-13",
        "Hbride-H2",
        "H-rich",
      ])
      .optional(),
    amcRenewed: z
      .enum(["SERVICE_AMC", "SERVICE_FILTER_AMC", "COMPREHENSIVE_AMC"])
      .optional(),

    // Numeric field
    price: z.number().nonnegative().optional(),

    // Date field
    DOB: z.coerce.date().optional(),

    // Boolean fields
    R0: z.boolean().optional(),
    pressureTank: z.boolean().optional(),

    // Reference fields (accept string IDs)
    installedBy: z.string().optional(),
    marketingManager: z.string().optional(),

    // Arrays of references
    payments: z.array(z.string()).optional(),
    serviceHistory: z.array(z.string()).optional(),
    upcomingServices: z.array(z.string()).optional(),
  })
  .strict();
